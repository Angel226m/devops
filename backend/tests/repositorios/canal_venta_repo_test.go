package repositorios_test

import (
	"database/sql"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
	"testing"

	_ "github.com/lib/pq" // 👈 Este es el que faltaba

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// setupTestDB configura una conexión a la base de datos de prueba
func setupTestDB(t *testing.T) *sql.DB {
	// Aquí deberías configurar una conexión a tu base de datos de prueba
	// Puedes usar variables de entorno específicas para pruebas
	db, err := sql.Open("postgres", "postgres://usuario:password@localhost:5432/toursseft_test?sslmode=disable")
	require.NoError(t, err)
	require.NoError(t, db.Ping())

	// Limpia y prepara la base de datos para las pruebas
	cleanDB(t, db)
	seedDB(t, db)

	return db
}

// cleanDB limpia las tablas relevantes en la base de datos
func cleanDB(t *testing.T, db *sql.DB) {
	_, err := db.Exec("DELETE FROM reserva WHERE id_canal > 0")
	require.NoError(t, err)
	_, err = db.Exec("DELETE FROM pago WHERE id_canal > 0")
	require.NoError(t, err)
	_, err = db.Exec("DELETE FROM canal_venta WHERE id_canal > 0")
	require.NoError(t, err)
	_, err = db.Exec("DELETE FROM sede WHERE id_sede > 0")
	require.NoError(t, err)
}

// seedDB inserta datos iniciales necesarios para las pruebas
func seedDB(t *testing.T, db *sql.DB) {
	// Insertar una sede para las pruebas
	var idSede int
	err := db.QueryRow("INSERT INTO sede (nombre, direccion, telefono, eliminado) VALUES ('Sede Test', 'Dirección Test', '123456789', false) RETURNING id_sede").Scan(&idSede)
	require.NoError(t, err)

	// Insertar un canal de venta para las pruebas
	_, err = db.Exec("INSERT INTO canal_venta (id_sede, nombre, descripcion, eliminado) VALUES ($1, 'Canal Test', 'Descripción Test', false)", idSede)
	require.NoError(t, err)
}

func TestCanalVentaRepository_GetByID(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	// Obtener el ID del canal insertado en seedDB
	var idCanal int
	err := db.QueryRow("SELECT id_canal FROM canal_venta WHERE nombre = 'Canal Test'").Scan(&idCanal)
	require.NoError(t, err)

	// Probar GetByID
	canal, err := repo.GetByID(idCanal)
	require.NoError(t, err)
	assert.NotNil(t, canal)
	assert.Equal(t, "Canal Test", canal.Nombre)
	assert.Equal(t, "Descripción Test", canal.Descripcion)
	assert.False(t, canal.Eliminado)
}

func TestCanalVentaRepository_GetByNombre(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	// Obtener el ID de la sede insertada en seedDB
	var idSede int
	err := db.QueryRow("SELECT id_sede FROM sede WHERE nombre = 'Sede Test'").Scan(&idSede)
	require.NoError(t, err)

	// Probar GetByNombre
	canal, err := repo.GetByNombre("Canal Test", idSede)
	require.NoError(t, err)
	assert.NotNil(t, canal)
	assert.Equal(t, "Canal Test", canal.Nombre)
	assert.Equal(t, idSede, canal.IDSede)
}

func TestCanalVentaRepository_Create(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	// Obtener el ID de la sede insertada en seedDB
	var idSede int
	err := db.QueryRow("SELECT id_sede FROM sede WHERE nombre = 'Sede Test'").Scan(&idSede)
	require.NoError(t, err)

	// Crear un nuevo canal
	nuevoCanalRequest := &entidades.NuevoCanalVentaRequest{
		IDSede:      idSede,
		Nombre:      "Nuevo Canal",
		Descripcion: "Nueva Descripción",
	}

	idNuevoCanal, err := repo.Create(nuevoCanalRequest)
	require.NoError(t, err)
	assert.Greater(t, idNuevoCanal, 0)

	// Verificar que se haya creado correctamente
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM canal_venta WHERE id_canal = $1", idNuevoCanal).Scan(&count)
	require.NoError(t, err)
	assert.Equal(t, 1, count)
}

func TestCanalVentaRepository_Update(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	// Obtener el ID del canal insertado en seedDB
	var idCanal int
	err := db.QueryRow("SELECT id_canal FROM canal_venta WHERE nombre = 'Canal Test'").Scan(&idCanal)
	require.NoError(t, err)

	// Obtener el ID de la sede insertada en seedDB
	var idSede int
	err = db.QueryRow("SELECT id_sede FROM sede WHERE nombre = 'Sede Test'").Scan(&idSede)
	require.NoError(t, err)

	// Actualizar el canal
	actualizarCanalRequest := &entidades.ActualizarCanalVentaRequest{
		IDSede:      idSede,
		Nombre:      "Canal Actualizado",
		Descripcion: "Descripción Actualizada",
		Eliminado:   false,
	}

	err = repo.Update(idCanal, actualizarCanalRequest)
	require.NoError(t, err)

	// Verificar que se haya actualizado correctamente
	var nombre, descripcion string
	err = db.QueryRow("SELECT nombre, descripcion FROM canal_venta WHERE id_canal = $1", idCanal).Scan(&nombre, &descripcion)
	require.NoError(t, err)
	assert.Equal(t, "Canal Actualizado", nombre)
	assert.Equal(t, "Descripción Actualizada", descripcion)
}

func TestCanalVentaRepository_Delete(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	// Obtener el ID del canal insertado en seedDB
	var idCanal int
	err := db.QueryRow("SELECT id_canal FROM canal_venta WHERE nombre = 'Canal Test'").Scan(&idCanal)
	require.NoError(t, err)

	// Eliminar el canal
	err = repo.Delete(idCanal)
	require.NoError(t, err)

	// Verificar que se haya marcado como eliminado
	var eliminado bool
	err = db.QueryRow("SELECT eliminado FROM canal_venta WHERE id_canal = $1", idCanal).Scan(&eliminado)
	require.NoError(t, err)
	assert.True(t, eliminado)
}

func TestCanalVentaRepository_List(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	// Listar todos los canales
	canales, err := repo.List()
	require.NoError(t, err)
	assert.NotEmpty(t, canales)
}

func TestCanalVentaRepository_ListBySede(t *testing.T) {
	db := setupTestDB(t)
	defer db.Close()

	repo := repositorios.NewCanalVentaRepository(db)

	// Obtener el ID de la sede insertada en seedDB
	var idSede int
	err := db.QueryRow("SELECT id_sede FROM sede WHERE nombre = 'Sede Test'").Scan(&idSede)
	require.NoError(t, err)

	// Listar canales por sede
	canales, err := repo.ListBySede(idSede)
	require.NoError(t, err)
	assert.NotEmpty(t, canales)

	// Verificar que todos los canales pertenezcan a la sede
	for _, canal := range canales {
		assert.Equal(t, idSede, canal.IDSede)
	}
}
