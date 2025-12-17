package config

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	// Servidor
	ServerPort string
	ServerHost string

	// Base de datos
	DBHost     string
	DBPort     string
	DBName     string
	DBUser     string
	DBPassword string
	DBSSLMode  string

	// JWT
	JWTSecret        string
	JWTRefreshSecret string
	JWTExpiration    time.Duration

	// Aplicación
	LogLevel string
	Env      string

	// ✅ Nuevos campos para producción
	CORSOrigin    string
	EncryptionKey string
}

func LoadConfig() *Config {
	// Intentar cargar .env si existe
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ No se encontró archivo .env, usando variables de entorno del sistema")
	}

	config := &Config{
		// Servidor
		ServerPort: getEnv("SERVER_PORT", "8080"),
		ServerHost: getEnv("SERVER_HOST", "0.0.0.0"),

		// Base de datos
		DBHost:     getEnv("DB_HOST", "db"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBName:     getEnv("DB_NAME", "sistema_tours"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "postgres"),
		DBSSLMode:  getEnv("DB_SSL_MODE", "disable"),

		// JWT
		JWTSecret:        getEnv("JWT_SECRET", "sistema-tours-secret-key"),
		JWTRefreshSecret: getEnv("JWT_REFRESH_SECRET", "sistema-tours-refresh-secret-key"),
		JWTExpiration:    time.Hour * 24,

		// Aplicación
		LogLevel:      getEnv("LOG_LEVEL", "info"),
		Env:           getEnv("APP_ENV", "development"),
		EncryptionKey: getEnv("ENCRYPTION_KEY", ""),
		// ✅ CORS
		/*CORSOrigin: getEnv("CORS_ORIGIN", "http://localhost:5173"),*/ /*falta linea de configuración para producción*/

	} //eliminar si falla
	// Configuración de CORS basada en el entorno
	if config.Env == "production" {
		config.CORSOrigin = getEnv("CORS_ORIGIN", "https://reservas.angelproyect.com,https://admin.angelproyect.com")
		log.Printf("✅ CORS configurado para producción: %s", config.CORSOrigin)
	} else {
		// Para desarrollo, usar múltiples orígenes separados por comas
		config.CORSOrigin = getEnv("CORS_ORIGIN", "http://localhost:5173,http://localhost:5174")
		log.Printf("✅ CORS configurado para desarrollo: %s", config.CORSOrigin)
	}
	if config.EncryptionKey != "" && len(config.EncryptionKey) != 32 {
		log.Fatalf("❌ ENCRYPTION_KEY debe ser de 32 caracteres, tiene %d", len(config.EncryptionKey))
	}
	// Parsear duración de JWT
	if jwtExp := getEnv("JWT_EXPIRATION_HOURS", ""); jwtExp != "" {
		if hours, err := strconv.Atoi(jwtExp); err == nil {
			config.JWTExpiration = time.Hour * time.Duration(hours)
		}
	}

	// Log de configuración (sin contraseñas)
	log.Printf("🔧 Config cargada: Env=%s, Host=%s:%s, DB=%s:%s/%s",
		config.Env, config.ServerHost, config.ServerPort,
		config.DBHost, config.DBPort, config.DBName)

	return config
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
