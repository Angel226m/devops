package entidades

import "database/sql"

// TipoTour representa la estructura de un tipo de tour en el sistema
type TipoTour struct {
	ID                int            `json:"id_tipo_tour" db:"id_tipo_tour"`
	IDSede            int            `json:"id_sede" db:"id_sede"`
	IDIdioma          sql.NullInt64  `json:"id_idioma" db:"id_idioma"`
	Nombre            string         `json:"nombre" db:"nombre"`
	Descripcion       sql.NullString `json:"descripcion" db:"descripcion"`
	DuracionMinutos   int            `json:"duracion_minutos" db:"duracion_minutos"`
	CantidadPasajeros int            `json:"cantidad_pasajeros" db:"cantidad_pasajeros"`
	URLImagen         sql.NullString `json:"url_imagen" db:"url_imagen"`
	Eliminado         bool           `json:"eliminado" db:"eliminado"`
	// Campos adicionales para mostrar información relacionada
	NombreSede   string `json:"nombre_sede,omitempty" db:"-"`
	NombreIdioma string `json:"nombre_idioma,omitempty" db:"-"`
}

// NuevoTipoTourRequest representa los datos necesarios para crear un nuevo tipo de tour
type NuevoTipoTourRequest struct {
	IDSede            int    `json:"id_sede" validate:"required"`
	IDIdioma          int    `json:"id_idioma"`
	Nombre            string `json:"nombre" validate:"required"`
	Descripcion       string `json:"descripcion"`
	DuracionMinutos   int    `json:"duracion_minutos" validate:"required,min=1"`
	CantidadPasajeros int    `json:"cantidad_pasajeros" validate:"required,min=1"`
	URLImagen         string `json:"url_imagen"`
}

// ActualizarTipoTourRequest representa los datos para actualizar un tipo de tour
type ActualizarTipoTourRequest struct {
	IDSede            int    `json:"id_sede" validate:"required"`
	IDIdioma          int    `json:"id_idioma"`
	Nombre            string `json:"nombre" validate:"required"`
	Descripcion       string `json:"descripcion"`
	DuracionMinutos   int    `json:"duracion_minutos" validate:"required,min=1"`
	CantidadPasajeros int    `json:"cantidad_pasajeros" validate:"required,min=1"`
	URLImagen         string `json:"url_imagen"`
	Eliminado         bool   `json:"eliminado"`
}
