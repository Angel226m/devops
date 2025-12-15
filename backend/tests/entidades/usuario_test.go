package entidades_test

import (
	"encoding/json"
	"testing"
	"time"

	"sistema-toursseft/internal/entidades"
)

// Helper para crear puntero a int
func ptrInt(i int) *int {
	return &i
}

func TestUsuario_JSONMarshalling(t *testing.T) {
	fechaNac := time.Date(1990, 1, 1, 0, 0, 0, 0, time.UTC)
	fechaReg := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)

	usuario := entidades.Usuario{
		ID:              1,
		IdSede:          ptrInt(10),
		Nombres:         "Juan Carlos",
		Apellidos:       "Pérez Gómez",
		Correo:          "juan@example.com",
		Telefono:        "987654321",
		Direccion:       "Av. Siempre Viva 123",
		FechaNacimiento: fechaNac,
		Rol:             "ADMIN",
		Nacionalidad:    "Peruana",
		TipoDocumento:   "DNI",
		NumeroDocumento: "12345678",
		FechaRegistro:   fechaReg,
		Contrasena:      "hashsecreto", // Debe ignorarse por json:"-"
		Eliminado:       false,
		Idiomas:         []*entidades.UsuarioIdioma{}, // vacío → omitempty
	}

	// Marshal a JSON
	data, err := json.Marshal(usuario)
	if err != nil {
		t.Fatalf("Error al marshal Usuario a JSON: %v", err)
	}

	// Convertimos a map para comparar fácilmente (ignora orden de campos)
	var actual map[string]interface{}
	if err := json.Unmarshal(data, &actual); err != nil {
		t.Fatalf("Error unmarshal actual: %v", err)
	}

	// Campos esperados
	expectedFields := map[string]interface{}{
		"id_usuario":       float64(1), // JSON numbers son float64
		"id_sede":          float64(10),
		"nombres":          "Juan Carlos",
		"apellidos":        "Pérez Gómez",
		"correo":           "juan@example.com",
		"telefono":         "987654321",
		"direccion":        "Av. Siempre Viva 123",
		"fecha_nacimiento": "1990-01-01T00:00:00Z",
		"rol":              "ADMIN",
		"nacionalidad":     "Peruana",
		"tipo_documento":   "DNI",
		"numero_documento": "12345678",
		"fecha_registro":   "2025-01-01T00:00:00Z",
		"eliminado":        false,
		// "idiomas" no debe aparecer porque está vacío (omitempty)
	}

	for key, expectedVal := range expectedFields {
		if val, ok := actual[key]; !ok {
			t.Errorf("Falta campo en JSON: %s", key)
		} else if val != expectedVal {
			t.Errorf("Campo %s: esperado %v, obtenido %v", key, expectedVal, val)
		}
	}

	// Campos que NO deben aparecer
	forbidden := []string{"contrasena", "Contrasena", "idiomas"}
	for _, field := range forbidden {
		if _, ok := actual[field]; ok {
			t.Errorf("El campo %s NO debe aparecer en el JSON", field)
		}
	}
}

func TestUsuario_Idiomas_OmitEmpty(t *testing.T) {
	casos := []struct {
		name     string
		idiomas  []*entidades.UsuarioIdioma
		debeOmit bool
	}{
		{"Nil", nil, true},
		{"Slice vacío", []*entidades.UsuarioIdioma{}, true},
		{"Con elementos", []*entidades.UsuarioIdioma{{}}, false},
	}

	for _, c := range casos {
		t.Run(c.name, func(t *testing.T) {
			u := entidades.Usuario{ID: 1, Idiomas: c.idiomas}
			data, _ := json.Marshal(u)
			var m map[string]interface{}
			json.Unmarshal(data, &m)
			_, has := m["idiomas"]
			if c.debeOmit && has {
				t.Error("idiomas debería omitirse cuando es nil o vacío")
			}
			if !c.debeOmit && !has {
				t.Error("idiomas debería aparecer cuando tiene elementos")
			}
		})
	}
}
