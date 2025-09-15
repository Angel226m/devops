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

func setupDB(t *testing.T) (*sql.DB, sqlmock.Sqlmock) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	return db, mock
}

func TestUsuarioRepository_GetByID(t *testing.T) {
	db, mock := setupDB(t)
	defer db.Close()

	repo := repositorios.NewUsuarioRepository(db)
	fechaNacimiento := time.Now().AddDate(-30, 0, 0)
	fechaRegistro := time.Now()

	t.Run("SuccessWithSedeAndIdiomas", func(t *testing.T) {
		usuarioRows := sqlmock.NewRows([]string{"id_usuario", "nombres", "apellidos", "correo", "contrasena", "rol", "id_sede", "telefono", "direccion", "fecha_nacimiento", "nacionalidad", "tipo_de_documento", "numero_documento", "fecha_registro", "eliminado"}).
			AddRow(1, "Juan", "Pérez", "juan@example.com", "hashedpass", "admin", 2, "123456789", "Calle 123", fechaNacimiento, "Peruana", "DNI", "12345678", fechaRegistro, false)

		idiomasRows := sqlmock.NewRows([]string{"id_usuario_idioma", "id_usuario", "id_idioma", "nivel", "eliminado", "nombre", "idioma_eliminado"}).
			AddRow(1, 1, 1, "avanzado", false, "Español", false)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_usuario, nombres, apellidos, correo, contrasena, rol, id_sede, telefono, direccion, fecha_nacimiento, nacionalidad, tipo_de_documento, numero_documento, fecha_registro, eliminado FROM usuario WHERE id_usuario = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnRows(usuarioRows)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT ui.id_usuario_idioma, ui.id_usuario, ui.id_idioma, ui.nivel, ui.eliminado, i.nombre, i.eliminado FROM usuario_idioma ui JOIN idioma i ON ui.id_idioma = i.id_idioma WHERE ui.id_usuario = $1 AND ui.eliminado = false`)).
			WithArgs(1).
			WillReturnRows(idiomasRows)

		usuario, err := repo.GetByID(1)
		assert.NoError(t, err)
		assert.NotNil(t, usuario)
		assert.Equal(t, 1, usuario.ID)
		assert.Equal(t, "Juan", usuario.Nombres)
		idSede := 2
		assert.Equal(t, &idSede, usuario.IdSede)
		assert.Len(t, usuario.Idiomas, 1)
		assert.Equal(t, "Español", usuario.Idiomas[0].Idioma.Nombre)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_usuario, nombres, apellidos, correo, contrasena, rol, id_sede, telefono, direccion, fecha_nacimiento, nacionalidad, tipo_de_documento, numero_documento, fecha_registro, eliminado FROM usuario WHERE id_usuario = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnError(sql.ErrNoRows)

		usuario, err := repo.GetByID(1)
		assert.Error(t, err)
		assert.Nil(t, usuario)
		assert.Equal(t, "usuario no encontrado", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_usuario, nombres, apellidos, correo, contrasena, rol, id_sede, telefono, direccion, fecha_nacimiento, nacionalidad, tipo_de_documento, numero_documento, fecha_registro, eliminado FROM usuario WHERE id_usuario = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnError(errors.New("database error"))

		usuario, err := repo.GetByID(1)
		assert.Error(t, err)
		assert.Nil(t, usuario)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestUsuarioRepository_GetByEmail(t *testing.T) {
	db, mock := setupDB(t)
	defer db.Close()

	repo := repositorios.NewUsuarioRepository(db)
	fechaNacimiento := time.Now().AddDate(-30, 0, 0)
	fechaRegistro := time.Now()

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_usuario", "id_sede", "nombres", "apellidos", "correo", "telefono", "direccion", "fecha_nacimiento", "rol", "nacionalidad", "tipo_de_documento", "numero_documento", "fecha_registro", "contrasena", "eliminado"}).
			AddRow(1, 2, "Juan", "Pérez", "juan@example.com", "123456789", "Calle 123", fechaNacimiento, "admin", "Peruana", "DNI", "12345678", fechaRegistro, "hashedpass", false)

		idiomasRows := sqlmock.NewRows([]string{"id_usuario_idioma", "id_usuario", "id_idioma", "nivel", "eliminado", "nombre", "idioma_eliminado"}).
			AddRow(1, 1, 1, "avanzado", false, "Español", false)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_usuario, id_sede, nombres, apellidos, correo, telefono, direccion, fecha_nacimiento, rol, nacionalidad, tipo_de_documento, numero_documento, fecha_registro, contrasena, eliminado FROM usuario WHERE correo = $1 AND eliminado = false`)).
			WithArgs("juan@example.com").
			WillReturnRows(rows)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT ui.id_usuario_idioma, ui.id_usuario, ui.id_idioma, ui.nivel, ui.eliminado, i.nombre, i.eliminado FROM usuario_idioma ui JOIN idioma i ON ui.id_idioma = i.id_idioma WHERE ui.id_usuario = $1 AND ui.eliminado = false`)).
			WithArgs(1).
			WillReturnRows(idiomasRows)

		usuario, err := repo.GetByEmail("juan@example.com")
		assert.NoError(t, err)
		assert.NotNil(t, usuario)
		assert.Equal(t, "juan@example.com", usuario.Correo)
		assert.Len(t, usuario.Idiomas, 1)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_usuario, id_sede, nombres, apellidos, correo, telefono, direccion, fecha_nacimiento, rol, nacionalidad, tipo_de_documento, numero_documento, fecha_registro, contrasena, eliminado FROM usuario WHERE correo = $1 AND eliminado = false`)).
			WithArgs("juan@example.com").
			WillReturnError(sql.ErrNoRows)

		usuario, err := repo.GetByEmail("juan@example.com")
		assert.Error(t, err)
		assert.Nil(t, usuario)
		assert.Equal(t, "usuario no encontrado", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestUsuarioRepository_GetByDocumento(t *testing.T) {
	db, mock := setupDB(t)
	defer db.Close()

	repo := repositorios.NewUsuarioRepository(db)
	fechaNacimiento := time.Now().AddDate(-30, 0, 0)
	fechaRegistro := time.Now()

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_usuario", "id_sede", "nombres", "apellidos", "correo", "telefono", "direccion", "fecha_nacimiento", "rol", "nacionalidad", "tipo_de_documento", "numero_documento", "fecha_registro", "contrasena", "eliminado"}).
			AddRow(1, 2, "Juan", "Pérez", "juan@example.com", "123456789", "Calle 123", fechaNacimiento, "admin", "Peruana", "DNI", "12345678", fechaRegistro, "hashedpass", false)

		idiomasRows := sqlmock.NewRows([]string{"id_usuario_idioma", "id_usuario", "id_idioma", "nivel", "eliminado", "nombre", "idioma_eliminado"}).
			AddRow(1, 1, 1, "avanzado", false, "Español", false)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_usuario, id_sede, nombres, apellidos, correo, telefono, direccion, fecha_nacimiento, rol, nacionalidad, tipo_de_documento, numero_documento, fecha_registro, contrasena, eliminado FROM usuario WHERE tipo_de_documento = $1 AND numero_documento = $2 AND eliminado = false`)).
			WithArgs("DNI", "12345678").
			WillReturnRows(rows)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT ui.id_usuario_idioma, ui.id_usuario, ui.id_idioma, ui.nivel, ui.eliminado, i.nombre, i.eliminado FROM usuario_idioma ui JOIN idioma i ON ui.id_idioma = i.id_idioma WHERE ui.id_usuario = $1 AND ui.eliminado = false`)).
			WithArgs(1).
			WillReturnRows(idiomasRows)

		usuario, err := repo.GetByDocumento("DNI", "12345678")
		assert.NoError(t, err)
		assert.NotNil(t, usuario)
		assert.Equal(t, "12345678", usuario.NumeroDocumento)
		assert.Len(t, usuario.Idiomas, 1)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_usuario, id_sede, nombres, apellidos, correo, telefono, direccion, fecha_nacimiento, rol, nacionalidad, tipo_de_documento, numero_documento, fecha_registro, contrasena, eliminado FROM usuario WHERE tipo_de_documento = $1 AND numero_documento = $2 AND eliminado = false`)).
			WithArgs("DNI", "12345678").
			WillReturnError(sql.ErrNoRows)

		usuario, err := repo.GetByDocumento("DNI", "12345678")
		assert.Error(t, err)
		assert.Nil(t, usuario)
		assert.Equal(t, "usuario no encontrado", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestUsuarioRepository_Create(t *testing.T) {
	db, mock := setupDB(t)
	defer db.Close()

	repo := repositorios.NewUsuarioRepository(db)
	usuario := &entidades.NuevoUsuarioRequest{
		IdSede:          &[]int{2}[0],
		Nombres:         "Juan",
		Apellidos:       "Pérez",
		Correo:          "juan@example.com",
		Telefono:        "123456789",
		Direccion:       "Calle 123",
		FechaNacimiento: time.Now().AddDate(-30, 0, 0),
		Rol:             "admin",
		Nacionalidad:    "Peruana",
		TipoDocumento:   "DNI",
		NumeroDocumento: "12345678",
		IdiomasIDs:      []int{1},
	}

	t.Run("Success", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO usuario (id_sede, nombres, apellidos, correo, telefono, direccion, fecha_nacimiento, rol, nacionalidad, tipo_de_documento, numero_documento, contrasena, eliminado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, false) RETURNING id_usuario`)).
			WithArgs(2, "Juan", "Pérez", "juan@example.com", "123456789", "Calle 123", usuario.FechaNacimiento, "admin", "Peruana", "DNI", "12345678", "hashedpass").
			WillReturnRows(sqlmock.NewRows([]string{"id_usuario"}).AddRow(1))

		mock.ExpectExec(regexp.QuoteMeta(`INSERT INTO usuario_idioma (id_usuario, id_idioma, nivel, eliminado) VALUES ($1, $2, 'básico', false)`)).
			WithArgs(1, 1).
			WillReturnResult(sqlmock.NewResult(1, 1))

		mock.ExpectCommit()

		id, err := repo.Create(usuario, "hashedpass")
		assert.NoError(t, err)
		assert.Equal(t, 1, id)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO usuario (id_sede, nombres, apellidos, correo, telefono, direccion, fecha_nacimiento, rol, nacionalidad, tipo_de_documento, numero_documento, contrasena, eliminado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, false) RETURNING id_usuario`)).
			WithArgs(2, "Juan", "Pérez", "juan@example.com", "123456789", "Calle 123", usuario.FechaNacimiento, "admin", "Peruana", "DNI", "12345678", "hashedpass").
			WillReturnError(errors.New("database error"))

		mock.ExpectRollback()

		id, err := repo.Create(usuario, "hashedpass")
		assert.Error(t, err)
		assert.Equal(t, 0, id)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestUsuarioRepository_Update(t *testing.T) {
	db, mock := setupDB(t)
	defer db.Close()

	repo := repositorios.NewUsuarioRepository(db)
	usuario := &entidades.Usuario{
		ID:              1,
		IdSede:          &[]int{2}[0],
		Nombres:         "Juan",
		Apellidos:       "Pérez",
		Correo:          "juan@example.com",
		Telefono:        "123456789",
		Direccion:       "Calle 123",
		FechaNacimiento: time.Now().AddDate(-30, 0, 0),
		Rol:             "admin",
		Nacionalidad:    "Peruana",
		TipoDocumento:   "DNI",
		NumeroDocumento: "12345678",
	}

	t.Run("Success", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE usuario SET id_sede = $1, nombres = $2, apellidos = $3, correo = $4, telefono = $5, direccion = $6, fecha_nacimiento = $7, rol = $8, nacionalidad = $9, tipo_de_documento = $10, numero_documento = $11 WHERE id_usuario = $12 AND eliminado = false`)).
			WithArgs(2, "Juan", "Pérez", "juan@example.com", "123456789", "Calle 123", usuario.FechaNacimiento, "admin", "Peruana", "DNI", "12345678", 1).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.Update(usuario)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE usuario SET id_sede = $1, nombres = $2, apellidos = $3, correo = $4, telefono = $5, direccion = $6, fecha_nacimiento = $7, rol = $8, nacionalidad = $9, tipo_de_documento = $10, numero_documento = $11 WHERE id_usuario = $12 AND eliminado = false`)).
			WithArgs(2, "Juan", "Pérez", "juan@example.com", "123456789", "Calle 123", usuario.FechaNacimiento, "admin", "Peruana", "DNI", "12345678", 1).
			WillReturnResult(sqlmock.NewResult(0, 0))

		err := repo.Update(usuario)
		assert.Error(t, err)
		assert.Equal(t, "usuario no encontrado o ya eliminado", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestUsuarioRepository_UpdatePassword(t *testing.T) {
	db, mock := setupDB(t)
	defer db.Close()

	repo := repositorios.NewUsuarioRepository(db)

	t.Run("Success", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE usuario SET contrasena = $1 WHERE id_usuario = $2 AND eliminado = false`)).
			WithArgs("newhashedpass", 1).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.UpdatePassword(1, "newhashedpass")
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE usuario SET contrasena = $1 WHERE id_usuario = $2 AND eliminado = false`)).
			WithArgs("newhashedpass", 1).
			WillReturnResult(sqlmock.NewResult(0, 0))

		err := repo.UpdatePassword(1, "newhashedpass")
		assert.Error(t, err)
		assert.Equal(t, "usuario no encontrado o ya eliminado", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestUsuarioRepository_SoftDelete(t *testing.T) {
	db, mock := setupDB(t)
	defer db.Close()

	repo := repositorios.NewUsuarioRepository(db)

	t.Run("Success", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE usuario SET eliminado = true WHERE id_usuario = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.SoftDelete(1)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE usuario SET eliminado = true WHERE id_usuario = $1 AND eliminado = false`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(0, 0))

		err := repo.SoftDelete(1)
		assert.Error(t, err)
		assert.Equal(t, "usuario no encontrado o ya eliminado", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestUsuarioRepository_Restore(t *testing.T) {
	db, mock := setupDB(t)
	defer db.Close()

	repo := repositorios.NewUsuarioRepository(db)

	t.Run("Success", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE usuario SET eliminado = false WHERE id_usuario = $1 AND eliminado = true`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.Restore(1)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("NotFound", func(t *testing.T) {
		mock.ExpectExec(regexp.QuoteMeta(`UPDATE usuario SET eliminado = false WHERE id_usuario = $1 AND eliminado = true`)).
			WithArgs(1).
			WillReturnResult(sqlmock.NewResult(0, 0))

		err := repo.Restore(1)
		assert.Error(t, err)
		assert.Equal(t, "usuario no encontrado o no está eliminado", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestUsuarioRepository_ListByRol(t *testing.T) {
	db, mock := setupDB(t)
	defer db.Close()

	repo := repositorios.NewUsuarioRepository(db)
	fechaNacimiento := time.Now().AddDate(-30, 0, 0)
	fechaRegistro := time.Now()

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_usuario", "id_sede", "nombres", "apellidos", "correo", "telefono", "direccion", "fecha_nacimiento", "rol", "nacionalidad", "tipo_de_documento", "numero_documento", "fecha_registro", "contrasena", "eliminado"}).
			AddRow(1, 2, "Juan", "Pérez", "juan@example.com", "123456789", "Calle 123", fechaNacimiento, "admin", "Peruana", "DNI", "12345678", fechaRegistro, "hashedpass", false)

		idiomasRows := sqlmock.NewRows([]string{"id_usuario_idioma", "id_usuario", "id_idioma", "nivel", "eliminado", "nombre", "idioma_eliminado"}).
			AddRow(1, 1, 1, "avanzado", false, "Español", false)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_usuario, id_sede, nombres, apellidos, correo, telefono, direccion, fecha_nacimiento, rol, nacionalidad, tipo_de_documento, numero_documento, fecha_registro, contrasena, eliminado FROM usuario WHERE rol = $1 AND eliminado = false ORDER BY apellidos, nombres`)).
			WithArgs("admin").
			WillReturnRows(rows)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT ui.id_usuario_idioma, ui.id_usuario, ui.id_idioma, ui.nivel, ui.eliminado, i.nombre, i.eliminado FROM usuario_idioma ui JOIN idioma i ON ui.id_idioma = i.id_idioma WHERE ui.id_usuario = $1 AND ui.eliminado = false`)).
			WithArgs(1).
			WillReturnRows(idiomasRows)

		usuarios, err := repo.ListByRol("admin")
		assert.NoError(t, err)
		assert.Len(t, usuarios, 1)
		assert.Equal(t, "Juan", usuarios[0].Nombres)
		assert.Len(t, usuarios[0].Idiomas, 1)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_usuario, id_sede, nombres, apellidos, correo, telefono, direccion, fecha_nacimiento, rol, nacionalidad, tipo_de_documento, numero_documento, fecha_registro, contrasena, eliminado FROM usuario WHERE rol = $1 AND eliminado = false ORDER BY apellidos, nombres`)).
			WithArgs("admin").
			WillReturnError(errors.New("database error"))

		usuarios, err := repo.ListByRol("admin")
		assert.Error(t, err)
		assert.Nil(t, usuarios)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestUsuarioRepository_List(t *testing.T) {
	db, mock := setupDB(t)
	defer db.Close()

	repo := repositorios.NewUsuarioRepository(db)
	fechaNacimiento := time.Now().AddDate(-30, 0, 0)
	fechaRegistro := time.Now()

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_usuario", "id_sede", "nombres", "apellidos", "correo", "telefono", "direccion", "fecha_nacimiento", "rol", "nacionalidad", "tipo_de_documento", "numero_documento", "fecha_registro", "contrasena", "eliminado"}).
			AddRow(1, 2, "Juan", "Pérez", "juan@example.com", "123456789", "Calle 123", fechaNacimiento, "admin", "Peruana", "DNI", "12345678", fechaRegistro, "hashedpass", false)

		idiomasRows := sqlmock.NewRows([]string{"id_usuario_idioma", "id_usuario", "id_idioma", "nivel", "eliminado", "nombre", "idioma_eliminado"}).
			AddRow(1, 1, 1, "avanzado", false, "Español", false)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_usuario, id_sede, nombres, apellidos, correo, telefono, direccion, fecha_nacimiento, rol, nacionalidad, tipo_de_documento, numero_documento, fecha_registro, contrasena, eliminado FROM usuario WHERE eliminado = false ORDER BY apellidos, nombres`)).
			WillReturnRows(rows)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT ui.id_usuario_idioma, ui.id_usuario, ui.id_idioma, ui.nivel, ui.eliminado, i.nombre, i.eliminado FROM usuario_idioma ui JOIN idioma i ON ui.id_idioma = i.id_idioma WHERE ui.id_usuario = $1 AND ui.eliminado = false`)).
			WithArgs(1).
			WillReturnRows(idiomasRows)

		usuarios, err := repo.List()
		assert.NoError(t, err)
		assert.Len(t, usuarios, 1)
		assert.Equal(t, "Juan", usuarios[0].Nombres)
		assert.Len(t, usuarios[0].Idiomas, 1)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_usuario, id_sede, nombres, apellidos, correo, telefono, direccion, fecha_nacimiento, rol, nacionalidad, tipo_de_documento, numero_documento, fecha_registro, contrasena, eliminado FROM usuario WHERE eliminado = false ORDER BY apellidos, nombres`)).
			WillReturnError(errors.New("database error"))

		usuarios, err := repo.List()
		assert.Error(t, err)
		assert.Nil(t, usuarios)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestUsuarioRepository_ListDeleted(t *testing.T) {
	db, mock := setupDB(t)
	defer db.Close()

	repo := repositorios.NewUsuarioRepository(db)
	fechaNacimiento := time.Now().AddDate(-30, 0, 0)
	fechaRegistro := time.Now()

	t.Run("Success", func(t *testing.T) {
		rows := sqlmock.NewRows([]string{"id_usuario", "id_sede", "nombres", "apellidos", "correo", "telefono", "direccion", "fecha_nacimiento", "rol", "nacionalidad", "tipo_de_documento", "numero_documento", "fecha_registro", "contrasena", "eliminado"}).
			AddRow(1, 2, "Juan", "Pérez", "juan@example.com", "123456789", "Calle 123", fechaNacimiento, "admin", "Peruana", "DNI", "12345678", fechaRegistro, "hashedpass", true)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_usuario, id_sede, nombres, apellidos, correo, telefono, direccion, fecha_nacimiento, rol, nacionalidad, tipo_de_documento, numero_documento, fecha_registro, contrasena, eliminado FROM usuario WHERE eliminado = true ORDER BY apellidos, nombres`)).
			WillReturnRows(rows)

		usuarios, err := repo.ListDeleted()
		assert.NoError(t, err)
		assert.Len(t, usuarios, 1)
		assert.Equal(t, "Juan", usuarios[0].Nombres)
		assert.True(t, usuarios[0].Eliminado)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		mock.ExpectQuery(regexp.QuoteMeta(`SELECT id_usuario, id_sede, nombres, apellidos, correo, telefono, direccion, fecha_nacimiento, rol, nacionalidad, tipo_de_documento, numero_documento, fecha_registro, contrasena, eliminado FROM usuario WHERE eliminado = true ORDER BY apellidos, nombres`)).
			WillReturnError(errors.New("database error"))

		usuarios, err := repo.ListDeleted()
		assert.Error(t, err)
		assert.Nil(t, usuarios)
		assert.Equal(t, "database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
