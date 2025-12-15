package config_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"sistema-toursseft/internal/config"
	"sistema-toursseft/internal/controladores"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
	"sistema-toursseft/internal/servicios"
	"strconv"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func findCookies(rec *httptest.ResponseRecorder, name string) *http.Cookie {
	for _, c := range rec.Result().Cookies() {
		if c.Name == name {
			return c
		}
	}
	return nil
}

func TestCliente_CRUD_Y_Login(t *testing.T) {
	// Setup DB
	gormDB, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	require.NoError(t, err)

	sqlDB, err := gormDB.DB()
	require.NoError(t, err)
	defer sqlDB.Close()

	// Crear tablas: cliente + reserva (para que el delete funcione)
	createSQL := `
	CREATE TABLE cliente (
		id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
		tipo_documento TEXT NOT NULL,
		numero_documento TEXT NOT NULL,
		nombres TEXT,
		apellidos TEXT,
		correo TEXT UNIQUE,
		numero_celular TEXT,
		razon_social TEXT,
		direccion_fiscal TEXT,
		contrasena TEXT NOT NULL,
		eliminado BOOLEAN DEFAULT 0
	);

	CREATE TABLE reserva (
		id_reserva INTEGER PRIMARY KEY AUTOINCREMENT,
		id_cliente INTEGER,
		eliminado BOOLEAN DEFAULT 0
	);

	CREATE UNIQUE INDEX idx_cliente_correo ON cliente(correo);
	CREATE UNIQUE INDEX idx_cliente_documento ON cliente(tipo_documento, numero_documento);
	`
	require.NoError(t, gormDB.Exec(createSQL).Error)

	// Setup router
	router := gin.New()
	clienteRepo := repositorios.NewClienteRepository(sqlDB)
	clienteService := servicios.NewClienteService(clienteRepo, &config.Config{
		JWTSecret:        "test-secret",
		JWTRefreshSecret: "test-refresh-secret",
	})
	clienteController := controladores.NewClienteController(clienteService, &config.Config{
		JWTSecret:        "test-secret",
		JWTRefreshSecret: "test-refresh-secret",
	})

	api := router.Group("/api")
	{
		api.POST("/clientes", clienteController.Create)
		api.GET("/clientes/:id", clienteController.GetByID)
		api.PUT("/clientes/:id", clienteController.Update)
		api.DELETE("/clientes/:id", clienteController.Delete)
		api.GET("/clientes", clienteController.List)
		api.POST("/clientes/login", clienteController.Login)
	}

	// 1. Crear cliente persona natural
	clienteNatural := entidades.NuevoClienteRequest{
		TipoDocumento:   "DNI",
		NumeroDocumento: "12345678",
		Nombres:         "Juan",
		Apellidos:       "Pérez",
		Correo:          "juan@test.com",
		NumeroCelular:   "987654321",
		Contrasena:      "password123",
	}
	body, _ := json.Marshal(clienteNatural)

	req := httptest.NewRequest("POST", "/api/clientes", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	var respCreate struct {
		Success bool                   `json:"success"`
		Data    map[string]interface{} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respCreate))
	idNatural := int(respCreate.Data["id"].(float64))

	// 2. Crear cliente empresa (RUC)
	clienteEmpresa := entidades.NuevoClienteRequest{
		TipoDocumento:   "RUC",
		NumeroDocumento: "20123456789",
		RazonSocial:     "Empresa Test SAC",
		DireccionFiscal: "Av Empresa 123",
		Correo:          "empresa@test.com",
		NumeroCelular:   "999888777",
		Contrasena:      "empresa123",
	}
	body, _ = json.Marshal(clienteEmpresa)

	req = httptest.NewRequest("POST", "/api/clientes", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respCreate))
	idEmpresa := int(respCreate.Data["id"].(float64))

	// 3. Login cliente natural
	loginNatural := struct {
		Correo     string `json:"correo"`
		Contrasena string `json:"contrasena"`
	}{
		Correo:     "juan@test.com",
		Contrasena: "password123",
	}
	body, _ = json.Marshal(loginNatural)

	req = httptest.NewRequest("POST", "/api/clientes/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var respLogin struct {
		Success bool                   `json:"success"`
		Data    map[string]interface{} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respLogin))

	usuarioLogin := respLogin.Data["usuario"].(map[string]interface{})
	assert.Equal(t, "Juan Pérez", usuarioLogin["nombre_completo"])
	assert.NotNil(t, findCookies(w, "access_token"))
	assert.NotNil(t, findCookies(w, "refresh_token"))

	// 4. Actualización parcial (incluyendo tipo y número para pasar validación)
	updatePartial := entidades.ActualizarClienteRequest{
		TipoDocumento:   "DNI",
		NumeroDocumento: "12345678",
		Nombres:         "Juan Carlos",
		Apellidos:       "Pérez García",
		Correo:          "juan.nuevo@test.com",
		NumeroCelular:   "987654000",
	}
	body, _ = json.Marshal(updatePartial)

	req = httptest.NewRequest("PUT", "/api/clientes/"+strconv.Itoa(idNatural), bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	// Verificar actualización
	req = httptest.NewRequest("GET", "/api/clientes/"+strconv.Itoa(idNatural), nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	var respGet struct {
		Data entidades.Cliente `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respGet))
	assert.Equal(t, "Juan Carlos", respGet.Data.Nombres)
	assert.Equal(t, "juan.nuevo@test.com", respGet.Data.Correo)

	// 5. Eliminar cliente empresa
	req = httptest.NewRequest("DELETE", "/api/clientes/"+strconv.Itoa(idEmpresa), nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	// 6. Listar todos (solo queda 1)
	req = httptest.NewRequest("GET", "/api/clientes", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	var respList struct {
		Data []entidades.Cliente `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respList))
	assert.Len(t, respList.Data, 1)
	assert.Equal(t, "Juan Carlos", respList.Data[0].Nombres)
}
