package utils

import (
	"os"

	"github.com/gin-gonic/gin"
)

// GetFrontendURL obtiene la URL base del frontend a partir del contexto o variables de entorno
func GetFrontendURL(ctx *gin.Context) string {
	// Primero intentar obtener la URL del frontend desde una variable de entorno
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL != "" {
		return frontendURL
	}

	// Si no está configurada, intentar construirla a partir del encabezado Origin o Referer
	origin := ctx.GetHeader("Origin")
	if origin != "" {
		return origin
	}

	referer := ctx.GetHeader("Referer")
	if referer != "" {
		// Extraer la parte base de la URL del Referer
		for i := 0; i < len(referer); i++ {
			if i+3 < len(referer) && referer[i:i+3] == "://" {
				for j := i + 3; j < len(referer); j++ {
					if referer[j] == '/' {
						return referer[:j]
					}
				}
				return referer
			}
		}
	}

	// Si todo falla, usar un valor predeterminado
	return "https://reservas.angelproyect.com"
}
