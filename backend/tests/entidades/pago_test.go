package entidades_test

import (
	"sistema-toursseft/internal/entidades"
	"testing"
	"time"
)

func TestPago(t *testing.T) {
	// Crear pago
	idSede := 3
	fechaPago := time.Now()

	pago := entidades.Pago{
		ID:                1,
		IDReserva:         2,
		MetodoPago:        "TARJETA",
		CanalPago:         "ONLINE",
		IDSede:            &idSede,
		Monto:             150.50,
		FechaPago:         fechaPago,
		Estado:            "PROCESADO",
		Comprobante:       "FACT-001",
		NumeroComprobante: "F001-123456",
		URLComprobante:    "https://ejemplo.com/comprobante.pdf",
		Eliminado:         false,
		NombreCliente:     "Juan Pérez",
		ApellidosCliente:  "García",
		DocumentoCliente:  "12345678",
		NombreSede:        "Paracas",
		TourNombre:        "Tour a Islas Ballestas",
		TourFecha:         time.Now().Add(24 * time.Hour),
	}

	// Verificar campos
	if pago.ID != 1 {
		t.Errorf("Se esperaba ID 1, pero se obtuvo %d", pago.ID)
	}

	if pago.IDReserva != 2 {
		t.Errorf("Se esperaba IDReserva 2, pero se obtuvo %d", pago.IDReserva)
	}

	if pago.MetodoPago != "TARJETA" {
		t.Errorf("Se esperaba método de pago TARJETA, pero se obtuvo %s", pago.MetodoPago)
	}

	if pago.CanalPago != "ONLINE" {
		t.Errorf("Se esperaba canal de pago ONLINE, pero se obtuvo %s", pago.CanalPago)
	}

	if *pago.IDSede != 3 {
		t.Errorf("Se esperaba IDSede 3, pero se obtuvo %d", *pago.IDSede)
	}

	if pago.Monto != 150.50 {
		t.Errorf("Se esperaba monto 150.50, pero se obtuvo %f", pago.Monto)
	}

	// Verificar estado
	if pago.Estado != "PROCESADO" {
		t.Errorf("Se esperaba estado PROCESADO, pero se obtuvo %s", pago.Estado)
	}

	// Probar NuevoPagoRequest
	nuevoPagoReq := entidades.NuevoPagoRequest{
		IDReserva:         2,
		MetodoPago:        "TARJETA",
		CanalPago:         "ONLINE",
		IDSede:            &idSede,
		Monto:             150.50,
		Comprobante:       "FACT-001",
		NumeroComprobante: "F001-123456",
		URLComprobante:    "https://ejemplo.com/comprobante.pdf",
	}

	// Verificar campos de NuevoPagoRequest
	if nuevoPagoReq.IDReserva != 2 {
		t.Errorf("Se esperaba IDReserva 2, pero se obtuvo %d", nuevoPagoReq.IDReserva)
	}
}
