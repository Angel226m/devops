package entidades_test

import (
	"database/sql"
	"sistema-toursseft/internal/entidades"
	"testing"
	"time"
)

func TestInstanciaTour(t *testing.T) {
	// Crear instancia de tour
	fechaEspecifica := time.Date(2023, 7, 15, 0, 0, 0, 0, time.UTC)
	horaInicio := time.Date(2023, 7, 15, 9, 0, 0, 0, time.UTC)
	horaFin := time.Date(2023, 7, 15, 11, 0, 0, 0, time.UTC)

	instanciaTour := entidades.InstanciaTour{
		ID:                 1,
		IDTourProgramado:   2,
		FechaEspecifica:    fechaEspecifica,
		HoraInicio:         horaInicio,
		HoraFin:            horaFin,
		IDChofer:           sql.NullInt64{Int64: 3, Valid: true},
		IDEmbarcacion:      4,
		CupoDisponible:     20,
		Estado:             "PROGRAMADO",
		Eliminado:          false,
		NombreTipoTour:     "Tour a Islas Ballestas",
		NombreEmbarcacion:  "Embarcación 1",
		NombreSede:         "Paracas",
		NombreChofer:       "Juan Pérez",
		HoraInicioStr:      "09:00",
		HoraFinStr:         "11:00",
		FechaEspecificaStr: "15/07/2023",
	}

	// Verificar campos
	if instanciaTour.ID != 1 {
		t.Errorf("Se esperaba ID 1, pero se obtuvo %d", instanciaTour.ID)
	}

	if instanciaTour.IDTourProgramado != 2 {
		t.Errorf("Se esperaba IDTourProgramado 2, pero se obtuvo %d", instanciaTour.IDTourProgramado)
	}

	if instanciaTour.FechaEspecifica.Day() != 15 || instanciaTour.FechaEspecifica.Month() != 7 {
		t.Errorf("Se esperaba fecha 15/07, pero se obtuvo %d/%d", instanciaTour.FechaEspecifica.Day(), instanciaTour.FechaEspecifica.Month())
	}

	// Verificar IDChofer
	if !instanciaTour.IDChofer.Valid || instanciaTour.IDChofer.Int64 != 3 {
		t.Errorf("Se esperaba IDChofer 3, pero se obtuvo %v", instanciaTour.IDChofer)
	}

	// Verificar estado
	if instanciaTour.Estado != "PROGRAMADO" {
		t.Errorf("Se esperaba estado PROGRAMADO, pero se obtuvo %s", instanciaTour.Estado)
	}

	// Probar NuevaInstanciaTourRequest
	nuevaInstanciaReq := entidades.NuevaInstanciaTourRequest{
		IDTourProgramado: 2,
		FechaEspecifica:  "15/07/2023",
		HoraInicio:       "09:00",
		HoraFin:          "11:00",
		IDChofer:         nil, // Sin chofer asignado inicialmente
		IDEmbarcacion:    4,
		CupoDisponible:   20,
	}

	// Verificar campos de NuevaInstanciaTourRequest
	if nuevaInstanciaReq.IDTourProgramado != 2 {
		t.Errorf("Se esperaba IDTourProgramado 2, pero se obtuvo %d", nuevaInstanciaReq.IDTourProgramado)
	}
}
