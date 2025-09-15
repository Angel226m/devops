package main

import (
    "net/http"
    "net/http/httptest"
    "testing"
    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
)

func setupRouter() *gin.Engine {
    router := gin.Default()
    router.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "status":    "ok",
            "timestamp": "2025-09-06T19:43:00Z",
            "version":   "1.0.0",
            "service":   "sistema-tours-api",
            "env":       "test",
            "cors":      []string{"http://localhost:5173"},
        })
    })
    return router
}

func TestHealthEndpoint(t *testing.T) {
    router := setupRouter()

    // Crear una solicitud HTTP
    req, _ := http.NewRequest("GET", "/health", nil)
    w := httptest.NewRecorder()
    router.ServeHTTP(w, req)

    // Verificar la respuesta
    assert.Equal(t, http.StatusOK, w.Code, "El código de estado debería ser 200")
    assert.Contains(t, w.Body.String(), `"status":"ok"`, "La respuesta debería contener status: ok")
    assert.Contains(t, w.Body.String(), `"version":"1.0.0"`, "La respuesta debería contener la versión")
}