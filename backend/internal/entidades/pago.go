package entidades

import "time"

// Pago representa la estructura de un pago en el sistema
type Pago struct {
	ID                int       `json:"id_pago" db:"id_pago"`
	IDReserva         int       `json:"id_reserva" db:"id_reserva"`
	MetodoPago        string    `json:"metodo_pago" db:"metodo_pago"`   // Ahora es string
	CanalPago         string    `json:"canal_pago" db:"canal_pago"`     // Ahora es string
	IDSede            *int      `json:"id_sede,omitempty" db:"id_sede"` // Ahora es puntero para manejar NULL
	Monto             float64   `json:"monto" db:"monto"`
	FechaPago         time.Time `json:"fecha_pago" db:"fecha_pago"`
	Estado            string    `json:"estado" db:"estado"`
	Comprobante       string    `json:"comprobante,omitempty" db:"comprobante"`               // Para referencias externas
	NumeroComprobante string    `json:"numero_comprobante,omitempty" db:"numero_comprobante"` // Para documentos internos
	URLComprobante    string    `json:"url_comprobante,omitempty" db:"url_comprobante"`       // URL a comprobante digital
	Eliminado         bool      `json:"eliminado,omitempty" db:"eliminado"`

	// Campos adicionales para mostrar información relacionada
	NombreCliente    string    `json:"nombre_cliente,omitempty" db:"-"`
	ApellidosCliente string    `json:"apellidos_cliente,omitempty" db:"-"`
	DocumentoCliente string    `json:"documento_cliente,omitempty" db:"-"`
	NombreSede       string    `json:"nombre_sede,omitempty" db:"-"`
	TourNombre       string    `json:"tour_nombre,omitempty" db:"-"`
	TourFecha        time.Time `json:"tour_fecha,omitempty" db:"-"`
}

// NuevoPagoRequest representa los datos necesarios para crear un nuevo pago
type NuevoPagoRequest struct {
	IDReserva         int     `json:"id_reserva" validate:"required"`
	MetodoPago        string  `json:"metodo_pago" validate:"required"` // Ahora es string
	CanalPago         string  `json:"canal_pago" validate:"required"`  // Ahora es string
	IDSede            *int    `json:"id_sede,omitempty"`               // Ahora es puntero para manejar NULL
	Monto             float64 `json:"monto" validate:"required,min=0"`
	Comprobante       string  `json:"comprobante,omitempty"`        // Para referencias externas
	NumeroComprobante string  `json:"numero_comprobante,omitempty"` // Para documentos internos
	URLComprobante    string  `json:"url_comprobante,omitempty"`    // URL a comprobante digital
}

// ActualizarPagoRequest representa los datos para actualizar un pago
type ActualizarPagoRequest struct {
	MetodoPago        string  `json:"metodo_pago" validate:"required"`
	CanalPago         string  `json:"canal_pago" validate:"required"`
	IDSede            *int    `json:"id_sede,omitempty"`
	Monto             float64 `json:"monto" validate:"required,min=0"`
	Comprobante       string  `json:"comprobante,omitempty"`
	NumeroComprobante string  `json:"numero_comprobante,omitempty"`
	URLComprobante    string  `json:"url_comprobante,omitempty"`
	Estado            string  `json:"estado" validate:"required,oneof=PROCESADO PENDIENTE ANULADO"`
}

// CambiarEstadoPagoRequest representa los datos para cambiar el estado de un pago
type CambiarEstadoPagoRequest struct {
	Estado string `json:"estado" validate:"required,oneof=PROCESADO PENDIENTE ANULADO"`
}
