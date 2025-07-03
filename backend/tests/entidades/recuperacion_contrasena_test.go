package entidades_test

import (
	"sistema-toursseft/internal/entidades"
	"testing"
	"time"
)

func TestRecuperacionContrasena(t *testing.T) {
	// Crear token de recuperación
	ahora := time.Now()
	expiracion := ahora.Add(24 * time.Hour)

	recuperacion := entidades.RecuperacionContrasena{
		ID:          1,
		EntidadID:   2,
		TipoEntidad: entidades.EntidadUsuario,
		Token:       "token123456",
		Expiracion:  expiracion,
		Utilizado:   false,
		CreadoEn:    ahora,
	}

	// Verificar campos
	if recuperacion.ID != 1 {
		t.Errorf("Se esperaba ID 1, pero se obtuvo %d", recuperacion.ID)
	}

	if recuperacion.EntidadID != 2 {
		t.Errorf("Se esperaba EntidadID 2, pero se obtuvo %d", recuperacion.EntidadID)
	}

	if recuperacion.TipoEntidad != entidades.EntidadUsuario {
		t.Errorf("Se esperaba TipoEntidad USUARIO, pero se obtuvo %s", recuperacion.TipoEntidad)
	}

	if recuperacion.Token != "token123456" {
		t.Errorf("Se esperaba Token token123456, pero se obtuvo %s", recuperacion.Token)
	}

	if recuperacion.Utilizado {
		t.Error("Se esperaba que el token no estuviera utilizado")
	}

	// Probar SolicitudRecuperacion
	solicitudRecuperacion := entidades.SolicitudRecuperacion{
		Correo:      "usuario@ejemplo.com",
		TipoEntidad: entidades.EntidadUsuario,
	}

	// Verificar campos de SolicitudRecuperacion
	if solicitudRecuperacion.Correo != "usuario@ejemplo.com" {
		t.Errorf("Se esperaba correo usuario@ejemplo.com, pero se obtuvo %s", solicitudRecuperacion.Correo)
	}

	// Probar ReseteoContrasena
	reseteoContrasena := entidades.ReseteoContrasena{
		Token:               "token123456",
		NuevaContrasena:     "nuevaContrasena123",
		ConfirmarContrasena: "nuevaContrasena123",
	}

	// Verificar campos de ReseteoContrasena
	if reseteoContrasena.Token != "token123456" {
		t.Errorf("Se esperaba Token token123456, pero se obtuvo %s", reseteoContrasena.Token)
	}

	// Verificar que las contraseñas coincidan
	if reseteoContrasena.NuevaContrasena != reseteoContrasena.ConfirmarContrasena {
		t.Error("Las contraseñas no coinciden")
	}
}
