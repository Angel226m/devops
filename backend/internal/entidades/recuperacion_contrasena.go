package entidades

import "time"

// TipoEntidad define el tipo de entidad para la recuperación de contraseña
type TipoEntidad string

const (
	// EntidadUsuario para usuarios del sistema administrativo
	EntidadUsuario TipoEntidad = "USUARIO"
	// EntidadCliente para clientes de la plataforma
	EntidadCliente TipoEntidad = "CLIENTE"
)

// RecuperacionContrasena representa un token para recuperar contraseña
type RecuperacionContrasena struct {
	ID          int         `json:"id" db:"id"`
	EntidadID   int         `json:"entidad_id" db:"entidad_id"`     // ID del usuario o cliente
	TipoEntidad TipoEntidad `json:"tipo_entidad" db:"tipo_entidad"` // USUARIO o CLIENTE
	Token       string      `json:"token" db:"token"`
	Expiracion  time.Time   `json:"expiracion" db:"expiracion"`
	Utilizado   bool        `json:"utilizado" db:"utilizado"`
	CreadoEn    time.Time   `json:"creado_en" db:"creado_en"`
}

// SolicitudRecuperacion representa la solicitud de recuperación de contraseña
type SolicitudRecuperacion struct {
	Correo      string      `json:"correo" validate:"required,email"`
	TipoEntidad TipoEntidad `json:"tipo_entidad" validate:"required,oneof=USUARIO CLIENTE"`
}

// ReseteoContrasena representa la solicitud para cambiar la contraseña
type ReseteoContrasena struct {
	Token               string `json:"token" validate:"required"`
	NuevaContrasena     string `json:"nueva_contrasena" validate:"required,min=6"`
	ConfirmarContrasena string `json:"confirmar_contrasena" validate:"required,eqfield=NuevaContrasena"`
}
