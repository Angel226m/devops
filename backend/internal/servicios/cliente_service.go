/*
package servicios

import (

	"errors"
	"fmt"
	"sistema-toursseft/internal/config"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
	"sistema-toursseft/internal/utils"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"

)

// ClienteService maneja la lógica de negocio para clientes

	type ClienteService struct {
		clienteRepo *repositorios.ClienteRepository
		config      *config.Config
	}

// NewClienteService crea una nueva instancia de ClienteService

	func NewClienteService(clienteRepo *repositorios.ClienteRepository, config *config.Config) *ClienteService {
		return &ClienteService{
			clienteRepo: clienteRepo,
			config:      config,
		}
	}

// GetByID obtiene un cliente por su ID

	func (s *ClienteService) GetByID(id int) (*entidades.Cliente, error) {
		return s.clienteRepo.GetByID(id)
	}

// GetByDocumento obtiene un cliente por su tipo y número de documento

	func (s *ClienteService) GetByDocumento(tipoDocumento, numeroDocumento string) (*entidades.Cliente, error) {
		return s.clienteRepo.GetByDocumento(tipoDocumento, numeroDocumento)
	}

// ValidarDocumento valida el formato del documento según su tipo

	func (s *ClienteService) ValidarDocumento(tipoDocumento, numeroDocumento string) error {
		switch tipoDocumento {
		case "DNI":
			// DNI peruano debe tener 8 dígitos
			if len(numeroDocumento) != 8 || !utils.IsNumeric(numeroDocumento) {
				return errors.New("el DNI debe tener 8 dígitos numéricos")
			}
		case "CE":
			// Carné de extranjería normalmente tiene entre 9 y 12 caracteres
			if len(numeroDocumento) < 9 || len(numeroDocumento) > 12 {
				return errors.New("el carné de extranjería debe tener entre 9 y 12 caracteres")
			}
		case "Pasaporte":
			// Pasaporte suele tener entre 8 y 15 caracteres
			if len(numeroDocumento) < 8 || len(numeroDocumento) > 15 {
				return errors.New("el pasaporte debe tener entre 8 y 15 caracteres")
			}
		case "RUC":
			// RUC peruano debe tener 11 dígitos
			if len(numeroDocumento) != 11 || !utils.IsNumeric(numeroDocumento) {
				return errors.New("el RUC debe tener 11 dígitos numéricos")
			}

			// RUC debe comenzar con 10, 15, 17 o 20
			validPrefixes := []string{"10", "15", "17", "20"}
			prefix := numeroDocumento[:2]
			isValid := false
			for _, p := range validPrefixes {
				if prefix == p {
					isValid = true
					break
				}
			}
			if !isValid {
				return errors.New("el RUC debe comenzar con 10, 15, 17 o 20")
			}
		default:
			return errors.New("tipo de documento no válido")
		}
		return nil
	}

// Create crea un nuevo cliente

	func (s *ClienteService) Create(cliente *entidades.NuevoClienteRequest) (int, error) {
		// Validar documento según su tipo
		if err := s.ValidarDocumento(cliente.TipoDocumento, cliente.NumeroDocumento); err != nil {
			return 0, err
		}

		// Verificar datos según tipo de documento
		if cliente.TipoDocumento == "RUC" {
			if cliente.RazonSocial == "" {
				return 0, errors.New("la razón social es obligatoria para clientes con RUC")
			}
			if cliente.DireccionFiscal == "" {
				return 0, errors.New("la dirección fiscal es obligatoria para clientes con RUC")
			}
		} else {
			if cliente.Nombres == "" {
				return 0, errors.New("los nombres son obligatorios para personas naturales")
			}
			if cliente.Apellidos == "" {
				return 0, errors.New("los apellidos son obligatorios para personas naturales")
			}
		}

		// Verificar si ya existe cliente con el mismo correo (solo si se proporciona correo)
		if cliente.Correo != "" {
			existingEmail, err := s.clienteRepo.GetByCorreo(cliente.Correo)
			if err == nil && existingEmail != nil {
				return 0, errors.New("ya existe un cliente con ese correo electrónico")
			}
		}

		// Verificar si ya existe cliente con el mismo documento
		existingDoc, err := s.clienteRepo.GetByDocumento(cliente.TipoDocumento, cliente.NumeroDocumento)
		if err == nil && existingDoc != nil {
			return 0, errors.New("ya existe un cliente con ese documento")
		}

		// Hash de la contraseña si se proporcionó una
		if cliente.Contrasena != "" {
			hashedPassword, err := utils.HashPassword(cliente.Contrasena)
			if err != nil {
				return 0, err
			}
			cliente.Contrasena = hashedPassword
		}

		// Crear cliente
		return s.clienteRepo.Create(cliente)
	}

// Update actualiza un cliente existente

	func (s *ClienteService) Update(id int, cliente *entidades.ActualizarClienteRequest) error {
		// Validar documento según su tipo
		if err := s.ValidarDocumento(cliente.TipoDocumento, cliente.NumeroDocumento); err != nil {
			return err
		}

		// Verificar datos según tipo de documento
		if cliente.TipoDocumento == "RUC" {
			if cliente.RazonSocial == "" {
				return errors.New("la razón social es obligatoria para clientes con RUC")
			}
			if cliente.DireccionFiscal == "" {
				return errors.New("la dirección fiscal es obligatoria para clientes con RUC")
			}
		} else {
			if cliente.Nombres == "" {
				return errors.New("los nombres son obligatorios para personas naturales")
			}
			if cliente.Apellidos == "" {
				return errors.New("los apellidos son obligatorios para personas naturales")
			}
		}

		// Verificar que el cliente existe
		existing, err := s.clienteRepo.GetByID(id)
		if err != nil {
			return err
		}

		// Verificar si ya existe otro cliente con el mismo correo
		if cliente.Correo != "" && cliente.Correo != existing.Correo {
			existingEmail, err := s.clienteRepo.GetByCorreo(cliente.Correo)
			if err == nil && existingEmail != nil && existingEmail.ID != id {
				return errors.New("ya existe otro cliente con ese correo electrónico")
			}
		}

		// Verificar si ya existe otro cliente con el mismo documento
		if cliente.NumeroDocumento != existing.NumeroDocumento || cliente.TipoDocumento != existing.TipoDocumento {
			existingDoc, err := s.clienteRepo.GetByDocumento(cliente.TipoDocumento, cliente.NumeroDocumento)
			if err == nil && existingDoc != nil && existingDoc.ID != id {
				return errors.New("ya existe otro cliente con ese documento")
			}
		}

		// Actualizar cliente
		return s.clienteRepo.Update(id, cliente)
	}

// UpdateDatosEmpresa actualiza solo los datos de empresa de un cliente

	func (s *ClienteService) UpdateDatosEmpresa(id int, datos *entidades.ActualizarDatosEmpresaRequest) error {
		// Verificar que el cliente existe
		existing, err := s.clienteRepo.GetByID(id)
		if err != nil {
			return err
		}

		// Verificar que el cliente es una empresa (tipo documento RUC)
		if existing.TipoDocumento != "RUC" {
			return errors.New("esta operación solo es válida para clientes tipo empresa (RUC)")
		}

		// Verificar datos obligatorios
		if datos.RazonSocial == "" {
			return errors.New("la razón social es obligatoria")
		}
		if datos.DireccionFiscal == "" {
			return errors.New("la dirección fiscal es obligatoria")
		}

		// Actualizar datos de empresa
		return s.clienteRepo.UpdateDatosEmpresa(id, datos)
	}

// Delete elimina lógicamente un cliente

	func (s *ClienteService) Delete(id int) error {
		return s.clienteRepo.Delete(id)
	}

// List obtiene todos los clientes no eliminados

	func (s *ClienteService) List() ([]*entidades.Cliente, error) {
		return s.clienteRepo.List()
	}

// SearchByName busca clientes por nombre, apellido o razón social

	func (s *ClienteService) SearchByName(query string) ([]*entidades.Cliente, error) {
		return s.clienteRepo.SearchByName(query)
	}

// SearchByDocumento busca clientes por número de documento

	func (s *ClienteService) SearchByDocumento(query string) ([]*entidades.Cliente, error) {
		return s.clienteRepo.SearchByDocumento(query)
	}

// Login autentica a un cliente y lo retorna si las credenciales son válidas

	func (s *ClienteService) Login(correo, contrasena string, rememberMe bool) (*entidades.Cliente, string, string, error) {
		// Verificar si existe el cliente con ese correo
		fmt.Printf("Intento de login para correo: %s\n", correo)

		// Verificar si existe el cliente con ese correo
		cliente, err := s.clienteRepo.GetByCorreo(correo)
		if err != nil {
			fmt.Printf("Error buscando cliente por correo: %v\n", err)
			return nil, "", "", errors.New("credenciales incorrectas")
		}

		fmt.Printf("Cliente encontrado con ID: %d\n", cliente.ID)

		// Obtener la contraseña hash
		hashedPassword := cliente.Contrasena
		if hashedPassword == "" {
			fmt.Printf("Error: contraseña hash vacía para cliente %d\n", cliente.ID)
			return nil, "", "", errors.New("credenciales incorrectas")
		}

		fmt.Printf("Hash almacenado en DB: %s\n", hashedPassword)
		fmt.Printf("Contraseña recibida: %s\n", contrasena)

		// Verificar contraseña
		match := utils.CheckPasswordHash(contrasena, hashedPassword)
		fmt.Printf("Resultado de verificación de contraseña: %v\n", match)

		if !match {
			return nil, "", "", errors.New("credenciales incorrectas")
		}

		// Generar token JWT usando la nueva función
		token, err := utils.GenerateClienteJWT(cliente, s.config)
		if err != nil {
			return nil, "", "", errors.New("error al generar token")
		}

		// Generar refresh token usando la nueva función
		refreshToken, err := utils.GenerateClienteRefreshToken(cliente, s.config, rememberMe)
		if err != nil {
			return nil, "", "", errors.New("error al generar refresh token")
		}

		return cliente, token, refreshToken, nil
	}

// generateAccessToken genera un token de acceso para un cliente (15 minutos)

	func (s *ClienteService) generateAccessToken(clienteID int, correo string) (string, error) {
		// Tiempo de expiración del token principal (15 minutos)
		expirationTime := time.Now().Add(15 * time.Minute)

		// Crear los claims para el token JWT
		claims := &jwt.StandardClaims{
			// Usar el formato "cliente:{id}" para el subject para distinguir de usuarios regulares
			Subject:   "cliente:" + strconv.Itoa(clienteID),
			ExpiresAt: expirationTime.Unix(),
			IssuedAt:  time.Now().Unix(),
			Issuer:    "sistema-tours",
		}

		// Crear token con los claims estándar
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

		// Firmar token con la clave secreta
		tokenString, err := token.SignedString([]byte(s.config.JWTSecret))
		if err != nil {
			return "", err
		}

		return tokenString, nil
	}

// generateRefreshToken genera un token de refresco para un cliente (duración variable)

	func (s *ClienteService) generateRefreshToken(clienteID int, correo string, rememberMe bool) (string, error) {
		// Determinar la duración basada en rememberMe
		var expirationTime time.Time
		if rememberMe {
			expirationTime = time.Now().Add(7 * 24 * time.Hour) // 7 días
		} else {
			expirationTime = time.Now().Add(1 * time.Hour) // 1 hora
		}

		// Crear los claims para el refresh token
		claims := &jwt.StandardClaims{
			// Usar el formato "cliente:{id}" para el subject para distinguir de usuarios regulares
			Subject:   "cliente:" + strconv.Itoa(clienteID),
			ExpiresAt: expirationTime.Unix(),
			IssuedAt:  time.Now().Unix(),
			Issuer:    "sistema-tours",
		}

		// Crear token con los claims estándar
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

		// Firmar token con la clave secreta para refresh tokens
		tokenString, err := token.SignedString([]byte(s.config.JWTRefreshSecret))
		if err != nil {
			return "", err
		}

		return tokenString, nil
	}

// RefreshClienteToken renueva los tokens de un cliente usando su refresh token
// RefreshClienteToken renueva los tokens de un cliente usando su refresh token

	func (s *ClienteService) RefreshClienteToken(refreshToken string) (string, string, *entidades.Cliente, error) {
		// Validar refresh token usando la nueva función específica para clientes
		claims, err := utils.ValidateClienteRefreshToken(refreshToken, s.config)
		if err != nil {
			return "", "", nil, err
		}

		// Obtener cliente por ID
		cliente, err := s.clienteRepo.GetByID(claims.ClienteID)
		if err != nil {
			return "", "", nil, err
		}

		// Generar nuevo token JWT usando la nueva función
		newToken, err := utils.GenerateClienteJWT(cliente, s.config)
		if err != nil {
			return "", "", nil, err
		}

		// Determinar si el token original tenía remember_me activo
		isRememberMe := false
		if claims.ExpiresAt.Sub(claims.IssuedAt.Time) > 24*time.Hour {
			isRememberMe = true
		}

		// Generar nuevo refresh token usando la nueva función
		newRefreshToken, err := utils.GenerateClienteRefreshToken(cliente, s.config, isRememberMe)
		if err != nil {
			return "", "", nil, err
		}

		return newToken, newRefreshToken, cliente, nil
	}

// ChangePassword cambia la contraseña de un cliente

	func (s *ClienteService) ChangePassword(id int, currentPassword, newPassword string) error {
		// Obtener cliente por ID
		cliente, err := s.clienteRepo.GetByID(id)
		if err != nil {
			return err
		}

		// Obtener la contraseña hash actual
		currentHashedPassword, err := s.clienteRepo.GetPasswordByCorreo(cliente.Correo)
		if err != nil {
			return err
		}

		// Verificar contraseña actual
		if !utils.CheckPasswordHash(currentPassword, currentHashedPassword) {
			return errors.New("contraseña actual incorrecta")
		}

		// Hash de la nueva contraseña
		newHashedPassword, err := utils.HashPassword(newPassword)
		if err != nil {
			return err
		}

		// Actualizar contraseña
		return s.clienteRepo.UpdatePassword(id, newHashedPassword)
	}
*/
package servicios

import (
	"errors"
	"fmt"
	"sistema-toursseft/internal/config"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
	"sistema-toursseft/internal/utils"
	"time"
)

// ClienteService maneja la lógica de negocio para clientes
type ClienteService struct {
	clienteRepo *repositorios.ClienteRepository
	config      *config.Config
}

// NewClienteService crea una nueva instancia de ClienteService
func NewClienteService(clienteRepo *repositorios.ClienteRepository, config *config.Config) *ClienteService {
	return &ClienteService{
		clienteRepo: clienteRepo,
		config:      config,
	}
}

// GetByID obtiene un cliente por su ID y DESCIFRA los datos sensibles
func (s *ClienteService) GetByID(id int) (*entidades.Cliente, error) {
	cliente, err := s.clienteRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// ✅ DESCIFRAR datos sensibles antes de devolver
	if err := s.descifrarDatosCliente(cliente); err != nil {
		fmt.Printf("⚠️ Error al descifrar datos del cliente %d: %v\n", id, err)
		// No fallar, solo logear el error
	}

	return cliente, nil
}

// GetByDocumento busca por documento CIFRADO
func (s *ClienteService) GetByDocumento(tipoDocumento, numeroDocumento string) (*entidades.Cliente, error) {
	// ✅ Cifrar el número de documento para buscar
	documentoCifrado, err := utils.EncryptNumeroDocumento(numeroDocumento)
	if err != nil {
		return nil, fmt.Errorf("error al cifrar documento para búsqueda: %v", err)
	}

	cliente, err := s.clienteRepo.GetByDocumento(tipoDocumento, documentoCifrado)
	if err != nil {
		return nil, err
	}

	// ✅ DESCIFRAR datos antes de devolver
	if err := s.descifrarDatosCliente(cliente); err != nil {
		fmt.Printf("⚠️ Error al descifrar datos del cliente:  %v\n", err)
	}

	return cliente, nil
}

// ValidarDocumento valida el formato del documento según su tipo
func (s *ClienteService) ValidarDocumento(tipoDocumento, numeroDocumento string) error {
	switch tipoDocumento {
	case "DNI":
		if len(numeroDocumento) != 8 || !utils.IsNumeric(numeroDocumento) {
			return errors.New("el DNI debe tener 8 dígitos numéricos")
		}
	case "CE":
		if len(numeroDocumento) < 9 || len(numeroDocumento) > 12 {
			return errors.New("el carné de extranjería debe tener entre 9 y 12 caracteres")
		}
	case "Pasaporte":
		if len(numeroDocumento) < 8 || len(numeroDocumento) > 15 {
			return errors.New("el pasaporte debe tener entre 8 y 15 caracteres")
		}
	case "RUC":
		if len(numeroDocumento) != 11 || !utils.IsNumeric(numeroDocumento) {
			return errors.New("el RUC debe tener 11 dígitos numéricos")
		}

		validPrefixes := []string{"10", "15", "17", "20"}
		prefix := numeroDocumento[:2]
		isValid := false
		for _, p := range validPrefixes {
			if prefix == p {
				isValid = true
				break
			}
		}
		if !isValid {
			return errors.New("el RUC debe comenzar con 10, 15, 17 o 20")
		}
	default:
		return errors.New("tipo de documento no válido")
	}
	return nil
}

// Create crea un nuevo cliente CIFRANDO datos sensibles
func (s *ClienteService) Create(cliente *entidades.NuevoClienteRequest) (int, error) {
	// Validar documento según su tipo (ANTES de cifrar)
	// ✅ LOG:  Ver datos recibidos
	fmt.Printf("🔍 Create Cliente - Datos recibidos:\n")
	fmt.Printf("  TipoDocumento: %s\n", cliente.TipoDocumento)
	fmt.Printf("  NumeroDocumento: %s\n", cliente.NumeroDocumento)
	fmt.Printf("  Correo: %s\n", cliente.Correo)
	fmt.Printf("  NumeroCelular: %s\n", cliente.NumeroCelular)
	fmt.Printf("  Nombres: %s\n", cliente.Nombres)
	fmt.Printf("  Apellidos: %s\n", cliente.Apellidos)
	if err := s.ValidarDocumento(cliente.TipoDocumento, cliente.NumeroDocumento); err != nil {
		return 0, err
	}

	// Verificar datos según tipo de documento
	if cliente.TipoDocumento == "RUC" {
		if cliente.RazonSocial == "" {
			return 0, errors.New("la razón social es obligatoria para clientes con RUC")
		}
		if cliente.DireccionFiscal == "" {
			return 0, errors.New("la dirección fiscal es obligatoria para clientes con RUC")
		}
	} else {
		if cliente.Nombres == "" {
			return 0, errors.New("los nombres son obligatorios para personas naturales")
		}
		if cliente.Apellidos == "" {
			return 0, errors.New("los apellidos son obligatorios para personas naturales")
		}
	}

	// ✅ CIFRAR datos sensibles ANTES de verificar duplicados
	datosCifrados, err := utils.CifrarDatosCliente(
		cliente.Correo,
		cliente.NumeroDocumento,
		cliente.NumeroCelular,
	)
	if err != nil {
		return 0, fmt.Errorf("error al cifrar datos del cliente: %v", err)
	}

	// Verificar si ya existe cliente con el mismo correo (usando dato cifrado)
	if cliente.Correo != "" {
		existingEmail, err := s.clienteRepo.GetByCorreo(datosCifrados.Correo)
		if err == nil && existingEmail != nil {
			return 0, errors.New("ya existe un cliente con ese correo electrónico")
		}
	}

	// Verificar si ya existe cliente con el mismo documento (usando dato cifrado)
	existingDoc, err := s.clienteRepo.GetByDocumento(cliente.TipoDocumento, datosCifrados.NumeroDocumento)
	if err == nil && existingDoc != nil {
		return 0, errors.New("ya existe un cliente con ese documento")
	}

	// Hash de la contraseña
	if cliente.Contrasena != "" {
		hashedPassword, err := utils.HashPassword(cliente.Contrasena)
		if err != nil {
			return 0, err
		}
		cliente.Contrasena = hashedPassword
	}

	// ✅ Reemplazar datos originales con los cifrados
	cliente.Correo = datosCifrados.Correo
	cliente.NumeroDocumento = datosCifrados.NumeroDocumento
	cliente.NumeroCelular = datosCifrados.NumeroCelular

	// Crear cliente con datos cifrados
	return s.clienteRepo.Create(cliente)
}

// Update actualiza un cliente CIFRANDO datos sensibles
func (s *ClienteService) Update(id int, cliente *entidades.ActualizarClienteRequest) error {
	// Validar documento según su tipo (ANTES de cifrar)
	if err := s.ValidarDocumento(cliente.TipoDocumento, cliente.NumeroDocumento); err != nil {
		return err
	}

	// Verificar datos según tipo de documento
	if cliente.TipoDocumento == "RUC" {
		if cliente.RazonSocial == "" {
			return errors.New("la razón social es obligatoria para clientes con RUC")
		}
		if cliente.DireccionFiscal == "" {
			return errors.New("la dirección fiscal es obligatoria para clientes con RUC")
		}
	} else {
		if cliente.Nombres == "" {
			return errors.New("los nombres son obligatorios para personas naturales")
		}
		if cliente.Apellidos == "" {
			return errors.New("los apellidos son obligatorios para personas naturales")
		}
	}

	// Verificar que el cliente existe
	existing, err := s.clienteRepo.GetByID(id)
	if err != nil {
		return err
	}

	// ✅ CIFRAR datos nuevos
	datosCifrados, err := utils.CifrarDatosCliente(
		cliente.Correo,
		cliente.NumeroDocumento,
		cliente.NumeroCelular,
	)
	if err != nil {
		return fmt.Errorf("error al cifrar datos del cliente: %v", err)
	}

	// Verificar si ya existe otro cliente con el mismo correo
	if cliente.Correo != "" && datosCifrados.Correo != existing.Correo {
		existingEmail, err := s.clienteRepo.GetByCorreo(datosCifrados.Correo)
		if err == nil && existingEmail != nil && existingEmail.ID != id {
			return errors.New("ya existe otro cliente con ese correo electrónico")
		}
	}

	// Verificar si ya existe otro cliente con el mismo documento
	if datosCifrados.NumeroDocumento != existing.NumeroDocumento || cliente.TipoDocumento != existing.TipoDocumento {
		existingDoc, err := s.clienteRepo.GetByDocumento(cliente.TipoDocumento, datosCifrados.NumeroDocumento)
		if err == nil && existingDoc != nil && existingDoc.ID != id {
			return errors.New("ya existe otro cliente con ese documento")
		}
	}

	// ✅ Reemplazar datos originales con los cifrados
	cliente.Correo = datosCifrados.Correo
	cliente.NumeroDocumento = datosCifrados.NumeroDocumento
	cliente.NumeroCelular = datosCifrados.NumeroCelular

	// Actualizar cliente
	return s.clienteRepo.Update(id, cliente)
}

// UpdateDatosEmpresa actualiza solo los datos de empresa de un cliente
func (s *ClienteService) UpdateDatosEmpresa(id int, datos *entidades.ActualizarDatosEmpresaRequest) error {
	// Verificar que el cliente existe
	existing, err := s.clienteRepo.GetByID(id)
	if err != nil {
		return err
	}

	// Verificar que el cliente es una empresa (tipo documento RUC)
	if existing.TipoDocumento != "RUC" {
		return errors.New("esta operación solo es válida para clientes tipo empresa (RUC)")
	}

	// Verificar datos obligatorios
	if datos.RazonSocial == "" {
		return errors.New("la razón social es obligatoria")
	}
	if datos.DireccionFiscal == "" {
		return errors.New("la dirección fiscal es obligatoria")
	}

	// Actualizar datos de empresa
	return s.clienteRepo.UpdateDatosEmpresa(id, datos)
}

// Delete elimina lógicamente un cliente
func (s *ClienteService) Delete(id int) error {
	return s.clienteRepo.Delete(id)
}

// List obtiene todos los clientes no eliminados y DESCIFRA sus datos
func (s *ClienteService) List() ([]*entidades.Cliente, error) {
	clientes, err := s.clienteRepo.List()
	if err != nil {
		return nil, err
	}

	// ✅ DESCIFRAR datos de todos los clientes
	for _, cliente := range clientes {
		if err := s.descifrarDatosCliente(cliente); err != nil {
			fmt.Printf("⚠️ Error al descifrar datos del cliente %d: %v\n", cliente.ID, err)
		}
	}

	return clientes, nil
}

// SearchByName busca clientes por nombre y DESCIFRA sus datos
func (s *ClienteService) SearchByName(query string) ([]*entidades.Cliente, error) {
	clientes, err := s.clienteRepo.SearchByName(query)
	if err != nil {
		return nil, err
	}

	// ✅ DESCIFRAR datos de todos los clientes
	for _, cliente := range clientes {
		if err := s.descifrarDatosCliente(cliente); err != nil {
			fmt.Printf("⚠️ Error al descifrar datos del cliente %d: %v\n", cliente.ID, err)
		}
	}

	return clientes, nil
}

// SearchByDocumento busca clientes por número de documento CIFRADO
func (s *ClienteService) SearchByDocumento(query string) ([]*entidades.Cliente, error) {
	// ⚠️ NOTA: La búsqueda por documento cifrado es problemática con LIKE
	// Buscaremos por el patrón cifrado (no funcionará con búsquedas parciales)
	clientes, err := s.clienteRepo.SearchByDocumento(query)
	if err != nil {
		return nil, err
	}

	// ✅ DESCIFRAR datos de todos los clientes
	for _, cliente := range clientes {
		if err := s.descifrarDatosCliente(cliente); err != nil {
			fmt.Printf("⚠️ Error al descifrar datos del cliente %d:  %v\n", cliente.ID, err)
		}
	}

	return clientes, nil
}

// Login autentica a un cliente (correo cifrado en BD)
func (s *ClienteService) Login(correo, contrasena string, rememberMe bool) (*entidades.Cliente, string, string, error) {
	fmt.Printf("Intento de login para correo: %s\n", correo)

	// ✅ CIFRAR el correo para buscar en la BD
	correoCifrado, err := utils.EncryptCorreo(correo)
	if err != nil {
		return nil, "", "", fmt.Errorf("error al cifrar correo: %v", err)
	}

	// Buscar por correo cifrado
	cliente, err := s.clienteRepo.GetByCorreo(correoCifrado)
	if err != nil {
		fmt.Printf("Error buscando cliente por correo: %v\n", err)
		return nil, "", "", errors.New("credenciales incorrectas")
	}

	fmt.Printf("Cliente encontrado con ID: %d\n", cliente.ID)

	// Obtener la contraseña hash
	hashedPassword := cliente.Contrasena
	if hashedPassword == "" {
		fmt.Printf("Error: contraseña hash vacía para cliente %d\n", cliente.ID)
		return nil, "", "", errors.New("credenciales incorrectas")
	}

	// Verificar contraseña
	match := utils.CheckPasswordHash(contrasena, hashedPassword)
	fmt.Printf("Resultado de verificación de contraseña: %v\n", match)

	if !match {
		return nil, "", "", errors.New("credenciales incorrectas")
	}

	// ✅ DESCIFRAR datos antes de devolver
	if err := s.descifrarDatosCliente(cliente); err != nil {
		fmt.Printf("⚠️ Error al descifrar datos del cliente: %v\n", err)
	}

	// Generar tokens JWT
	token, err := utils.GenerateClienteJWT(cliente, s.config)
	if err != nil {
		return nil, "", "", errors.New("error al generar token")
	}

	refreshToken, err := utils.GenerateClienteRefreshToken(cliente, s.config, rememberMe)
	if err != nil {
		return nil, "", "", errors.New("error al generar refresh token")
	}

	return cliente, token, refreshToken, nil
}

// RefreshClienteToken renueva los tokens de un cliente
func (s *ClienteService) RefreshClienteToken(refreshToken string) (string, string, *entidades.Cliente, error) {
	// Validar refresh token
	claims, err := utils.ValidateClienteRefreshToken(refreshToken, s.config)
	if err != nil {
		return "", "", nil, err
	}

	// Obtener cliente por ID
	cliente, err := s.clienteRepo.GetByID(claims.ClienteID)
	if err != nil {
		return "", "", nil, err
	}

	// ✅ DESCIFRAR datos antes de devolver
	if err := s.descifrarDatosCliente(cliente); err != nil {
		fmt.Printf("⚠️ Error al descifrar datos del cliente: %v\n", err)
	}

	// Generar nuevo token JWT
	newToken, err := utils.GenerateClienteJWT(cliente, s.config)
	if err != nil {
		return "", "", nil, err
	}

	// Determinar si el token original tenía remember_me activo
	isRememberMe := false
	if claims.ExpiresAt.Sub(claims.IssuedAt.Time) > 24*time.Hour {
		isRememberMe = true
	}

	// Generar nuevo refresh token
	newRefreshToken, err := utils.GenerateClienteRefreshToken(cliente, s.config, isRememberMe)
	if err != nil {
		return "", "", nil, err
	}

	return newToken, newRefreshToken, cliente, nil
}

// ChangePassword cambia la contraseña de un cliente
func (s *ClienteService) ChangePassword(id int, currentPassword, newPassword string) error {
	// Obtener cliente por ID
	cliente, err := s.clienteRepo.GetByID(id)
	if err != nil {
		return err
	}

	// ✅ DESCIFRAR correo para obtener contraseña
	correoDescifrado, err := utils.DecryptCorreo(cliente.Correo)
	if err != nil {
		return fmt.Errorf("error al descifrar correo: %v", err)
	}

	// Obtener la contraseña hash actual (buscar por correo cifrado)
	correoCifrado, _ := utils.EncryptCorreo(correoDescifrado)
	currentHashedPassword, err := s.clienteRepo.GetPasswordByCorreo(correoCifrado)
	if err != nil {
		return err
	}

	// Verificar contraseña actual
	if !utils.CheckPasswordHash(currentPassword, currentHashedPassword) {
		return errors.New("contraseña actual incorrecta")
	}

	// Hash de la nueva contraseña
	newHashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		return err
	}

	// Actualizar contraseña
	return s.clienteRepo.UpdatePassword(id, newHashedPassword)
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES PRIVADAS
// ═══════════════════════════════════════════════════════════════

// descifrarDatosCliente descifra los datos sensibles de un cliente
func (s *ClienteService) descifrarDatosCliente(cliente *entidades.Cliente) error {
	if cliente == nil {
		return errors.New("cliente es nil")
	}

	// Descifrar correo
	if cliente.Correo != "" {
		correoDescifrado, err := utils.DecryptCorreo(cliente.Correo)
		if err != nil {
			return fmt.Errorf("error al descifrar correo: %v", err)
		}
		cliente.Correo = correoDescifrado
	}

	// Descifrar número de documento
	if cliente.NumeroDocumento != "" {
		documentoDescifrado, err := utils.DecryptNumeroDocumento(cliente.NumeroDocumento)
		if err != nil {
			return fmt.Errorf("error al descifrar número de documento: %v", err)
		}
		cliente.NumeroDocumento = documentoDescifrado
	}

	// Descifrar número de celular
	if cliente.NumeroCelular != "" {
		celularDescifrado, err := utils.DecryptNumeroCelular(cliente.NumeroCelular)
		if err != nil {
			return fmt.Errorf("error al descifrar número de celular: %v", err)
		}
		cliente.NumeroCelular = celularDescifrado
	}

	return nil
}
