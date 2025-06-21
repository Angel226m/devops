package repositorios

import (
	"database/sql"
	"errors"
	"fmt"
	"sistema-toursseft/internal/entidades"
	"time"
)

// RecuperacionContrasenaRepository maneja las operaciones de base de datos para recuperación de contraseña
type RecuperacionContrasenaRepository struct {
	db *sql.DB
}

// NewRecuperacionContrasenaRepository crea una nueva instancia del repositorio
func NewRecuperacionContrasenaRepository(db *sql.DB) *RecuperacionContrasenaRepository {
	return &RecuperacionContrasenaRepository{
		db: db,
	}
}

// Create guarda un nuevo token de recuperación
func (r *RecuperacionContrasenaRepository) Create(recuperacion *entidades.RecuperacionContrasena) error {
	query := `INSERT INTO recuperacion_contrasena (
                entidad_id, tipo_entidad, token, expiracion, utilizado, creado_en)
              VALUES ($1, $2, $3, $4, $5, $6)`

	_, err := r.db.Exec(
		query,
		recuperacion.EntidadID,
		recuperacion.TipoEntidad,
		recuperacion.Token,
		recuperacion.Expiracion,
		recuperacion.Utilizado,
		time.Now(),
	)

	if err != nil {
		return fmt.Errorf("error al crear token de recuperación: %w", err)
	}

	return nil
}

// GetByToken obtiene un token de recuperación por su valor
func (r *RecuperacionContrasenaRepository) GetByToken(token string) (*entidades.RecuperacionContrasena, error) {
	recuperacion := &entidades.RecuperacionContrasena{}

	query := `SELECT id, entidad_id, tipo_entidad, token, expiracion, utilizado, creado_en
              FROM recuperacion_contrasena
              WHERE token = $1`

	err := r.db.QueryRow(query, token).Scan(
		&recuperacion.ID,
		&recuperacion.EntidadID,
		&recuperacion.TipoEntidad,
		&recuperacion.Token,
		&recuperacion.Expiracion,
		&recuperacion.Utilizado,
		&recuperacion.CreadoEn,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("token no encontrado")
		}
		return nil, fmt.Errorf("error al buscar token: %w", err)
	}

	return recuperacion, nil
}

// MarkAsUsed marca un token como utilizado
func (r *RecuperacionContrasenaRepository) MarkAsUsed(tokenID int) error {
	query := `UPDATE recuperacion_contrasena SET utilizado = true WHERE id = $1`

	result, err := r.db.Exec(query, tokenID)
	if err != nil {
		return fmt.Errorf("error al marcar token como utilizado: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error al obtener filas afectadas: %w", err)
	}

	if rowsAffected == 0 {
		return errors.New("no se encontró el token para marcar como utilizado")
	}

	return nil
}

// InvalidateOldTokens invalida todos los tokens antiguos para una entidad
func (r *RecuperacionContrasenaRepository) InvalidateOldTokens(entidadID int, tipoEntidad entidades.TipoEntidad) error {
	query := `UPDATE recuperacion_contrasena SET utilizado = true 
              WHERE entidad_id = $1 AND tipo_entidad = $2 AND utilizado = false`

	_, err := r.db.Exec(query, entidadID, tipoEntidad)
	if err != nil {
		return fmt.Errorf("error al invalidar tokens antiguos: %w", err)
	}

	return nil
}

// DeleteExpiredTokens elimina tokens expirados (mantenimiento)
func (r *RecuperacionContrasenaRepository) DeleteExpiredTokens() error {
	query := `DELETE FROM recuperacion_contrasena 
              WHERE expiracion < NOW() - INTERVAL '7 days'`

	_, err := r.db.Exec(query)
	if err != nil {
		return fmt.Errorf("error al eliminar tokens expirados: %w", err)
	}

	return nil
}
