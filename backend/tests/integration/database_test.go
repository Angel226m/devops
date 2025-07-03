package config_test

import (
	"database/sql"
	"fmt"
	"os"
	"strings"
	"testing"

	_ "github.com/lib/pq"
)

func getTestDB() (*sql.DB, error) {
	// Intentar usar variables de entorno; si no están disponibles, usar valores por defecto
	host := getEnvOrDefault("TEST_DB_HOST", "localhost")
	port := getEnvOrDefault("TEST_DB_PORT", "5432")
	user := getEnvOrDefault("TEST_DB_USER", "postgres")
	password := getEnvOrDefault("TEST_DB_PASSWORD", "postgres")
	dbname := getEnvOrDefault("TEST_DB_NAME", "sistema_tours_test")
	sslmode := getEnvOrDefault("TEST_DB_SSLMODE", "disable")

	// Construir el DSN
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode)

	// Abrir la conexión a la base de datos
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	// Verificar la conexión
	err = db.Ping()
	if err != nil {
		db.Close()
		return nil, err
	}

	return db, nil
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func TestDatabaseSchema(t *testing.T) {
	// Verificar si estamos en un entorno de CI o si tenemos acceso a una BD de prueba
	if os.Getenv("SKIP_DB_TESTS") == "true" {
		t.Skip("Omitiendo pruebas de base de datos")
	}

	// Obtener conexión a la BD
	db, err := getTestDB()
	if err != nil {
		t.Fatalf("No se pudo conectar a la base de datos: %v", err)
	}
	defer db.Close()

	// Verificar que las tablas principales existen
	tablesToCheck := []string{
		"sede",
		"usuario",
		"cliente",
		"tipo_tour",
		"instancia_tour",
		"reserva",
		"pago",
	}

	for _, table := range tablesToCheck {
		var exists bool
		err := db.QueryRow("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)", table).Scan(&exists)
		if err != nil {
			t.Fatalf("Error al verificar la existencia de la tabla %s: %v", table, err)
		}

		if !exists {
			t.Errorf("La tabla %s no existe en la base de datos", table)
		}
	}

	// Verificar que las columnas principales existen en la tabla de usuarios
	userColumnsToCheck := []string{
		"id_usuario",
		"nombres",
		"apellidos",
		"correo",
		"rol",
		"contrasena",
	}

	for _, column := range userColumnsToCheck {
		var exists bool
		query := `SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'usuario' AND column_name = $1
        )`
		err := db.QueryRow(query, column).Scan(&exists)
		if err != nil {
			t.Fatalf("Error al verificar la columna %s en la tabla usuario: %v", column, err)
		}

		if !exists {
			t.Errorf("La columna %s no existe en la tabla usuario", column)
		}
	}

	// Verificar que las claves foráneas están configuradas correctamente
	foreignKeysToCheck := map[string]string{
		"usuario.id_sede":          "sede.id_sede",
		"reserva.id_cliente":       "cliente.id_cliente",
		"reserva.id_instancia":     "instancia_tour.id_instancia",
		"pago.id_reserva":          "reserva.id_reserva",
		"instancia_tour.id_chofer": "usuario.id_usuario",
	}

	for sourceKey, targetKey := range foreignKeysToCheck {
		sourceParts := split(sourceKey, ".")
		targetParts := split(targetKey, ".")

		var exists bool
		query := `
			SELECT EXISTS (
				SELECT 1
				FROM information_schema.table_constraints tc
				JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
				JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
				JOIN information_schema.constraint_column_usage rcu ON rc.unique_constraint_name = rcu.constraint_name
				WHERE tc.constraint_type = 'FOREIGN KEY'
				AND tc.table_name = $1
				AND ccu.column_name = $2
				AND rcu.table_name = $3
				AND rcu.column_name = $4
			)
		`
		err := db.QueryRow(query, sourceParts[0], sourceParts[1], targetParts[0], targetParts[1]).Scan(&exists)
		if err != nil {
			t.Fatalf("Error al verificar la clave foránea %s -> %s: %v", sourceKey, targetKey, err)
		}

		if !exists {
			t.Errorf("La clave foránea %s -> %s no está configurada correctamente", sourceKey, targetKey)
		}
	}
}

// Función auxiliar para dividir una cadena
func split(s, delimiter string) []string {
	parts := make([]string, 2)
	for i, part := range strings.Split(s, delimiter) {
		if i < 2 {
			parts[i] = part
		}
	}
	return parts
}
