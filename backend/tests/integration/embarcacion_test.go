package config_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
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

func TestEmbarcacion_CRUD(t *testing.T) {
	// Setup DB
	gormDB, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	require.NoError(t, err)

	sqlDB, err := gormDB.DB()
	require.NoError(t, err)
	defer sqlDB.Close()

	// TABLA "sede" (singular) con TODAS las columnas que el repositorio lee
	createSQL := `
	CREATE TABLE sede (
		id_sede INTEGER PRIMARY KEY AUTOINCREMENT,
		nombre TEXT NOT NULL,
		direccion TEXT,
		telefono TEXT,
		correo TEXT,
		distrito TEXT,
		provincia TEXT,
		pais TEXT,
		image_url TEXT,
		eliminado BOOLEAN DEFAULT 0
	);

	CREATE TABLE embarcacion (
		id_embarcacion INTEGER PRIMARY KEY AUTOINCREMENT,
		id_sede INTEGER NOT NULL,
		nombre TEXT NOT NULL,
		capacidad INTEGER NOT NULL,
		descripcion TEXT,
		eliminado BOOLEAN DEFAULT 0,
		estado TEXT NOT NULL,
		FOREIGN KEY (id_sede) REFERENCES sede(id_sede)
	);
	`
	require.NoError(t, gormDB.Exec(createSQL).Error)

	// Setup router
	router := gin.New()
	sedeRepo := repositorios.NewSedeRepository(sqlDB)
	embarcacionRepo := repositorios.NewEmbarcacionRepository(sqlDB)
	embarcacionService := servicios.NewEmbarcacionService(embarcacionRepo, sedeRepo)
	embarcacionController := controladores.NewEmbarcacionController(embarcacionService)

	api := router.Group("/api")
	{
		api.POST("/embarcaciones", embarcacionController.Create)
		api.GET("/embarcaciones/:id", embarcacionController.GetByID)
		api.PUT("/embarcaciones/:id", embarcacionController.Update)
		api.DELETE("/embarcaciones/:id", embarcacionController.Delete)
		api.GET("/embarcaciones", embarcacionController.List)
		api.GET("/embarcaciones/sede/:idSede", embarcacionController.ListBySede)
		api.GET("/embarcaciones/estado/:estado", embarcacionController.ListByEstado)
	}

	// Crear sede con todas las columnas necesarias
	var sedeID int
	err = gormDB.Raw(`
		INSERT INTO sede (nombre, direccion, telefono, correo, distrito, provincia, pais, image_url, eliminado) 
		VALUES ('Sede Principal', 'Av Central 100', '999999999', 'sede@test.com', 'Miraflores', 'Lima', 'Perú', '', 0) 
		RETURNING id_sede
	`).Scan(&sedeID).Error
	require.NoError(t, err)

	// Crear embarcación
	nueva := entidades.NuevaEmbarcacionRequest{
		IDSede:      sedeID,
		Nombre:      "Lancha Tour",
		Capacidad:   30,
		Descripcion: "Para tours diarios",
		Estado:      "DISPONIBLE",
	}
	body, _ := json.Marshal(nueva)

	req := httptest.NewRequest("POST", "/api/embarcaciones", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code, "Error al crear: "+w.Body.String())

	var respCreate struct {
		Success bool                   `json:"success"`
		Data    map[string]interface{} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respCreate))
	id := int(respCreate.Data["id"].(float64))

	// Obtener por ID
	req = httptest.NewRequest("GET", "/api/embarcaciones/"+strconv.Itoa(id), nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	var respGet struct {
		Data entidades.Embarcacion `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respGet))
	assert.Equal(t, "Lancha Tour", respGet.Data.Nombre)
	assert.Equal(t, "DISPONIBLE", respGet.Data.Estado)

	// Listar
	req = httptest.NewRequest("GET", "/api/embarcaciones", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	var respList struct {
		Data []entidades.Embarcacion `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respList))
	assert.Len(t, respList.Data, 1)

	// Actualizar
	update := entidades.ActualizarEmbarcacionRequest{
		IDSede:      sedeID,
		Nombre:      "Lancha Actualizada",
		Capacidad:   35,
		Descripcion: "Nueva descripción",
		Estado:      "MANTENIMIENTO",
	}
	body, _ = json.Marshal(update)
	req = httptest.NewRequest("PUT", "/api/embarcaciones/"+strconv.Itoa(id), bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	// Verificar actualización
	req = httptest.NewRequest("GET", "/api/embarcaciones/"+strconv.Itoa(id), nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respGet))
	assert.Equal(t, "Lancha Actualizada", respGet.Data.Nombre)
	assert.Equal(t, "MANTENIMIENTO", respGet.Data.Estado)

	// Eliminar
	req = httptest.NewRequest("DELETE", "/api/embarcaciones/"+strconv.Itoa(id), nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	// No aparece en list
	req = httptest.NewRequest("GET", "/api/embarcaciones", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respList))
	assert.Len(t, respList.Data, 0)
}
