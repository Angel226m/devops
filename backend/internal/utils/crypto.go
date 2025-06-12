/*package utils

import (

	"golang.org/x/crypto/bcrypt"
)

// HashPassword genera un hash de la contraseña
func HashPassword(password string) (string, error) {
	// Usar un costo de 14 para mayor seguridad
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

// CheckPasswordHash verifica si la contraseña coincide con el hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
*/

package utils

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
	"strings"
)

// HashPassword genera un hash de la contraseña
func HashPassword(password string) (string, error) {
	// Usar un costo de 14 para mayor seguridad
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

// CheckPasswordHash verifica si la contraseña coincide con el hash
func CheckPasswordHash(password, hash string) bool {
	// Añadir protección contra entradas incorrectas
	if password == "" || hash == "" {
		fmt.Println("ERROR: Contraseña o hash vacío")
		return false
	}

	// Verificar que el hash tiene el formato correcto para bcrypt
	if !strings.HasPrefix(hash, "$2a$") && !strings.HasPrefix(hash, "$2b$") && !strings.HasPrefix(hash, "$2y$") {
		fmt.Printf("ERROR: El hash no tiene formato bcrypt: %s\n", hash)
		return false
	}

	// Usar recover para manejar posibles panics
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("PANIC recuperado en CheckPasswordHash: %v\n", r)
		}
	}()

	// Intentar comparar con manejo de errores
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		fmt.Printf("Comparación bcrypt falló: %v\n", err)
		return false
	}

	return true
}
