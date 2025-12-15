package repositorios_test

import (
	"database/sql"
	"regexp"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestClienteRepository_GetByID(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewClienteRepository(db)

	tests := []struct {
		name    string
		id      int
		mock    func()
		want    *entidades.Cliente
		wantErr string
	}{
		{
			name: "Éxito - Persona natural",
			id:   1,
			mock: func() {
				rows := sqlmock.NewRows([]string{
					"id_cliente", "tipo_documento", "numero_documento",
					"nombres", "apellidos", "correo", "numero_celular",
					"razon_social", "direccion_fiscal", "contrasena", "eliminado",
				}).AddRow(
					1, "DNI", "12345678",
					sql.NullString{String: "Ana", Valid: true},
					sql.NullString{String: "López", Valid: true},
					"ana@example.com", "987654321",
					sql.NullString{}, sql.NullString{},
					"hashpass", false,
				)
				mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_cliente`)).
					WithArgs(1).
					WillReturnRows(rows)
			},
			want: &entidades.Cliente{
				ID:              1,
				TipoDocumento:   "DNI",
				NumeroDocumento: "12345678",
				Nombres:         "Ana",
				Apellidos:       "López",
				Correo:          "ana@example.com",
				NumeroCelular:   "987654321",
				NombreCompleto:  "Ana López",
				Contrasena:      "hashpass",
				Eliminado:       false,
			},
			wantErr: "",
		},
		{
			name: "Éxito - Empresa (RUC)",
			id:   2,
			mock: func() {
				rows := sqlmock.NewRows([]string{
					"id_cliente", "tipo_documento", "numero_documento",
					"nombres", "apellidos", "correo", "numero_celular",
					"razon_social", "direccion_fiscal", "contrasena", "eliminado",
				}).AddRow(
					2, "RUC", "20123456789",
					sql.NullString{}, sql.NullString{},
					"empresa@corp.com", "987654321",
					sql.NullString{String: "Tours Corp SAC", Valid: true},
					sql.NullString{String: "Av. Principal 123", Valid: true},
					"hashpass", false,
				)
				mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_cliente`)).
					WithArgs(2).
					WillReturnRows(rows)
			},
			want: &entidades.Cliente{
				ID:              2,
				TipoDocumento:   "RUC",
				NumeroDocumento: "20123456789",
				Correo:          "empresa@corp.com",
				NumeroCelular:   "987654321",
				RazonSocial:     "Tours Corp SAC",
				DireccionFiscal: "Av. Principal 123",
				Contrasena:      "hashpass",
				Eliminado:       false,
				NombreCompleto:  "", // No se calcula para RUC
			},
			wantErr: "",
		},
		{
			name: "Error - No encontrado",
			id:   999,
			mock: func() {
				mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_cliente`)).
					WithArgs(999).
					WillReturnError(sql.ErrNoRows)
			},
			want:    nil,
			wantErr: "cliente no encontrado",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mock()
			got, err := repo.GetByID(tt.id)

			if tt.wantErr != "" {
				assert.ErrorContains(t, err, tt.wantErr)
				assert.Nil(t, got)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.want, got)
			}

			assert.NoError(t, mock.ExpectationsWereMet())
		})
	}
}

func TestClienteRepository_GetByDocumento(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewClienteRepository(db)

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_cliente`)).
		WithArgs("DNI", "12345678").
		WillReturnRows(sqlmock.NewRows([]string{
			"id_cliente", "tipo_documento", "numero_documento", "nombres", "apellidos",
			"correo", "numero_celular", "razon_social", "direccion_fiscal", "contrasena", "eliminado",
		}).AddRow(1, "DNI", "12345678", "Juan", "Pérez", "juan@example.com", "999888777", "", "", "hash", false))

	cliente, err := repo.GetByDocumento("DNI", "12345678")
	assert.NoError(t, err)
	assert.Equal(t, "Juan Pérez", cliente.NombreCompleto)

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_cliente`)).
		WithArgs("DNI", "00000000").
		WillReturnError(sql.ErrNoRows)

	cliente, err = repo.GetByDocumento("DNI", "00000000")
	assert.ErrorContains(t, err, "cliente no encontrado")
	assert.Nil(t, cliente)

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestClienteRepository_GetByRazonSocial(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewClienteRepository(db)

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_cliente`)).
		WithArgs("Mi Empresa SAC").
		WillReturnRows(sqlmock.NewRows([]string{
			"id_cliente", "tipo_documento", "numero_documento", "nombres", "apellidos",
			"correo", "numero_celular", "razon_social", "direccion_fiscal", "contrasena", "eliminado",
		}).AddRow(3, "RUC", "20111111111", nil, nil, "emp@corp.com", "987654321", "Mi Empresa SAC", "Calle 123", "hash", false))

	cliente, err := repo.GetByRazonSocial("Mi Empresa SAC")
	assert.NoError(t, err)
	assert.Equal(t, "Mi Empresa SAC", cliente.RazonSocial)

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_cliente`)).
		WithArgs("NoExiste").
		WillReturnError(sql.ErrNoRows)

	cliente, err = repo.GetByRazonSocial("NoExiste")
	assert.ErrorContains(t, err, "cliente no encontrado")

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestClienteRepository_GetByCorreo(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewClienteRepository(db)

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_cliente`)).
		WithArgs("test@example.com").
		WillReturnRows(sqlmock.NewRows([]string{
			"id_cliente", "tipo_documento", "numero_documento",
			"nombres", "apellidos", "correo", "numero_celular",
			"razon_social", "direccion_fiscal", "contrasena", "eliminado",
		}).AddRow(
			4, "DNI", "87654321",
			sql.NullString{String: "Pedro", Valid: true},
			sql.NullString{String: "Gómez", Valid: true},
			"test@example.com", "111222333",
			sql.NullString{}, sql.NullString{},
			"hash", false,
		))

	cliente, err := repo.GetByCorreo("test@example.com")
	assert.NoError(t, err)
	assert.Equal(t, "Pedro Gómez", cliente.NombreCompleto)

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestClienteRepository_GetPasswordByCorreo(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewClienteRepository(db)

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT contrasena`)).
		WithArgs("user@example.com").
		WillReturnRows(sqlmock.NewRows([]string{"contrasena"}).AddRow("hashedpassword"))

	pass, err := repo.GetPasswordByCorreo("user@example.com")
	assert.NoError(t, err)
	assert.Equal(t, "hashedpassword", pass)

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT contrasena`)).
		WithArgs("noexiste@example.com").
		WillReturnError(sql.ErrNoRows)

	pass, err = repo.GetPasswordByCorreo("noexiste@example.com")
	assert.ErrorContains(t, err, "cliente no encontrado")
	assert.Empty(t, pass)

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestClienteRepository_Create(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewClienteRepository(db)

	t.Run("Persona natural", func(t *testing.T) {
		req := &entidades.NuevoClienteRequest{
			TipoDocumento:   "DNI",
			NumeroDocumento: "12345678",
			Nombres:         "Luis",
			Apellidos:       "Ramírez",
			Correo:          "luis@example.com",
			NumeroCelular:   "999888777",
			Contrasena:      "pass123",
		}

		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO cliente`)).
			WithArgs(
				"DNI", "12345678",
				sqlmock.AnyArg(), sqlmock.AnyArg(), // nombres y apellidos como NullString
				"luis@example.com", "999888777",
				sqlmock.AnyArg(), sqlmock.AnyArg(), // razon_social y direccion_fiscal NULL
				"pass123",
			).
			WillReturnRows(sqlmock.NewRows([]string{"id_cliente"}).AddRow(10))

		id, err := repo.Create(req)
		assert.NoError(t, err)
		assert.Equal(t, 10, id)
	})

	t.Run("Empresa RUC", func(t *testing.T) {
		req := &entidades.NuevoClienteRequest{
			TipoDocumento:   "RUC",
			NumeroDocumento: "20123456789",
			RazonSocial:     "Empresa SAC",
			DireccionFiscal: "Av. Test 456",
			Correo:          "emp@corp.com",
			NumeroCelular:   "111222333",
			Contrasena:      "passcorp",
		}

		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO cliente`)).
			WillReturnRows(sqlmock.NewRows([]string{"id_cliente"}).AddRow(11))

		id, err := repo.Create(req)
		assert.NoError(t, err)
		assert.Equal(t, 11, id)
	})

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestClienteRepository_Update(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewClienteRepository(db)

	req := &entidades.ActualizarClienteRequest{
		TipoDocumento:   "DNI",
		NumeroDocumento: "87654321",
		Nombres:         "NuevoNombre",
		Apellidos:       "NuevoApellido",
		Correo:          "nuevo@email.com",
		NumeroCelular:   "555666777",
	}

	mock.ExpectExec(regexp.QuoteMeta(`UPDATE cliente SET`)).
		WithArgs(
			"DNI", "87654321",
			sqlmock.AnyArg(), sqlmock.AnyArg(), // nombres/apellidos
			"nuevo@email.com", "555666777",
			sqlmock.AnyArg(), sqlmock.AnyArg(), // razon/direccion NULL
			1,
		).
		WillReturnResult(sqlmock.NewResult(1, 1)) // 1 fila afectada

	err = repo.Update(1, req)
	assert.NoError(t, err)

	// Caso no encontrado
	mock.ExpectExec(regexp.QuoteMeta(`UPDATE cliente SET`)).
		WillReturnResult(sqlmock.NewResult(0, 0))

	err = repo.Update(999, req)
	assert.ErrorContains(t, err, "cliente no encontrado o ya eliminado")

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestClienteRepository_UpdateDatosEmpresa(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewClienteRepository(db)

	datos := &entidades.ActualizarDatosEmpresaRequest{
		RazonSocial:     "Nueva Empresa SAC",
		DireccionFiscal: "Nueva Dirección 789",
	}

	mock.ExpectExec(regexp.QuoteMeta(`UPDATE cliente SET`)).
		WithArgs("Nueva Empresa SAC", "Nueva Dirección 789", 5).
		WillReturnResult(sqlmock.NewResult(1, 1))

	err = repo.UpdateDatosEmpresa(5, datos)
	assert.NoError(t, err)

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestClienteRepository_UpdatePassword(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewClienteRepository(db)

	mock.ExpectExec(regexp.QuoteMeta(`UPDATE cliente SET`)).
		WithArgs("newhashedpass", 7).
		WillReturnResult(sqlmock.NewResult(1, 1))

	err = repo.UpdatePassword(7, "newhashedpass")
	assert.NoError(t, err)

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestClienteRepository_Delete(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewClienteRepository(db)

	t.Run("Éxito - sin reservas", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*)`)).
			WithArgs(10).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))

		mock.ExpectExec(regexp.QuoteMeta(`UPDATE cliente SET eliminado = true`)).
			WithArgs(10).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.Delete(10)
		assert.NoError(t, err)
	})

	t.Run("Error - tiene reservas", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT COUNT(*)`)).
			WithArgs(11).
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(3))

		err := repo.Delete(11)
		assert.ErrorContains(t, err, "no se puede eliminar este cliente porque tiene reservas asociadas")
	})

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestClienteRepository_List(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewClienteRepository(db)

	rows := sqlmock.NewRows([]string{
		"id_cliente", "tipo_documento", "numero_documento",
		"nombres", "apellidos", "correo", "numero_celular",
		"razon_social", "direccion_fiscal", "contrasena", "eliminado",
	}).AddRow(
		1, "DNI", "12345678",
		sql.NullString{String: "Ana", Valid: true},
		sql.NullString{String: "López", Valid: true},
		"ana@example.com", "987654321",
		sql.NullString{}, sql.NullString{}, "hash", false,
	).AddRow(
		2, "RUC", "20123456789",
		sql.NullString{}, sql.NullString{},
		"emp@corp.com", "111222333",
		sql.NullString{String: "Empresa SAC", Valid: true},
		sql.NullString{String: "Dir 123", Valid: true}, "hash", false,
	)

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_cliente`)).WillReturnRows(rows)

	clientes, err := repo.List()
	assert.NoError(t, err)
	assert.Len(t, clientes, 2)
	assert.Equal(t, "Ana López", clientes[0].NombreCompleto)
	assert.Equal(t, "Empresa SAC", clientes[1].RazonSocial)

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestClienteRepository_SearchByName(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewClienteRepository(db)

	rows := sqlmock.NewRows([]string{
		"id_cliente", "tipo_documento", "numero_documento",
		"nombres", "apellidos", "correo", "numero_celular",
		"razon_social", "direccion_fiscal", "contrasena", "eliminado",
	}).AddRow(1, "DNI", "12345678", sql.NullString{String: "Pedro", Valid: true}, sql.NullString{String: "García", Valid: true}, "pedro@example.com", "999888777", sql.NullString{}, sql.NullString{}, "hash", false)

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_cliente`)).
		WithArgs("%Pedro%").
		WillReturnRows(rows)

	clientes, err := repo.SearchByName("Pedro")
	assert.NoError(t, err)
	assert.Len(t, clientes, 1)

	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestClienteRepository_SearchByDocumento(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	repo := repositorios.NewClienteRepository(db)

	rows := sqlmock.NewRows([]string{
		"id_cliente", "tipo_documento", "numero_documento",
		"nombres", "apellidos", "correo", "numero_celular",
		"razon_social", "direccion_fiscal", "contrasena", "eliminado",
	}).AddRow(3, "RUC", "20111111111", sql.NullString{}, sql.NullString{}, "corp@example.com", "555666777", sql.NullString{String: "Corp SAC", Valid: true}, sql.NullString{}, "hash", false)

	mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_cliente`)).
		WithArgs("%11111%").
		WillReturnRows(rows)

	clientes, err := repo.SearchByDocumento("11111")
	assert.NoError(t, err)
	assert.Len(t, clientes, 1)

	assert.NoError(t, mock.ExpectationsWereMet())
}
