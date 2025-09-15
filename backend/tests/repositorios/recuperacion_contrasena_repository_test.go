package repositorios_test

import (
	"errors"
	"regexp"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)

func TestRecuperacionContrasenaRepository_Create(t *testing.T) {
	db, mock := SetupDB(t)
	defer db.Close()

	repo := repositorios.NewRecuperacionContrasenaRepository(db)

	t.Run("Success", func(t *testing.T) {
		creadoEn := time.Now()
		expiracion := creadoEn.Add(24 * time.Hour)
		recuperacion := &entidades.RecuperacionContrasena{
			EntidadID:   1,
			TipoEntidad: entidades.TipoEntidad("USUARIO"),
			Token:       "abc123",
			Expiracion:  expiracion,
			Utilizado:   false,
			CreadoEn:    creadoEn,
		}

		// Consulta exacta que coincide con la versión normalizada ejecutada
		query := `INSERT INTO recuperacion_contrasena ( entidad_id, tipo_entidad, token, expiracion, utilizado, creado_en) VALUES ($1, $2, $3, $4, $5, $6)`
		mock.ExpectExec(regexp.QuoteMeta(query)).
			WithArgs(
				recuperacion.EntidadID,
				string(recuperacion.TipoEntidad),
				recuperacion.Token,
				recuperacion.Expiracion,
				recuperacion.Utilizado,
				sqlmock.AnyArg(), // Permite cualquier time.Time para creado_en
			).
			WillReturnResult(sqlmock.NewResult(1, 1))

		err := repo.Create(recuperacion)
		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("DBError", func(t *testing.T) {
		creadoEn := time.Now()
		expiracion := creadoEn.Add(24 * time.Hour)
		recuperacion := &entidades.RecuperacionContrasena{
			EntidadID:   1,
			TipoEntidad: entidades.TipoEntidad("USUARIO"),
			Token:       "abc123",
			Expiracion:  expiracion,
			Utilizado:   false,
			CreadoEn:    creadoEn,
		}

		// Consulta exacta que coincide con la versión normalizada ejecutada
		query := `INSERT INTO recuperacion_contrasena ( entidad_id, tipo_entidad, token, expiracion, utilizado, creado_en) VALUES ($1, $2, $3, $4, $5, $6)`
		mock.ExpectExec(regexp.QuoteMeta(query)).
			WithArgs(
				recuperacion.EntidadID,
				string(recuperacion.TipoEntidad),
				recuperacion.Token,
				recuperacion.Expiracion,
				recuperacion.Utilizado,
				sqlmock.AnyArg(), // Permite cualquier time.Time para creado_en
			).
			WillReturnError(errors.New("database error"))

		err := repo.Create(recuperacion)
		assert.Error(t, err)
		assert.Equal(t, "error al crear token de recuperación: database error", err.Error())
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
