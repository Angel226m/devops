package entidades_test

import (
	"encoding/json"
	"strings"
	"testing"
	"time"

	"sistema-toursseft/internal/entidades"
)

func TestReserva_JSONMarshalling_CamposBasicos(t *testing.T) {
	fechaReserva := time.Date(2025, 12, 13, 10, 0, 0, 0, time.UTC)
	fechaExp := time.Date(2025, 12, 20, 0, 0, 0, 0, time.UTC)

	reserva := entidades.Reserva{
		ID:              123,
		IDVendedor:      nil, // omitempty
		IDCliente:       45,
		IDInstancia:     78,
		FechaReserva:    fechaReserva,
		TotalPagar:      350.50,
		Notas:           "Reserva familiar",
		Estado:          "RESERVADO",
		Eliminado:       false,
		FechaExpiracion: &fechaExp,

		// Campos adicionales con db:"-" (no afectan JSON)
		NombreCliente:  "María González",
		NombreVendedor: "Pedro Ruiz",
		NombreTour:     "Tour Islas Ballestas",
		TotalPasajeros: 4,
		MetodoPago:     "Mercado Pago",
	}

	data, err := json.Marshal(reserva)
	if err != nil {
		t.Fatalf("Error al marshal Reserva: %v", err)
	}

	jsonStr := string(data)

	// Verificar campos obligatorios presentes
	camposEsperados := map[string]string{
		"id_reserva":       `"id_reserva":123`,
		"id_cliente":       `"id_cliente":45`,
		"id_instancia":     `"id_instancia":78`,
		"fecha_reserva":    `"fecha_reserva":"2025-12-13T10:00:00Z"`,
		"total_pagar":      `"total_pagar":350.5`,
		"notas":            `"notas":"Reserva familiar"`,
		"estado":           `"estado":"RESERVADO"`,
		"eliminado":        `"eliminado":false`,
		"fecha_expiracion": `"fecha_expiracion":"2025-12-20T00:00:00Z"`,

		// Campos adicionales (db:"-" pero json con omitempty)
		"nombre_cliente":  `"nombre_cliente":"María González"`,
		"nombre_vendedor": `"nombre_vendedor":"Pedro Ruiz"`,
		"nombre_tour":     `"nombre_tour":"Tour Islas Ballestas"`,
		"total_pasajeros": `"total_pasajeros":4`,
		"metodo_pago":     `"metodo_pago":"Mercado Pago"`,
	}

	for nombre, fragmento := range camposEsperados {
		if !strings.Contains(jsonStr, fragmento) {
			t.Errorf("Falta o incorrecto el campo %s en JSON.\nJSON generado:\n%s", nombre, jsonStr)
		}
	}

	// Verificar que id_vendedor NO aparece (es nil → omitempty)
	if strings.Contains(jsonStr, "id_vendedor") {
		t.Error("id_vendedor NO debería aparecer cuando es nil")
	}
}

func TestReserva_JSONOmitEmpty_SlicesYCampos(t *testing.T) {
	reserva := entidades.Reserva{
		ID:           999,
		IDCliente:    1,
		IDInstancia:  1,
		FechaReserva: time.Now(),
		TotalPagar:   100.0,
		Estado:       "RESERVADO",
		Eliminado:    false,

		// Slices vacíos → deben omitirse por omitempty
		CantidadPasajes: []entidades.PasajeCantidad{},
		Paquetes:        []entidades.PaquetePasajeDetalle{},

		// Campos opcionales vacíos
		Notas:          "",
		NombreCliente:  "",
		NombreVendedor: "",
		MetodoPago:     "",
		TotalPasajeros: 0,
	}

	data, _ := json.Marshal(reserva)
	jsonStr := string(data)

	// Estos campos NO deben aparecer
	camposOmitidos := []string{
		"cantidad_pasajes",
		"paquetes",
		"notas",
		"nombre_cliente",
		"nombre_vendedor",
		"metodo_pago",
		"total_pasajeros",
	}

	for _, campo := range camposOmitidos {
		if strings.Contains(jsonStr, campo) {
			t.Errorf("El campo '%s' NO debería aparecer cuando está vacío (omitempty)", campo)
		}
	}

	// Pero los campos requeridos sí deben estar
	if !strings.Contains(jsonStr, "id_reserva") ||
		!strings.Contains(jsonStr, "id_cliente") ||
		!strings.Contains(jsonStr, "estado") {
		t.Errorf("Campos principales faltantes en JSON: %s", jsonStr)
	}
}

func TestReserva_JSONConDatosEnSlices(t *testing.T) {
	reserva := entidades.Reserva{
		ID:          1,
		IDCliente:   10,
		IDInstancia: 20,
		Estado:      "CONFIRMADA",

		CantidadPasajes: []entidades.PasajeCantidad{
			{IDTipoPasaje: 1, NombreTipo: "Adulto", Cantidad: 2, PrecioUnitario: 50.0, Subtotal: 100.0},
			{IDTipoPasaje: 2, NombreTipo: "Niño", Cantidad: 1, PrecioUnitario: 30.0, Subtotal: 30.0},
		},
		Paquetes: []entidades.PaquetePasajeDetalle{
			{IDPaquete: 5, NombrePaquete: "Familiar", Cantidad: 1, PrecioUnitario: 200.0, Subtotal: 200.0, CantidadTotal: 4},
		},
	}

	data, err := json.Marshal(reserva)
	if err != nil {
		t.Fatal(err)
	}

	jsonStr := string(data)

	// Verificar que los slices aparecen y tienen contenido
	if !strings.Contains(jsonStr, "cantidad_pasajes") {
		t.Error("cantidad_pasajes debería aparecer cuando tiene elementos")
	}
	if !strings.Contains(jsonStr, "paquetes") {
		t.Error("paquetes debería aparecer cuando tiene elementos")
	}
	if !strings.Contains(jsonStr, "Adulto") || !strings.Contains(jsonStr, "Niño") {
		t.Error("Los nombres de tipos de pasaje no aparecen en JSON")
	}
	if !strings.Contains(jsonStr, "Familiar") {
		t.Error("El nombre del paquete no aparece en JSON")
	}
}
