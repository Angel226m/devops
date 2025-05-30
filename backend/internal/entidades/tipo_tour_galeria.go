package entidades

import "database/sql"

// TipoTourGaleria representa una imagen en la galería de un tipo de tour
type TipoTourGaleria struct {
	ID          int            `json:"id_galeria" db:"id_galeria"`
	IDTipoTour  int            `json:"id_tipo_tour" db:"id_tipo_tour"`
	ImagenURL   string         `json:"imagen_url" db:"imagen_url"`
	Descripcion sql.NullString `json:"descripcion" db:"descripcion"`
	Eliminado   bool           `json:"eliminado" db:"eliminado"`
	// Campos adicionales para mostrar información relacionada
	NombreTipoTour string `json:"nombre_tipo_tour,omitempty" db:"-"`
}

// NuevaTipoTourGaleriaRequest representa los datos necesarios para crear una nueva imagen en la galería
type NuevaTipoTourGaleriaRequest struct {
	IDTipoTour  int    `json:"id_tipo_tour" validate:"required"`
	ImagenURL   string `json:"imagen_url" validate:"required,url"`
	Descripcion string `json:"descripcion"`
}

// ActualizarTipoTourGaleriaRequest representa los datos para actualizar una imagen en la galería
type ActualizarTipoTourGaleriaRequest struct {
	IDTipoTour  int    `json:"id_tipo_tour" validate:"required"`
	ImagenURL   string `json:"imagen_url" validate:"required,url"`
	Descripcion string `json:"descripcion"`
	Eliminado   bool   `json:"eliminado"`
}
