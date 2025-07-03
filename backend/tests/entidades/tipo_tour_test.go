package entidades_test

import (
	"database/sql"
	"sistema-toursseft/internal/entidades"
	"testing"
)

func TestTipoTour(t *testing.T) {
	// Crear tipo de tour
	tipoTour := entidades.TipoTour{
		ID:              1,
		IDSede:          2,
		Nombre:          "Tour a Islas Ballestas",
		Descripcion:     sql.NullString{String: "Paseo en lancha para observar fauna marina", Valid: true},
		DuracionMinutos: 120,
		URLImagen:       sql.NullString{String: "https://ejemplo.com/imagen.jpg", Valid: true},
		Eliminado:       false,
		NombreSede:      "Paracas",
	}

	// Verificar campos
	if tipoTour.ID != 1 {
		t.Errorf("Se esperaba ID 1, pero se obtuvo %d", tipoTour.ID)
	}

	if tipoTour.IDSede != 2 {
		t.Errorf("Se esperaba IDSede 2, pero se obtuvo %d", tipoTour.IDSede)
	}

	if tipoTour.Nombre != "Tour a Islas Ballestas" {
		t.Errorf("Se esperaba nombre Tour a Islas Ballestas, pero se obtuvo %s", tipoTour.Nombre)
	}

	if !tipoTour.Descripcion.Valid || tipoTour.Descripcion.String != "Paseo en lancha para observar fauna marina" {
		t.Errorf("Se esperaba descripción 'Paseo en lancha para observar fauna marina', pero se obtuvo %v", tipoTour.Descripcion)
	}

	if tipoTour.DuracionMinutos != 120 {
		t.Errorf("Se esperaba duración 120 minutos, pero se obtuvo %d", tipoTour.DuracionMinutos)
	}

	// Probar NuevoTipoTourRequest
	nuevoTipoTourReq := entidades.NuevoTipoTourRequest{
		IDSede:          2,
		Nombre:          "Tour a Islas Ballestas",
		Descripcion:     "Paseo en lancha para observar fauna marina",
		DuracionMinutos: 120,
		URLImagen:       "https://ejemplo.com/imagen.jpg",
	}

	// Verificar campos de NuevoTipoTourRequest
	if nuevoTipoTourReq.IDSede != 2 {
		t.Errorf("Se esperaba IDSede 2, pero se obtuvo %d", nuevoTipoTourReq.IDSede)
	}
}
