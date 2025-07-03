package entidades_test

import (
	"sistema-toursseft/internal/entidades"
	"testing"
	"time"
)

func TestHorarioTour(t *testing.T) {
	// Crear horario de tour
	horaInicio := time.Date(0, 1, 1, 9, 0, 0, 0, time.UTC)
	horaFin := time.Date(0, 1, 1, 11, 0, 0, 0, time.UTC)

	horarioTour := entidades.HorarioTour{
		ID:                  1,
		IDTipoTour:          2,
		IDSede:              3,
		HoraInicio:          horaInicio,
		HoraFin:             horaFin,
		DisponibleLunes:     true,
		DisponibleMartes:    true,
		DisponibleMiercoles: true,
		DisponibleJueves:    true,
		DisponibleViernes:   true,
		DisponibleSabado:    false,
		DisponibleDomingo:   false,
		Eliminado:           false,
		NombreTipoTour:      "Tour a Islas Ballestas",
		NombreSede:          "Paracas",
	}

	// Verificar campos
	if horarioTour.ID != 1 {
		t.Errorf("Se esperaba ID 1, pero se obtuvo %d", horarioTour.ID)
	}

	if horarioTour.IDTipoTour != 2 {
		t.Errorf("Se esperaba IDTipoTour 2, pero se obtuvo %d", horarioTour.IDTipoTour)
	}

	if horarioTour.HoraInicio.Hour() != 9 {
		t.Errorf("Se esperaba hora de inicio 9, pero se obtuvo %d", horarioTour.HoraInicio.Hour())
	}

	if horarioTour.HoraFin.Hour() != 11 {
		t.Errorf("Se esperaba hora de fin 11, pero se obtuvo %d", horarioTour.HoraFin.Hour())
	}

	// Verificar disponibilidad
	if !horarioTour.DisponibleLunes {
		t.Error("Se esperaba disponible los lunes")
	}

	if horarioTour.DisponibleSabado {
		t.Error("No se esperaba disponible los sábados")
	}

	// Probar NuevoHorarioTourRequest
	nuevoHorarioReq := entidades.NuevoHorarioTourRequest{
		IDTipoTour:          2,
		IDSede:              3,
		HoraInicio:          "09:00",
		HoraFin:             "11:00",
		DisponibleLunes:     true,
		DisponibleMartes:    true,
		DisponibleMiercoles: true,
		DisponibleJueves:    true,
		DisponibleViernes:   true,
		DisponibleSabado:    false,
		DisponibleDomingo:   false,
	}

	// Verificar campos de NuevoHorarioTourRequest
	if nuevoHorarioReq.HoraInicio != "09:00" {
		t.Errorf("Se esperaba hora de inicio 09:00, pero se obtuvo %s", nuevoHorarioReq.HoraInicio)
	}
}
