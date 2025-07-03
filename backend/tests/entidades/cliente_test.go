package entidades_test

import (
	"sistema-toursseft/internal/entidades"
	"testing"
)

func TestCliente(t *testing.T) {
	// Crear cliente persona natural
	clienteNatural := entidades.Cliente{
		ID:              1,
		TipoDocumento:   "DNI",
		NumeroDocumento: "12345678",
		Nombres:         "Juan",
		Apellidos:       "Pérez",
		Correo:          "juan@ejemplo.com",
		NumeroCelular:   "987654321",
		Contrasena:      "contrasena_hash",
		Eliminado:       false,
	}

	// Verificar campos de persona natural
	if clienteNatural.TipoDocumento != "DNI" {
		t.Errorf("Se esperaba tipo de documento DNI, pero se obtuvo %s", clienteNatural.TipoDocumento)
	}

	if clienteNatural.Nombres != "Juan" {
		t.Errorf("Se esperaba nombres Juan, pero se obtuvo %s", clienteNatural.Nombres)
	}

	if clienteNatural.Apellidos != "Pérez" {
		t.Errorf("Se esperaba apellidos Pérez, pero se obtuvo %s", clienteNatural.Apellidos)
	}

	// Crear cliente empresa
	clienteEmpresa := entidades.Cliente{
		ID:              2,
		TipoDocumento:   "RUC",
		NumeroDocumento: "20123456789",
		RazonSocial:     "Empresa S.A.C.",
		DireccionFiscal: "Av. Principal 123",
		Correo:          "empresa@ejemplo.com",
		NumeroCelular:   "987123456",
		Contrasena:      "contrasena_empresa_hash",
		Eliminado:       false,
	}

	// Verificar campos de empresa
	if clienteEmpresa.TipoDocumento != "RUC" {
		t.Errorf("Se esperaba tipo de documento RUC, pero se obtuvo %s", clienteEmpresa.TipoDocumento)
	}

	if clienteEmpresa.RazonSocial != "Empresa S.A.C." {
		t.Errorf("Se esperaba razón social Empresa S.A.C., pero se obtuvo %s", clienteEmpresa.RazonSocial)
	}

	if clienteEmpresa.DireccionFiscal != "Av. Principal 123" {
		t.Errorf("Se esperaba dirección fiscal Av. Principal 123, pero se obtuvo %s", clienteEmpresa.DireccionFiscal)
	}

	// Probar NuevoClienteRequest
	nuevoClienteReq := entidades.NuevoClienteRequest{
		TipoDocumento:   "DNI",
		NumeroDocumento: "12345678",
		Nombres:         "Juan",
		Apellidos:       "Pérez",
		Correo:          "juan@ejemplo.com",
		NumeroCelular:   "987654321",
		Contrasena:      "contrasena123",
	}

	// Verificar campos de NuevoClienteRequest
	if nuevoClienteReq.TipoDocumento != "DNI" {
		t.Errorf("Se esperaba tipo de documento DNI, pero se obtuvo %s", nuevoClienteReq.TipoDocumento)
	}

	// Probar ActualizarClienteRequest
	actualizarClienteReq := entidades.ActualizarClienteRequest{
		TipoDocumento:   "DNI",
		NumeroDocumento: "12345678",
		Nombres:         "Juan Carlos",
		Apellidos:       "Pérez García",
		Correo:          "juancarlos@ejemplo.com",
		NumeroCelular:   "987654322",
	}

	// Verificar campos actualizados
	if actualizarClienteReq.Nombres != "Juan Carlos" {
		t.Errorf("Se esperaba nombres Juan Carlos, pero se obtuvo %s", actualizarClienteReq.Nombres)
	}
}
