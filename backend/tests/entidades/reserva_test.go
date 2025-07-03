package entidades_test

import (
	"sistema-toursseft/internal/entidades"
	"testing"
	"time"
)

func TestReserva(t *testing.T) {
	// Crear reserva
	fechaReserva := time.Now()
	idVendedor := 1
	idPaquete := 4

	reserva := entidades.Reserva{
		ID:           100,
		IDVendedor:   &idVendedor,
		IDCliente:    2,
		IDInstancia:  3,
		IDPaquete:    &idPaquete,
		FechaReserva: fechaReserva,
		TotalPagar:   250.00,
		Notas:        "Reserva para familia",
		Estado:       "CONFIRMADA",
		Eliminado:    false,
		CantidadPasajes: []entidades.PasajeCantidad{
			{IDTipoPasaje: 1, NombreTipo: "Adulto", Cantidad: 2},
			{IDTipoPasaje: 2, NombreTipo: "Niño", Cantidad: 1},
		},
		NombreCliente:  "Juan Pérez",
		NombreVendedor: "María Gómez",
		NombreTour:     "Tour a Islas Ballestas",
		FechaTour:      "15/07/2023",
		HoraInicioTour: "09:00",
		HoraFinTour:    "11:00",
		TotalPasajeros: 3,
	}

	// Verificar campos
	if reserva.ID != 100 {
		t.Errorf("Se esperaba ID 100, pero se obtuvo %d", reserva.ID)
	}

	if *reserva.IDVendedor != 1 {
		t.Errorf("Se esperaba IDVendedor 1, pero se obtuvo %d", *reserva.IDVendedor)
	}

	if reserva.IDCliente != 2 {
		t.Errorf("Se esperaba IDCliente 2, pero se obtuvo %d", reserva.IDCliente)
	}

	if reserva.IDInstancia != 3 {
		t.Errorf("Se esperaba IDInstancia 3, pero se obtuvo %d", reserva.IDInstancia)
	}

	// Verificar monto
	if reserva.TotalPagar != 250.00 {
		t.Errorf("Se esperaba TotalPagar 250.00, pero se obtuvo %.2f", reserva.TotalPagar)
	}

	// Verificar estado
	if reserva.Estado != "CONFIRMADA" {
		t.Errorf("Se esperaba estado CONFIRMADA, pero se obtuvo %s", reserva.Estado)
	}

	// Verificar cantidad de pasajes
	if len(reserva.CantidadPasajes) != 2 {
		t.Errorf("Se esperaban 2 tipos de pasajes, pero se obtuvieron %d", len(reserva.CantidadPasajes))
	}

	if reserva.CantidadPasajes[0].Cantidad != 2 || reserva.CantidadPasajes[1].Cantidad != 1 {
		t.Errorf("Se esperaban 2 adultos y 1 niño, pero se obtuvieron %d adultos y %d niños",
			reserva.CantidadPasajes[0].Cantidad, reserva.CantidadPasajes[1].Cantidad)
	}

	// Verificar total de pasajeros
	if reserva.TotalPasajeros != 3 {
		t.Errorf("Se esperaban 3 pasajeros en total, pero se obtuvieron %d", reserva.TotalPasajeros)
	}

	// Probar NuevaReservaRequest
	idVendedorReq := 1
	nuevaReservaReq := entidades.NuevaReservaRequest{
		IDCliente:   2,
		IDInstancia: 3,
		IDPaquete:   &idPaquete,
		IDVendedor:  &idVendedorReq,
		TotalPagar:  250.00,
		Notas:       "Reserva para familia",
		CantidadPasajes: []entidades.PasajeCantidadRequest{
			{IDTipoPasaje: 1, Cantidad: 2},
			{IDTipoPasaje: 2, Cantidad: 1},
		},
	}

	// Verificar campos de NuevaReservaRequest
	if nuevaReservaReq.IDCliente != 2 {
		t.Errorf("Se esperaba IDCliente 2, pero se obtuvo %d", nuevaReservaReq.IDCliente)
	}

	if len(nuevaReservaReq.CantidadPasajes) != 2 {
		t.Errorf("Se esperaban 2 tipos de pasajes, pero se obtuvieron %d", len(nuevaReservaReq.CantidadPasajes))
	}
}
