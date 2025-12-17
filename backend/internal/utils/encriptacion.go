package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"strings"
)

// Variable global para la clave de cifrado
var encryptionKey []byte

// InitCrypto inicializa el sistema de encriptación
// masterKey debe ser de 32 caracteres para AES-256
func InitCrypto(masterKey string) error {
	if len(masterKey) != 32 {
		return fmt.Errorf("la clave de encriptación debe ser de exactamente 32 caracteres, recibida: %d", len(masterKey))
	}

	encryptionKey = []byte(masterKey)
	fmt.Println("✅ Sistema de encriptación AES-256-GCM inicializado correctamente")
	return nil
}

// ═══════════════════════════════════════════════════════════════
// CIFRADO RÁPIDO (AES-GCM) - Para correo y DNI
// Usa un nonce fijo basado en el contenido (determinístico pero seguro)
// ═══════════════════════════════════════════════════════════════

// EncryptFast cifra rápidamente usando un nonce derivado del contenido
// Ideal para correo y DNI donde necesitas rapidez
func EncryptFast(plaintext string) (string, error) {
	fmt.Printf("    🔹 EncryptFast llamado con texto de longitud: %d\n", len(plaintext))

	if plaintext == "" {
		fmt.Println("    ⚠️ Texto vacío, devolviendo cadena vacía")
		return "", nil
	}

	// Normalizar:  quitar espacios y a minúsculas
	plaintext = strings.ToLower(strings.TrimSpace(plaintext))
	fmt.Printf("    🔹 Texto normalizado:  '%s' (longitud: %d)\n", plaintext, len(plaintext))

	block, err := aes.NewCipher(encryptionKey)
	if err != nil {
		fmt.Printf("    ❌ Error al crear cifrador AES: %v\n", err)
		return "", fmt.Errorf("error al crear cifrador:  %v", err)
	}
	fmt.Println("    ✅ Cifrador AES creado")

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		fmt.Printf("    ❌ Error al crear GCM: %v\n", err)
		return "", fmt.Errorf("error al crear GCM: %v", err)
	}
	fmt.Printf("    ✅ GCM creado (nonce size: %d)\n", gcm.NonceSize())

	// Generar nonce determinístico
	nonce := make([]byte, gcm.NonceSize())
	copy(nonce, []byte(plaintext))
	fmt.Printf("    🔹 Nonce generado (primeros bytes del plaintext)\n")

	ciphertext := gcm.Seal(nonce, nonce, []byte(plaintext), nil)
	fmt.Printf("    ✅ Texto cifrado (longitud: %d bytes)\n", len(ciphertext))

	encoded := base64.StdEncoding.EncodeToString(ciphertext)
	fmt.Printf("    ✅ Codificado en base64 (longitud: %d)\n", len(encoded))

	return encoded, nil
}

// DecryptFast descifra datos cifrados con EncryptFast
func DecryptFast(encrypted string) (string, error) {
	if encrypted == "" {
		return "", nil
	}

	data, err := base64.StdEncoding.DecodeString(encrypted)
	if err != nil {
		return "", fmt.Errorf("error al decodificar base64: %v", err)
	}

	block, err := aes.NewCipher(encryptionKey)
	if err != nil {
		return "", fmt.Errorf("error al crear cifrador: %v", err)
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("error al crear GCM: %v", err)
	}

	nonceSize := gcm.NonceSize()
	if len(data) < nonceSize {
		return "", errors.New("ciphertext demasiado corto")
	}

	nonce, ciphertext := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", fmt.Errorf("error al descifrar: %v", err)
	}

	return string(plaintext), nil
}

// ═══════════════════════════════════════════════════════════════
// CIFRADO SEGURO (AES-GCM con nonce aleatorio) - Para celular
// Más seguro pero un poco más lento
// ═══════════════════════════════════════════════════════════════

// EncryptSecure cifra con nonce aleatorio (máxima seguridad)
// Ideal para número de celular
func EncryptSecure(plaintext string) (string, error) {
	if plaintext == "" {
		return "", nil
	}

	// Para celular, mantener formato original (no normalizar)
	plaintext = strings.TrimSpace(plaintext)

	block, err := aes.NewCipher(encryptionKey)
	if err != nil {
		return "", fmt.Errorf("error al crear cifrador:  %v", err)
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("error al crear GCM:  %v", err)
	}

	// Nonce completamente aleatorio (no determinístico)
	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", fmt.Errorf("error al generar nonce: %v", err)
	}

	ciphertext := gcm.Seal(nonce, nonce, []byte(plaintext), nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// DecryptSecure descifra datos cifrados con EncryptSecure
func DecryptSecure(encrypted string) (string, error) {
	if encrypted == "" {
		return "", nil
	}

	data, err := base64.StdEncoding.DecodeString(encrypted)
	if err != nil {
		return "", fmt.Errorf("error al decodificar base64: %v", err)
	}

	block, err := aes.NewCipher(encryptionKey)
	if err != nil {
		return "", fmt.Errorf("error al crear cifrador: %v", err)
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("error al crear GCM: %v", err)
	}

	nonceSize := gcm.NonceSize()
	if len(data) < nonceSize {
		return "", errors.New("ciphertext demasiado corto")
	}

	nonce, ciphertext := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", fmt.Errorf("error al descifrar:  %v", err)
	}

	return string(plaintext), nil
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES HELPER PARA CLIENTE
// ═══════════════════════════════════════════════════════════════

// EncryptCorreo cifra un correo electrónico (rápido)
func EncryptCorreo(correo string) (string, error) {
	return EncryptFast(correo)
}

// DecryptCorreo descifra un correo electrónico
func DecryptCorreo(correoEncriptado string) (string, error) {
	return DecryptFast(correoEncriptado)
}

// EncryptNumeroDocumento cifra un número de documento (rápido)
func EncryptNumeroDocumento(numeroDocumento string) (string, error) {
	return EncryptFast(numeroDocumento)
}

// DecryptNumeroDocumento descifra un número de documento
func DecryptNumeroDocumento(documentoEncriptado string) (string, error) {
	return DecryptFast(documentoEncriptado)
}

// EncryptNumeroCelular cifra un número de celular (seguro)
func EncryptNumeroCelular(numeroCelular string) (string, error) {
	return EncryptSecure(numeroCelular)
}

// DecryptNumeroCelular descifra un número de celular
func DecryptNumeroCelular(celularEncriptado string) (string, error) {
	return DecryptSecure(celularEncriptado)
}

// ═══════════════════════════════════════════════════════════════
// WRAPPER COMPLETO PARA CLIENTE
// ═══════════════════════════════════════════════════════════════

// DatosClienteCifrados representa los datos sensibles cifrados de un cliente
type DatosClienteCifrados struct {
	Correo          string
	NumeroDocumento string
	NumeroCelular   string
}

// CifrarDatosCliente cifra todos los datos sensibles de un cliente
// CifrarDatosCliente cifra todos los datos sensibles de un cliente
func CifrarDatosCliente(correo, numeroDocumento, numeroCelular string) (*DatosClienteCifrados, error) {
	fmt.Printf("🔐 CifrarDatosCliente llamado\n")
	fmt.Printf("  - encryptionKey está configurada: %v\n", encryptionKey != nil)
	fmt.Printf("  - longitud encryptionKey:  %d\n", len(encryptionKey))

	// ✅ Cifrar correo (rápido - determinístico)
	fmt.Printf("  - Cifrando correo: '%s'\n", correo)
	correoEncriptado, err := EncryptCorreo(correo)
	if err != nil {
		fmt.Printf("  ❌ ERROR al cifrar correo: %v\n", err)
		return nil, fmt.Errorf("error al cifrar correo: %v", err)
	}
	fmt.Printf("  ✅ Correo cifrado: %s.. .\n", correoEncriptado[:min(20, len(correoEncriptado))])

	// ✅ Cifrar número de documento (rápido - determinístico)
	fmt.Printf("  - Cifrando documento: '%s'\n", numeroDocumento)
	documentoEncriptado, err := EncryptNumeroDocumento(numeroDocumento)
	if err != nil {
		fmt.Printf("  ❌ ERROR al cifrar documento: %v\n", err)
		return nil, fmt.Errorf("error al cifrar número de documento: %v", err)
	}
	fmt.Printf("  ✅ Documento cifrado: %s...\n", documentoEncriptado[:min(20, len(documentoEncriptado))])

	// ✅ Cifrar número de celular (seguro - aleatorio)
	fmt.Printf("  - Cifrando celular: '%s'\n", numeroCelular)
	celularEncriptado, err := EncryptNumeroCelular(numeroCelular)
	if err != nil {
		fmt.Printf("  ❌ ERROR al cifrar celular: %v\n", err)
		return nil, fmt.Errorf("error al cifrar número de celular: %v", err)
	}
	fmt.Printf("  ✅ Celular cifrado:  %s...\n", celularEncriptado[:min(20, len(celularEncriptado))])

	fmt.Println("✅ Todos los datos cifrados exitosamente")

	return &DatosClienteCifrados{
		Correo:          correoEncriptado,
		NumeroDocumento: documentoEncriptado,
		NumeroCelular:   celularEncriptado,
	}, nil
}

// Helper para evitar panic si el string es muy corto
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// DescifrarDatosCliente descifra todos los datos sensibles de un cliente
func DescifrarDatosCliente(correoEncriptado, documentoEncriptado, celularEncriptado string) (*DatosClienteCifrados, error) {
	// Descifrar correo
	correo, err := DecryptCorreo(correoEncriptado)
	if err != nil {
		return nil, fmt.Errorf("error al descifrar correo:  %v", err)
	}

	// Descifrar número de documento
	documento, err := DecryptNumeroDocumento(documentoEncriptado)
	if err != nil {
		return nil, fmt.Errorf("error al descifrar número de documento: %v", err)
	}

	// Descifrar número de celular
	celular, err := DecryptNumeroCelular(celularEncriptado)
	if err != nil {
		return nil, fmt.Errorf("error al descifrar número de celular: %v", err)
	}

	return &DatosClienteCifrados{
		Correo:          correo,
		NumeroDocumento: documento,
		NumeroCelular:   celular,
	}, nil
}
