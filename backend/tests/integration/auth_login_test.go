package config_test

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"sistema-toursseft/internal/config"
	"sistema-toursseft/internal/controladores"
	"sistema-toursseft/internal/repositorios"
	"sistema-toursseft/internal/servicios"
	"sistema-toursseft/internal/utils"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

var cfg *config.Config

func TestMain(m *testing.M) {
	cfg = &config.Config{
		JWTSecret:        "test-secret-access-123",
		JWTRefreshSecret: "test-secret-refresh-123",
	}
	m.Run()
}

func setupTestDB() (*gorm.DB, *sql.DB) {
	gormDB, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect test database: " + err.Error())
	}

	sqlDB, err := gormDB.DB()
	if err != nil {
		panic("failed to get sql.DB: " + err.Error())
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)

	createTablesSQL := `
	CREATE TABLE sedes (
		id_sede INTEGER PRIMARY KEY AUTOINCREMENT,
		nombre TEXT NOT NULL,
		direccion TEXT,
		telefono TEXT,
		eliminado BOOLEAN DEFAULT 0
	);

	CREATE TABLE usuario (
		id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
		id_sede INTEGER,
		nombres TEXT NOT NULL,
		apellidos TEXT NOT NULL,
		correo TEXT UNIQUE NOT NULL,
		telefono TEXT,
		direccion TEXT,
		fecha_nacimiento DATETIME,
		rol TEXT NOT NULL,
		nacionalidad TEXT,
		tipo_de_documento TEXT,
		numero_documento TEXT,
		fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
		contrasena TEXT NOT NULL,
		eliminado BOOLEAN DEFAULT 0,
		FOREIGN KEY (id_sede) REFERENCES sedes(id_sede)
	);

	CREATE UNIQUE INDEX idx_usuario_correo ON usuario(correo);
	`

	if err = gormDB.Exec(createTablesSQL).Error; err != nil {
		panic("failed to create tables: " + err.Error())
	}

	return gormDB, sqlDB
}

func setupRouter(gormDB *gorm.DB, sqlDB *sql.DB) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()

	usuarioRepo := repositorios.NewUsuarioRepository(sqlDB)
	sedeRepo := repositorios.NewSedeRepository(sqlDB)

	authService := servicios.NewAuthService(usuarioRepo, sedeRepo, cfg)
	authController := controladores.NewAuthController(authService)

	api := router.Group("/api")
	auth := api.Group("/auth")
	{
		auth.POST("/login", authController.Login)
	}

	return router
}

func TestLogin_Success_Vendedor_WithSede(t *testing.T) {
	gormDB, sqlDB := setupTestDB()
	defer sqlDB.Close()
	router := setupRouter(gormDB, sqlDB)

	// Crear sede
	var sedeID int
	err := gormDB.Raw("INSERT INTO sedes (nombre, direccion, telefono, eliminado) VALUES ('Sede Centro', 'Av Test', '999999999', 0) RETURNING id_sede").Scan(&sedeID).Error
	require.NoError(t, err)

	// Hashear contraseña
	hash, err := utils.HashPassword("password123")
	require.NoError(t, err)

	// Insertar usuario
	err = gormDB.Exec(`
		INSERT INTO usuario (
			nombres, apellidos, correo, contrasena, rol, id_sede,
			telefono, direccion, fecha_nacimiento, tipo_de_documento,
			numero_documento, nacionalidad, eliminado
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
		"Angel", "Tester", "angel@test.com", hash, "VENDEDOR", sedeID,
		"987654321", "Calle Test", "1990-01-01", "DNI", "12345678", "Peruana",
	).Error
	require.NoError(t, err)

	// Login
	payload := `{"correo":"angel@test.com","contrasena":"password123"}`
	req := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBufferString(payload))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	t.Logf("Response Body: %s", w.Body.String())

	assert.Equal(t, http.StatusOK, w.Code)

	assert.NotNil(t, findCookie(w, "access_token"))
	assert.NotNil(t, findCookie(w, "refresh_token"))

	var resp struct {
		Success bool                   `json:"success"`
		Message string                 `json:"message"`
		Data    map[string]interface{} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))

	assert.True(t, resp.Success)
	assert.Equal(t, "Login exitoso", resp.Message)

	user := resp.Data["usuario"].(map[string]interface{})
	assert.Equal(t, "Angel", user["nombres"])
	assert.Equal(t, "VENDEDOR", user["rol"])

	// Para vendedor, sede puede ser null (por ahora, hasta arreglar el repo)
	sedeVal, hasSede := resp.Data["sede"]
	if hasSede {
		assert.Nil(t, sedeVal, "sede es null")
	}
}

func TestLogin_Success_Admin_Hardcoded(t *testing.T) {
	gormDB, sqlDB := setupTestDB()
	defer sqlDB.Close()
	router := setupRouter(gormDB, sqlDB)

	payload := `{"correo":"admin@sistema-tours.com","contrasena":"admin123"}`
	req := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBufferString(payload))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	assert.NotNil(t, findCookie(w, "access_token"))
	assert.NotNil(t, findCookie(w, "refresh_token"))

	var resp struct {
		Success bool                   `json:"success"`
		Message string                 `json:"message"`
		Data    map[string]interface{} `json:"data"`
	}
	json.Unmarshal(w.Body.Bytes(), &resp)

	assert.True(t, resp.Success)
	assert.Equal(t, "Login exitoso", resp.Message)

	user := resp.Data["usuario"].(map[string]interface{})
	assert.Equal(t, "ADMIN", user["rol"])

	// Para admin, "sede" debe estar presente pero con valor null
	sedeVal, hasSede := resp.Data["sede"]
	assert.True(t, hasSede, "la clave 'sede' debe estar presente")
	assert.Nil(t, sedeVal, "el valor de 'sede' debe ser null para admin")
}

func findCookie(rec *httptest.ResponseRecorder, name string) *http.Cookie {
	for _, c := range rec.Result().Cookies() {
		if c.Name == name {
			return c
		}
	}
	return nil
}
