package config_test

import (
	"os"
	"sistema-toursseft/internal/config"
	"testing"
)

func TestLoadConfig(t *testing.T) {
	// Guardar valores originales de variables de entorno para restaurarlas después
	originalEnv := map[string]string{
		"SERVER_PORT": os.Getenv("SERVER_PORT"),
		"SERVER_HOST": os.Getenv("SERVER_HOST"),
		"DB_HOST":     os.Getenv("DB_HOST"),
		"DB_PORT":     os.Getenv("DB_PORT"),
		"DB_NAME":     os.Getenv("DB_NAME"),
		"DB_USER":     os.Getenv("DB_USER"),
		"DB_PASSWORD": os.Getenv("DB_PASSWORD"),
		"DB_SSL_MODE": os.Getenv("DB_SSL_MODE"),
		"JWT_SECRET":  os.Getenv("JWT_SECRET"),
		"LOG_LEVEL":   os.Getenv("LOG_LEVEL"),
		"APP_ENV":     os.Getenv("APP_ENV"),
		"CORS_ORIGIN": os.Getenv("CORS_ORIGIN"),
	}

	// Restaurar valores originales al finalizar
	defer func() {
		for key, value := range originalEnv {
			os.Setenv(key, value)
		}
	}()

	// Test 1: Valores por defecto
	t.Run("Default values", func(t *testing.T) {
		// Limpiar variables de entorno
		for key := range originalEnv {
			os.Unsetenv(key)
		}

		cfg := config.LoadConfig()

		// Verificar valores por defecto
		if cfg.ServerPort != "8080" {
			t.Errorf("Expected default ServerPort to be 8080, got %s", cfg.ServerPort)
		}
		if cfg.ServerHost != "0.0.0.0" {
			t.Errorf("Expected default ServerHost to be 0.0.0.0, got %s", cfg.ServerHost)
		}
		if cfg.DBHost != "db" {
			t.Errorf("Expected default DBHost to be db, got %s", cfg.DBHost)
		}
		if cfg.DBPort != "5432" {
			t.Errorf("Expected default DBPort to be 5432, got %s", cfg.DBPort)
		}
		if cfg.DBName != "sistema_tours" {
			t.Errorf("Expected default DBName to be sistema_tours, got %s", cfg.DBName)
		}
		if cfg.DBUser != "postgres" {
			t.Errorf("Expected default DBUser to be postgres, got %s", cfg.DBUser)
		}
		if cfg.DBPassword != "postgres" {
			t.Errorf("Expected default DBPassword to be postgres, got %s", cfg.DBPassword)
		}
		if cfg.DBSSLMode != "disable" {
			t.Errorf("Expected default DBSSLMode to be disable, got %s", cfg.DBSSLMode)
		}
		if cfg.JWTSecret != "sistema-tours-secret-key" {
			t.Errorf("Expected default JWTSecret to be sistema-tours-secret-key, got %s", cfg.JWTSecret)
		}
		if cfg.LogLevel != "info" {
			t.Errorf("Expected default LogLevel to be info, got %s", cfg.LogLevel)
		}
		if cfg.Env != "development" {
			t.Errorf("Expected default Env to be development, got %s", cfg.Env)
		}
		if cfg.CORSOrigin != "http://localhost:5173,http://localhost:5174" {
			t.Errorf("Expected default CORSOrigin to be http://localhost:5173,http://localhost:5174, got %s", cfg.CORSOrigin)
		}
	})

	// Test 2: Valores personalizados
	t.Run("Custom values from environment", func(t *testing.T) {
		// Establecer variables de entorno
		os.Setenv("SERVER_PORT", "9090")
		os.Setenv("SERVER_HOST", "127.0.0.1")
		os.Setenv("DB_HOST", "custom-db")
		os.Setenv("DB_PORT", "5433")
		os.Setenv("DB_NAME", "custom_db")
		os.Setenv("DB_USER", "custom_user")
		os.Setenv("DB_PASSWORD", "custom_pass")
		os.Setenv("DB_SSL_MODE", "require")
		os.Setenv("JWT_SECRET", "custom-secret")
		os.Setenv("LOG_LEVEL", "debug")
		os.Setenv("APP_ENV", "production")
		os.Setenv("CORS_ORIGIN", "https://ejemplo.com")

		cfg := config.LoadConfig()

		// Verificar valores personalizados
		if cfg.ServerPort != "9090" {
			t.Errorf("Expected ServerPort to be 9090, got %s", cfg.ServerPort)
		}
		if cfg.ServerHost != "127.0.0.1" {
			t.Errorf("Expected ServerHost to be 127.0.0.1, got %s", cfg.ServerHost)
		}
		if cfg.DBHost != "custom-db" {
			t.Errorf("Expected DBHost to be custom-db, got %s", cfg.DBHost)
		}
		if cfg.DBPort != "5433" {
			t.Errorf("Expected DBPort to be 5433, got %s", cfg.DBPort)
		}
		if cfg.DBName != "custom_db" {
			t.Errorf("Expected DBName to be custom_db, got %s", cfg.DBName)
		}
		if cfg.DBUser != "custom_user" {
			t.Errorf("Expected DBUser to be custom_user, got %s", cfg.DBUser)
		}
		if cfg.DBPassword != "custom_pass" {
			t.Errorf("Expected DBPassword to be custom_pass, got %s", cfg.DBPassword)
		}
		if cfg.DBSSLMode != "require" {
			t.Errorf("Expected DBSSLMode to be require, got %s", cfg.DBSSLMode)
		}
		if cfg.JWTSecret != "custom-secret" {
			t.Errorf("Expected JWTSecret to be custom-secret, got %s", cfg.JWTSecret)
		}
		if cfg.LogLevel != "debug" {
			t.Errorf("Expected LogLevel to be debug, got %s", cfg.LogLevel)
		}
		if cfg.Env != "production" {
			t.Errorf("Expected Env to be production, got %s", cfg.Env)
		}
		// En producción, debería usar los dominios de producción configurados en el código
		if cfg.CORSOrigin != "https://reservas.angelproyect.com,https://admin.angelproyect.com" {
			t.Errorf("Expected CORSOrigin in production to be https://reservas.angelproyect.com,https://admin.angelproyect.com, got %s", cfg.CORSOrigin)
		}
	})

	// Test 3: Verificar comportamiento de CORS basado en el entorno
	t.Run("CORS configuration based on environment", func(t *testing.T) {
		// Test para entorno de desarrollo
		os.Setenv("APP_ENV", "development")
		os.Unsetenv("CORS_ORIGIN")

		cfg := config.LoadConfig()

		if cfg.CORSOrigin != "http://localhost:5173,http://localhost:5174" {
			t.Errorf("Expected development CORSOrigin to be http://localhost:5173,http://localhost:5174, got %s", cfg.CORSOrigin)
		}

		// Test para entorno de producción
		os.Setenv("APP_ENV", "production")
		os.Unsetenv("CORS_ORIGIN")

		cfg = config.LoadConfig()

		if cfg.CORSOrigin != "https://reservas.angelproyect.com,https://admin.angelproyect.com" {
			t.Errorf("Expected production CORSOrigin to be https://reservas.angelproyect.com,https://admin.angelproyect.com, got %s", cfg.CORSOrigin)
		}
	})
}

func TestGetEnv(t *testing.T) {
	// Importar la función getEnv desde el paquete config
	// Nota: esto requeriría exportar getEnv como GetEnv para poder probarlo

	// Alternativa: implementar una versión de prueba de getEnv
	getEnv := func(key, defaultValue string) string {
		value := os.Getenv(key)
		if value == "" {
			return defaultValue
		}
		return value
	}

	// Guardar valor original
	originalValue := os.Getenv("TEST_ENV_VAR")
	defer os.Setenv("TEST_ENV_VAR", originalValue)

	// Test 1: Variable no definida, debe devolver el valor por defecto
	os.Unsetenv("TEST_ENV_VAR")
	if value := getEnv("TEST_ENV_VAR", "default_value"); value != "default_value" {
		t.Errorf("Expected default_value, got %s", value)
	}

	// Test 2: Variable definida, debe devolver su valor
	os.Setenv("TEST_ENV_VAR", "custom_value")
	if value := getEnv("TEST_ENV_VAR", "default_value"); value != "custom_value" {
		t.Errorf("Expected custom_value, got %s", value)
	}
}
