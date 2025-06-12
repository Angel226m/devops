package utils

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
