// internal/utils/encriptacion_test.go
package main

// internal/utils/encriptacion_test.go

import (
	"sistema-toursseft/internal/utils"
	"strings"
	"testing"
)

func TestEncriptacionCompleta(t *testing.T) {
	// === 1. Inicializar con clave de 32 caracteres (AES-256) ===
	key := "12345678901234567890123456789012" // ← 32 caracteres exactos. Cambia por una segura en producción

	if err := utils.InitCrypto(key); err != nil {
		t.Fatalf("❌ Falló InitCrypto: %v", err)
	}

	// Datos de prueba
	correo := "cliente@example.com"
	numeroDocumento := "72345678"
	numeroCelular := "987654321"

	// === 2. Cifrar todo ===
	cifrados, err := utils.CifrarDatosCliente(correo, numeroDocumento, numeroCelular)
	if err != nil {
		t.Fatalf("❌ Error al cifrar datos del cliente: %v", err)
	}

	// Verificar que están cifrados (no iguales al original)
	if cifrados.Correo == correo {
		t.Error("❌ El correo no fue cifrado (es igual al original)")
	}
	if cifrados.NumeroDocumento == numeroDocumento {
		t.Error("❌ El documento no fue cifrado (es igual al original)")
	}
	if cifrados.NumeroCelular == numeroCelular {
		t.Error("❌ El celular no fue cifrado (es igual al original)")
	}

	// === 3. Descifrar ===
	descifrados, err := utils.DescifrarDatosCliente(
		cifrados.Correo,
		cifrados.NumeroDocumento,
		cifrados.NumeroCelular,
	)
	if err != nil {
		t.Fatalf("❌ Error al descifrar datos: %v", err)
	}

	// === 4. Verificar que coinciden ===
	if descifrados.Correo != strings.ToLower(correo) {
		t.Errorf("❌ Correo no coincide: esperado %s, obtenido %s", strings.ToLower(correo), descifrados.Correo)
	}
	if descifrados.NumeroDocumento != strings.ToLower(numeroDocumento) {
		t.Errorf("❌ Documento no coincide: esperado %s, obtenido %s", strings.ToLower(numeroDocumento), descifrados.NumeroDocumento)
	}
	if descifrados.NumeroCelular != numeroCelular {
		t.Errorf("❌ Celular no coincide: esperado %s, obtenido %s", numeroCelular, descifrados.NumeroCelular)
	}

	t.Log("✅ ¡Todo funcionó perfectamente!")
	t.Logf("   Correo cifrado (ejemplo): %.50s...", cifrados.Correo)
	t.Logf("   Documento cifrado (ejemplo): %.50s...", cifrados.NumeroDocumento)
	t.Logf("   Celular cifrado (ejemplo): %.50s...", cifrados.NumeroCelular)
}
