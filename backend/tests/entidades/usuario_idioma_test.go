package entidades_test

import (
	"sistema-toursseft/internal/entidades"
	"testing"
)

func TestUsuarioIdioma(t *testing.T) {
	// Crear idioma
	idioma := &entidades.Idioma{
		ID:        1,
		Nombre:    "Inglés",
		Eliminado: false,
	}

	// Crear relación usuario-idioma
	usuarioIdioma := entidades.UsuarioIdioma{
		ID:        1,
		IDUsuario: 2,
		IDIdioma:  1,
		Nivel:     "AVANZADO",
		Eliminado: false,
		Idioma:    idioma,
	}

	// Verificar campos
	if usuarioIdioma.ID != 1 {
		t.Errorf("Se esperaba ID 1, pero se obtuvo %d", usuarioIdioma.ID)
	}

	if usuarioIdioma.IDUsuario != 2 {
		t.Errorf("Se esperaba IDUsuario 2, pero se obtuvo %d", usuarioIdioma.IDUsuario)
	}

	if usuarioIdioma.IDIdioma != 1 {
		t.Errorf("Se esperaba IDIdioma 1, pero se obtuvo %d", usuarioIdioma.IDIdioma)
	}

	if usuarioIdioma.Nivel != "AVANZADO" {
		t.Errorf("Se esperaba nivel AVANZADO, pero se obtuvo %s", usuarioIdioma.Nivel)
	}

	// Verificar información del idioma
	if usuarioIdioma.Idioma == nil {
		t.Error("Se esperaba que el idioma no fuera nil")
	} else {
		if usuarioIdioma.Idioma.Nombre != "Inglés" {
			t.Errorf("Se esperaba idioma Inglés, pero se obtuvo %s", usuarioIdioma.Idioma.Nombre)
		}

	}
}
