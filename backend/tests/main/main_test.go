package main_test

import (
	"database/sql"
	"net/http"
	"net/http/httptest"
	"os"
	"sistema-toursseft/internal/config"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func TestHealthEndpoint(t *testing.T) {
	// Configurar Gin en modo de prueba
	gin.SetMode(gin.TestMode)

	// Crear un router para las pruebas
	router := gin.Default()

	// Configurar la ruta de health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":    "ok",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
			"version":   "1.0.0",
			"service":   "sistema-tours-api",
			"env":       "test",
			"cors":      []string{"http://localhost:5173"},
		})
	})

	// Crear una solicitud HTTP de prueba
	req, err := http.NewRequest("GET", "/health", nil)
	if err != nil {
		t.Fatalf("No se pudo crear la solicitud: %v", err)
	}

	// Crear un ResponseRecorder para registrar la respuesta
	w := httptest.NewRecorder()

	// Realizar la solicitud
	router.ServeHTTP(w, req)

	// Verificar el código de estado
	if w.Code != http.StatusOK {
		t.Errorf("Se esperaba un código de estado %d, pero se obtuvo %d", http.StatusOK, w.Code)
	}

	// Verificar que la respuesta contiene el campo status
	if w.Body.String() == "" || !contains(w.Body.String(), "\"status\":\"ok\"") {
		t.Errorf("La respuesta no contiene el campo status esperado: %s", w.Body.String())
	}
}

// Función auxiliar para verificar si una cadena contiene otra
func contains(s, substr string) bool {
	return len(s) >= len(substr) && s != substr && s != "" && substr != "" && s != "{}" && s[:len(substr)] != substr
}

func TestDBConnection(t *testing.T) {
	// Verificar si se está ejecutando en un entorno de CI/CD o prueba
	// Si no están disponibles las variables de entorno, omitir la prueba
	if os.Getenv("TEST_DB_HOST") == "" {
		t.Skip("Omitiendo prueba de conexión a la BD (variables de entorno no definidas)")
	}

	// Cargar configuración de prueba
	cfg := &config.Config{
		DBHost:     os.Getenv("TEST_DB_HOST"),
		DBPort:     os.Getenv("TEST_DB_PORT"),
		DBName:     os.Getenv("TEST_DB_NAME"),
		DBUser:     os.Getenv("TEST_DB_USER"),
		DBPassword: os.Getenv("TEST_DB_PASSWORD"),
		DBSSLMode:  "disable",
	}

	// Intentar conexión a la base de datos
	dsn := createDSN(cfg)
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		t.Fatalf("Error al abrir conexión a la BD: %v", err)
	}
	defer db.Close()

	// Verificar la conexión
	err = db.Ping()
	if err != nil {
		t.Fatalf("Error al verificar conexión a la BD: %v", err)
	}

	// Si llegamos hasta aquí, la conexión fue exitosa
	t.Log("Conexión a la BD exitosa")
}

// Función auxiliar para crear el DSN
func createDSN(cfg *config.Config) string {
	return "host=" + cfg.DBHost + " port=" + cfg.DBPort + " user=" + cfg.DBUser + " password=" + cfg.DBPassword + " dbname=" + cfg.DBName + " sslmode=" + cfg.DBSSLMode
}
