package entidades_test

import (
	"sistema-toursseft/internal/entidades"
	"testing"
)

func TestPaquetePasajes(t *testing.T) {
	// Crear paquete de pasajes
	paquetePasajes := entidades.PaquetePasajes{
		ID:            1,
		IDSede:        2,
		IDTipoTour:    3,
		Nombre:        "Pack Familiar",
		Descripcion:   "Paquete para 2 adultos y 2 niños",
		PrecioTotal:   300.00,
		CantidadTotal: 4,
		Eliminado:     false,
	}

	// Verificar campos
	if paquetePasajes.ID != 1 {
		t.Errorf("Se esperaba ID 1, pero se obtuvo %d", paquetePasajes.ID)
	}

	if paquetePasajes.IDSede != 2 {
		t.Errorf("Se esperaba IDSede 2, pero se obtuvo %d", paquetePasajes.IDSede)
	}

	if paquetePasajes.IDTipoTour != 3 {
		t.Errorf("Se esperaba IDTipoTour 3, pero se obtuvo %d", paquetePasajes.IDTipoTour)
	}

	if paquetePasajes.Nombre != "Pack Familiar" {
		t.Errorf("Se esperaba nombre Pack Familiar, pero se obtuvo %s", paquetePasajes.Nombre)
	}

	if paquetePasajes.PrecioTotal != 300.00 {
		t.Errorf("Se esperaba PrecioTotal 300.00, pero se obtuvo %.2f", paquetePasajes.PrecioTotal)
	}

	if paquetePasajes.CantidadTotal != 4 {
		t.Errorf("Se esperaba CantidadTotal 4, pero se obtuvo %d", paquetePasajes.CantidadTotal)
	}

	// Probar NuevoPaquetePasajesRequest
	nuevoPaqueteReq := entidades.NuevoPaquetePasajesRequest{
		IDSede:        2,
		IDTipoTour:    3,
		Nombre:        "Pack Familiar",
		Descripcion:   "Paquete para 2 adultos y 2 niños",
		PrecioTotal:   300.00,
		CantidadTotal: 4,
	}

	// Verificar campos de NuevoPaquetePasajesRequest
	if nuevoPaqueteReq.IDSede != 2 {
		t.Errorf("Se esperaba IDSede 2, pero se obtuvo %d", nuevoPaqueteReq.IDSede)
	}
}
