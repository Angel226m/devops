// archivo: repositorios/pago_repository_test.go
package repositorios_test

import (
	"database/sql"
	"errors"
	"regexp"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

var (
	mockFechaPago     = time.Date(2025, 12, 13, 10, 30, 0, 0, time.UTC)
	mockTourFecha     = time.Date(2025, 12, 20, 0, 0, 0, 0, time.UTC)
	mockFechaBusqueda = time.Date(2025, 12, 13, 0, 0, 0, 0, time.UTC)
)

// Columnas comunes usadas en todas las consultas de lista
func pagoColumns() []string {
	return []string{
		"id_pago", "id_reserva", "metodo_pago", "canal_pago", "id_sede",
		"monto", "fecha_pago", "estado", "comprobante", "numero_comprobante",
		"url_comprobante", "eliminado",
		"nombres", "apellidos", "numero_documento",
		"nombre_sede", "nombre", "fecha_especifica",
	}
}

func setupPagoRepo(t *testing.T) (*repositorios.PagoRepository, sqlmock.Sqlmock) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	repo := repositorios.NewPagoRepository(db)
	return repo, mock
}

func TestPagoRepository_GetByID(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	t.Run("Éxito - Pago encontrado (sede Web)", func(t *testing.T) {
		rows := sqlmock.NewRows(pagoColumns()).AddRow(
			1, 100, "EFECTIVO", "PRESENCIAL", nil,
			250.50, mockFechaPago, "PROCESADO", "Boleta", "N-COMP-00001",
			"https://pdf.com/1.pdf", false,
			"María", "Gómez", "12345678",
			"Web", "Tour Machu Picchu", mockTourFecha,
		)

		mock.ExpectQuery(regexp.QuoteMeta("SELECT p.id_pago")).
			WithArgs(1).
			WillReturnRows(rows)

		pago, err := repo.GetByID(1)

		assert.NoError(t, err)
		assert.NotNil(t, pago)
		assert.Equal(t, "María", pago.NombreCliente)
		assert.Nil(t, pago.IDSede)
		assert.Equal(t, "Web", pago.NombreSede)
	})

	t.Run("Éxito - Pago encontrado (con sede física)", func(t *testing.T) {
		idSede := sql.NullInt64{Int64: 5, Valid: true}
		rows := sqlmock.NewRows(pagoColumns()).AddRow(
			2, 101, "YAPE", "APP", idSede,
			180.0, mockFechaPago, "PROCESADO", "Boleta", "N-COMP-00002",
			"https://pdf.com/2.pdf", false,
			"Carlos", "Ruiz", "98765432",
			"Sede Norte", "City Tour", mockTourFecha,
		)

		mock.ExpectQuery(regexp.QuoteMeta("SELECT p.id_pago")).
			WithArgs(2).
			WillReturnRows(rows)

		pago, err := repo.GetByID(2)

		assert.NoError(t, err)
		assert.NotNil(t, pago)
		assert.NotNil(t, pago.IDSede)
		assert.Equal(t, 5, *pago.IDSede)
	})

	t.Run("No encontrado", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta("SELECT p.id_pago")).
			WithArgs(999).
			WillReturnError(sql.ErrNoRows)

		pago, err := repo.GetByID(999)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), "pago no encontrado")
		assert.Nil(t, pago)
	})

	t.Run("Error de base de datos", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta("SELECT p.id_pago")).
			WithArgs(1).
			WillReturnError(errors.New("connection failed"))

		pago, err := repo.GetByID(1)

		assert.Error(t, err)
		assert.Nil(t, pago)
	})
}

func TestPagoRepository_Create(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	nuevo := &entidades.NuevoPagoRequest{
		IDReserva:   150,
		MetodoPago:  "TARJETA",
		CanalPago:   "WEB",
		Monto:       420.0,
		Comprobante: "Factura",
	}

	t.Run("Éxito - Genera comprobante automático", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta("SELECT COALESCE(MAX")).
			WillReturnRows(sqlmock.NewRows([]string{"coalesce"}).AddRow(10))

		mock.ExpectQuery(regexp.QuoteMeta("INSERT INTO pago")).
			WithArgs(
				150, "TARJETA", "WEB", sqlmock.AnyArg(), 420.0, "Factura",
				"N-COMP-00011", "https://tu-sitio.com/comprobantes/N-COMP-00011.pdf",
			).
			WillReturnRows(sqlmock.NewRows([]string{"id_pago"}).AddRow(30))

		mock.ExpectCommit()

		id, err := repo.Create(nuevo)
		assert.NoError(t, err)
		assert.Equal(t, 30, id)
	})

	t.Run("Éxito - Usa comprobante personalizado", func(t *testing.T) {
		nuevo.NumeroComprobante = "CUSTOM-999"
		nuevo.URLComprobante = "https://externo.com/custom.pdf"

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta("SELECT COALESCE(MAX")).
			WillReturnRows(sqlmock.NewRows([]string{"coalesce"}).AddRow(0))

		mock.ExpectQuery(regexp.QuoteMeta("INSERT INTO pago")).
			WithArgs(150, "TARJETA", "WEB", sqlmock.AnyArg(), 420.0, "Factura", "CUSTOM-999", "https://externo.com/custom.pdf").
			WillReturnRows(sqlmock.NewRows([]string{"id_pago"}).AddRow(31))

		mock.ExpectCommit()

		id, err := repo.Create(nuevo)
		assert.NoError(t, err)
		assert.Equal(t, 31, id)
	})
}

func TestPagoRepository_Update(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	updateReq := &entidades.ActualizarPagoRequest{
		MetodoPago:        "PLIN",
		CanalPago:         "APP",
		IDSede:            nil,
		Monto:             99.99,
		Comprobante:       "Ticket",
		NumeroComprobante: "N-COMP-99999",
		URLComprobante:    "https://new.pdf",
		Estado:            "ANULADO",
	}

	mock.ExpectExec(regexp.QuoteMeta("UPDATE pago SET")).
		WithArgs("PLIN", "APP", nil, 99.99, "Ticket", "N-COMP-99999", "https://new.pdf", "ANULADO", 10).
		WillReturnResult(sqlmock.NewResult(1, 1))

	err := repo.Update(10, updateReq)
	assert.NoError(t, err)
}

func TestPagoRepository_UpdateEstado(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	mock.ExpectExec(regexp.QuoteMeta("UPDATE pago SET estado")).
		WithArgs("RECHAZADO", 15).
		WillReturnResult(sqlmock.NewResult(1, 1))

	err := repo.UpdateEstado(15, "RECHAZADO")
	assert.NoError(t, err)
}

func TestPagoRepository_Delete(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	mock.ExpectQuery(regexp.QuoteMeta("SELECT id_reserva FROM pago")).
		WithArgs(20).
		WillReturnRows(sqlmock.NewRows([]string{"id_reserva"}).AddRow(300))

	mock.ExpectExec(regexp.QuoteMeta("UPDATE pago SET eliminado")).
		WithArgs(20).
		WillReturnResult(sqlmock.NewResult(1, 1))

	err := repo.Delete(20)
	assert.NoError(t, err)
}

func TestPagoRepository_List(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	rows := sqlmock.NewRows(pagoColumns()).AddRow(
		1, 100, "TARJETA", "WEB", nil,
		350.0, mockFechaPago, "PROCESADO", "Factura", "N-COMP-00005",
		"https://pdf.com/5.pdf", false,
		"Ana", "López", "87654321",
		"Web", "Tour Cusco", mockTourFecha,
	)

	mock.ExpectQuery(regexp.QuoteMeta("SELECT p.id_pago")).WillReturnRows(rows)

	pagos, err := repo.List()
	assert.NoError(t, err)
	assert.Len(t, pagos, 1)
	assert.Equal(t, "Ana", pagos[0].NombreCliente)
	assert.Nil(t, pagos[0].IDSede)
}

func TestPagoRepository_ListByReserva(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	rows := sqlmock.NewRows(pagoColumns()).AddRow(
		1, 100, "TARJETA", "WEB", nil,
		350.0, mockFechaPago, "PROCESADO", "Factura", "N-COMP-00005",
		"https://pdf.com/5.pdf", false,
		"Ana", "López", "87654321",
		"Web", "Tour Cusco", mockTourFecha,
	)

	mock.ExpectQuery(regexp.QuoteMeta("SELECT p.id_pago")).
		WithArgs(100).
		WillReturnRows(rows)

	pagos, err := repo.ListByReserva(100)
	assert.NoError(t, err)
	assert.Len(t, pagos, 1)
}

func TestPagoRepository_GetTotalPagadoByReserva(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	t.Run("Con pagos", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta("SELECT COALESCE(SUM(monto)")).
			WithArgs(100).
			WillReturnRows(sqlmock.NewRows([]string{"coalesce"}).AddRow(875.5))

		total, err := repo.GetTotalPagadoByReserva(100)
		assert.NoError(t, err)
		assert.Equal(t, 875.5, total)
	})

	t.Run("Sin pagos", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta("SELECT COALESCE(SUM(monto)")).
			WithArgs(999).
			WillReturnRows(sqlmock.NewRows([]string{"coalesce"}).AddRow(0.0))

		total, err := repo.GetTotalPagadoByReserva(999)
		assert.NoError(t, err)
		assert.Equal(t, 0.0, total)
	})
}

func TestPagoRepository_ListByEstado(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	rows := sqlmock.NewRows(pagoColumns()).AddRow(
		1, 100, "TARJETA", "WEB", nil,
		350.0, mockFechaPago, "PENDIENTE", "Factura", "N-COMP-00005",
		"https://pdf.com/5.pdf", false,
		"Ana", "López", "87654321",
		"Web", "Tour Cusco", mockTourFecha,
	)

	mock.ExpectQuery(regexp.QuoteMeta("SELECT p.id_pago")).
		WithArgs("PENDIENTE").
		WillReturnRows(rows)

	pagos, err := repo.ListByEstado("PENDIENTE")
	assert.NoError(t, err)
	assert.Len(t, pagos, 1)
}

func TestPagoRepository_ListByCliente(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	rows := sqlmock.NewRows(pagoColumns()).AddRow(
		1, 100, "TARJETA", "WEB", nil,
		350.0, mockFechaPago, "PROCESADO", "Factura", "N-COMP-00005",
		"https://pdf.com/5.pdf", false,
		"Ana", "López", "87654321",
		"Web", "Tour Cusco", mockTourFecha,
	)

	mock.ExpectQuery(regexp.QuoteMeta("SELECT p.id_pago")).
		WithArgs(50).
		WillReturnRows(rows)

	pagos, err := repo.ListByCliente(50)
	assert.NoError(t, err)
	assert.Len(t, pagos, 1)
}

func TestPagoRepository_ListBySede(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	idSede := sql.NullInt64{Int64: 4, Valid: true}
	rows := sqlmock.NewRows(pagoColumns()).AddRow(
		1, 100, "TARJETA", "PRESENCIAL", idSede,
		350.0, mockFechaPago, "PROCESADO", "Factura", "N-COMP-00005",
		"https://pdf.com/5.pdf", false,
		"Ana", "López", "87654321",
		"Sede Central", "Tour Cusco", mockTourFecha,
	)

	mock.ExpectQuery(regexp.QuoteMeta("SELECT p.id_pago")).
		WithArgs(4).
		WillReturnRows(rows)

	pagos, err := repo.ListBySede(4)
	assert.NoError(t, err)
	assert.Len(t, pagos, 1)
}

func TestPagoRepository_CrearPagoMercadoPago(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	mock.ExpectBegin()
	mock.ExpectQuery(regexp.QuoteMeta("SELECT COALESCE(MAX")).
		WillReturnRows(sqlmock.NewRows([]string{"coalesce"}).AddRow(20))

	mock.ExpectQuery(regexp.QuoteMeta("INSERT INTO pago")).
		WithArgs(200, 600.0, "ref-mp-123", "N-COMP-00021", "https://tu-sitio.com/comprobantes/N-COMP-00021.pdf").
		WillReturnRows(sqlmock.NewRows([]string{"id_pago"}).AddRow(99))

	mock.ExpectCommit()

	id, err := repo.CrearPagoMercadoPago(200, 600.0, "ref-mp-123")
	assert.NoError(t, err)
	assert.Equal(t, 99, id)
}

func TestPagoRepository_ListByFecha(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	rows := sqlmock.NewRows(pagoColumns()).AddRow(
		1, 100, "TARJETA", "WEB", nil,
		350.0, mockFechaPago, "PROCESADO", "Factura", "N-COMP-00005",
		"https://pdf.com/5.pdf", false,
		"Ana", "López", "87654321",
		"Web", "Tour Cusco", mockTourFecha,
	)

	mock.ExpectQuery(regexp.QuoteMeta("SELECT p.id_pago")).
		WithArgs("2025-12-13").
		WillReturnRows(rows)

	pagos, err := repo.ListByFecha(mockFechaBusqueda)
	assert.NoError(t, err)
	assert.Len(t, pagos, 1)
}

func TestPagoRepository_ActualizarComprobantesFaltantes(t *testing.T) {
	repo, mock := setupPagoRepo(t)
	defer func() { assert.NoError(t, mock.ExpectationsWereMet()) }()

	t.Run("Actualiza 3 pagos faltantes", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta("SELECT COALESCE(MAX")).
			WillReturnRows(sqlmock.NewRows([]string{"coalesce"}).AddRow(30))

		mock.ExpectQuery(regexp.QuoteMeta("SELECT id_pago FROM pago")).
			WillReturnRows(sqlmock.NewRows([]string{"id_pago"}).AddRow(40).AddRow(41).AddRow(42))

		mock.ExpectExec(regexp.QuoteMeta("UPDATE pago SET")).
			WithArgs("N-COMP-00031", sqlmock.AnyArg(), 40).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta("UPDATE pago SET")).
			WithArgs("N-COMP-00032", sqlmock.AnyArg(), 41).
			WillReturnResult(sqlmock.NewResult(1, 1))
		mock.ExpectExec(regexp.QuoteMeta("UPDATE pago SET")).
			WithArgs("N-COMP-00033", sqlmock.AnyArg(), 42).
			WillReturnResult(sqlmock.NewResult(1, 1))

		mock.ExpectCommit()

		count, err := repo.ActualizarComprobantesFaltantes()
		assert.NoError(t, err)
		assert.Equal(t, 3, count)
	})

	t.Run("No hay pagos faltantes", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta("SELECT COALESCE(MAX")).
			WillReturnRows(sqlmock.NewRows([]string{"coalesce"}).AddRow(10))

		mock.ExpectQuery(regexp.QuoteMeta("SELECT id_pago FROM pago")).
			WillReturnRows(sqlmock.NewRows([]string{"id_pago"}))

		mock.ExpectCommit()

		count, err := repo.ActualizarComprobantesFaltantes()
		assert.NoError(t, err)
		assert.Equal(t, 0, count)
	})
}
