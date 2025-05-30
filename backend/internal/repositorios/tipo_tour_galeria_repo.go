package repositorios

import (
	"database/sql"
	"errors"
	"sistema-toursseft/internal/entidades"
)

// TipoTourGaleriaRepository maneja las operaciones de base de datos para la galería de tipos de tour
type TipoTourGaleriaRepository struct {
	db *sql.DB
}

// NewTipoTourGaleriaRepository crea una nueva instancia del repositorio
func NewTipoTourGaleriaRepository(db *sql.DB) *TipoTourGaleriaRepository {
	return &TipoTourGaleriaRepository{
		db: db,
	}
}

// GetByID obtiene una imagen de la galería por su ID
func (r *TipoTourGaleriaRepository) GetByID(id int) (*entidades.TipoTourGaleria, error) {
	galeria := &entidades.TipoTourGaleria{}
	query := `SELECT g.id_galeria, g.id_tipo_tour, g.imagen_url, g.descripcion, g.eliminado, 
              t.nombre as nombre_tipo_tour
              FROM tipo_tour_galeria g
              INNER JOIN tipo_tour t ON g.id_tipo_tour = t.id_tipo_tour
              WHERE g.id_galeria = $1`

	var descripcion sql.NullString

	err := r.db.QueryRow(query, id).Scan(
		&galeria.ID, &galeria.IDTipoTour, &galeria.ImagenURL, &descripcion,
		&galeria.Eliminado, &galeria.NombreTipoTour,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("imagen de galería no encontrada")
		}
		return nil, err
	}

	galeria.Descripcion = descripcion

	return galeria, nil
}

// Create guarda una nueva imagen en la galería
func (r *TipoTourGaleriaRepository) Create(galeria *entidades.NuevaTipoTourGaleriaRequest) (int, error) {
	var id int
	query := `INSERT INTO tipo_tour_galeria (id_tipo_tour, imagen_url, descripcion, eliminado)
              VALUES ($1, $2, $3, false)
              RETURNING id_galeria`

	err := r.db.QueryRow(
		query,
		galeria.IDTipoTour,
		galeria.ImagenURL,
		galeria.Descripcion,
	).Scan(&id)

	if err != nil {
		return 0, err
	}

	return id, nil
}

// Update actualiza la información de una imagen en la galería
func (r *TipoTourGaleriaRepository) Update(id int, galeria *entidades.ActualizarTipoTourGaleriaRequest) error {
	query := `UPDATE tipo_tour_galeria SET
              id_tipo_tour = $1,
              imagen_url = $2,
              descripcion = $3,
              eliminado = $4
              WHERE id_galeria = $5`

	_, err := r.db.Exec(
		query,
		galeria.IDTipoTour,
		galeria.ImagenURL,
		galeria.Descripcion,
		galeria.Eliminado,
		id,
	)

	return err
}

// Delete marca una imagen en la galería como eliminada (borrado lógico)
func (r *TipoTourGaleriaRepository) Delete(id int) error {
	query := `UPDATE tipo_tour_galeria SET eliminado = true WHERE id_galeria = $1`
	_, err := r.db.Exec(query, id)
	return err
}

// HardDelete elimina físicamente una imagen de la galería de la base de datos
func (r *TipoTourGaleriaRepository) HardDelete(id int) error {
	query := `DELETE FROM tipo_tour_galeria WHERE id_galeria = $1`
	_, err := r.db.Exec(query, id)
	return err
}

// List lista todas las imágenes de la galería no eliminadas
func (r *TipoTourGaleriaRepository) List() ([]*entidades.TipoTourGaleria, error) {
	query := `SELECT g.id_galeria, g.id_tipo_tour, g.imagen_url, g.descripcion, g.eliminado, 
              t.nombre as nombre_tipo_tour
              FROM tipo_tour_galeria g
              INNER JOIN tipo_tour t ON g.id_tipo_tour = t.id_tipo_tour
              WHERE g.eliminado = false
              ORDER BY g.id_galeria`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	galerias := []*entidades.TipoTourGaleria{}

	for rows.Next() {
		galeria := &entidades.TipoTourGaleria{}
		var descripcion sql.NullString

		err := rows.Scan(
			&galeria.ID, &galeria.IDTipoTour, &galeria.ImagenURL, &descripcion,
			&galeria.Eliminado, &galeria.NombreTipoTour,
		)
		if err != nil {
			return nil, err
		}

		galeria.Descripcion = descripcion
		galerias = append(galerias, galeria)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return galerias, nil
}

// ListByTipoTour lista todas las imágenes de la galería de un tipo de tour específico
func (r *TipoTourGaleriaRepository) ListByTipoTour(idTipoTour int) ([]*entidades.TipoTourGaleria, error) {
	query := `SELECT g.id_galeria, g.id_tipo_tour, g.imagen_url, g.descripcion, g.eliminado, 
              t.nombre as nombre_tipo_tour
              FROM tipo_tour_galeria g
              INNER JOIN tipo_tour t ON g.id_tipo_tour = t.id_tipo_tour
              WHERE g.id_tipo_tour = $1 AND g.eliminado = false
              ORDER BY g.id_galeria`

	rows, err := r.db.Query(query, idTipoTour)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	galerias := []*entidades.TipoTourGaleria{}

	for rows.Next() {
		galeria := &entidades.TipoTourGaleria{}
		var descripcion sql.NullString

		err := rows.Scan(
			&galeria.ID, &galeria.IDTipoTour, &galeria.ImagenURL, &descripcion,
			&galeria.Eliminado, &galeria.NombreTipoTour,
		)
		if err != nil {
			return nil, err
		}

		galeria.Descripcion = descripcion
		galerias = append(galerias, galeria)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return galerias, nil
}
