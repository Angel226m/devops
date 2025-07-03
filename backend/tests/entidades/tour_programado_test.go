package entidades_test

import (
	"database/sql"
	"sistema-toursseft/internal/entidades"
	"testing"
	"time"
)

func TestTourProgramado(t *testing.T) {
	// Crear tour programado
	fecha := time.Date(2023, 7, 15, 0, 0, 0, 0, time.UTC)
	vigenciaDesde := time.Date(2023, 7, 1, 0, 0, 0, 0, time.UTC)
	vigenciaHasta := time.Date(2023, 7, 31, 0, 0, 0, 0, time.UTC)

	tourProgramado := entidades.TourProgramado{
		ID:                1,
		IDTipoTour:        2,
		IDEmbarcacion:     3,
		IDHorario:         4,
		IDSede:            5,
		IDChofer:          sql.NullInt64{Int64: 6, Valid: true},
		Fecha:             fecha,
		VigenciaDesde:     vigenciaDesde,
		VigenciaHasta:     vigenciaHasta,
		CupoMaximo:        30,
		CupoDisponible:    20,
		Estado:            "PROGRAMADO",
		Eliminado:         false,
		EsExcepcion:       false,
		NotasExcepcion:    sql.NullString{String: "", Valid: false},
		NombreTipoTour:    "Tour a Islas Ballestas",
		NombreEmbarcacion: "Embarcación 1",
		NombreSede:        "Paracas",
		NombreChofer:      "Juan Pérez",
		HoraInicio:        "09:00",
		HoraFin:           "11:00",
	}

	// Verificar campos
	if tourProgramado.ID != 1 {
		t.Errorf("Se esperaba ID 1, pero se obtuvo %d", tourProgramado.ID)
	}

	if tourProgramado.IDTipoTour != 2 {
		t.Errorf("Se esperaba IDTipoTour 2, pero se obtuvo %d", tourProgramado.IDTipoTour)
	}

	if tourProgramado.Fecha.Day() != 15 || tourProgramado.Fecha.Month() != 7 {
		t.Errorf("Se esperaba fecha 15/07, pero se obtuvo %d/%d", tourProgramado.Fecha.Day(), tourProgramado.Fecha.Month())
	}

	// Verificar cupo
	if tourProgramado.CupoMaximo != 30 {
		t.Errorf("Se esperaba CupoMaximo 30, pero se obtuvo %d", tourProgramado.CupoMaximo)
	}

	if tourProgramado.CupoDisponible != 20 {
		t.Errorf("Se esperaba CupoDisponible 20, pero se obtuvo %d", tourProgramado.CupoDisponible)
	}

	// Verificar estado
	if tourProgramado.Estado != "PROGRAMADO" {
		t.Errorf("Se esperaba estado PROGRAMADO, pero se obtuvo %s", tourProgramado.Estado)
	}

	// Probar NuevoTourProgramadoRequest
	notasExcepcion := "Fecha especial"
	nuevoTourReq := entidades.NuevoTourProgramadoRequest{
		IDTipoTour:     2,
		IDEmbarcacion:  3,
		IDHorario:      4,
		IDSede:         5,
		IDChofer:       nil, // Sin chofer asignado inicialmente
		Fecha:          "15/07/2023",
		VigenciaDesde:  "01/07/2023",
		VigenciaHasta:  "31/07/2023",
		CupoMaximo:     30,
		EsExcepcion:    true,
		NotasExcepcion: &notasExcepcion,
	}

	// Verificar campos de NuevoTourProgramadoRequest
	if nuevoTourReq.IDTipoTour != 2 {
		t.Errorf("Se esperaba IDTipoTour 2, pero se obtuvo %d", nuevoTourReq.IDTipoTour)
	}
}
