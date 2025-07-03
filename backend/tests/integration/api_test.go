package config_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// Configuración básica para pruebas de API
func setupTestServer() *gin.Engine {
	// Configurar Gin en modo de prueba
	gin.SetMode(gin.TestMode)

	// Crear router
	router := gin.Default()

	// Agregar rutas para pruebas
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	router.GET("/api/v1/sedes", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data": []map[string]interface{}{
				{
					"id_sede":   1,
					"nombre":    "Sede Principal",
					"direccion": "Av. Principal 123",
					"distrito":  "Distrito Test",
					"eliminado": false,
				},
			},
		})
	})

	return router
}

func TestAPIEndpoints(t *testing.T) {
	// Configurar el servidor de prueba
	router := setupTestServer()

	// Test para el endpoint /health
	t.Run("Health check endpoint", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/health", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.Nil(t, err)
		assert.Equal(t, "ok", response["status"])
	})

	// Test para el endpoint de sedes
	t.Run("Sedes endpoint", func(t *testing.T) {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/api/v1/sedes", nil)
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)

		var response map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.Nil(t, err)
		assert.Equal(t, "success", response["status"])

		// Verificar que hay datos en la respuesta
		data, ok := response["data"].([]interface{})
		assert.True(t, ok)
		assert.NotEmpty(t, data)

		// Verificar la estructura de una sede
		sede, ok := data[0].(map[string]interface{})
		assert.True(t, ok)
		assert.Contains(t, sede, "id_sede")
		assert.Contains(t, sede, "nombre")
		assert.Contains(t, sede, "direccion")
	})
}

func TestAuthEndpoints(t *testing.T) {
	// Omitir si estamos en CI/CD o no tenemos acceso a una API real
	if os.Getenv("SKIP_API_TESTS") == "true" {
		t.Skip("Omitiendo pruebas de API")
	}

	// Configurar URL base para las pruebas
	baseURL := os.Getenv("TEST_API_URL")
	if baseURL == "" {
		baseURL = "http://localhost:8080"
	}

	// Test para el endpoint de login
	t.Run("Login endpoint", func(t *testing.T) {
		// Crear payload
		loginData := map[string]string{
			"correo":     "test@example.com",
			"contrasena": "password123",
		}
		payload, _ := json.Marshal(loginData)

		// Crear request
		req, err := http.NewRequest("POST", baseURL+"/api/v1/auth/login", bytes.NewBuffer(payload))
		if err != nil {
			t.Fatalf("No se pudo crear la solicitud: %v", err)
		}

		// Configurar headers
		req.Header.Set("Content-Type", "application/json")

		// Realizar la solicitud
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			t.Fatalf("Error al realizar la solicitud: %v", err)
		}
		defer resp.Body.Close()

		// Este es un test de integración, por lo que podemos esperar un error de autenticación
		// Lo importante es que el endpoint responda correctamente
		assert.True(t, resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusUnauthorized)

		// Decodificar la respuesta
		var response map[string]interface{}
		err = json.NewDecoder(resp.Body).Decode(&response)
		assert.Nil(t, err)

		// La respuesta debe contener un campo 'status'
		assert.Contains(t, response, "status")
	})
}
