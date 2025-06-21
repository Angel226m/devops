package servicios

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
	"sistema-toursseft/internal/utils"
	"time"
)

// RecuperacionContrasenaService maneja la lógica de recuperación de contraseña
type RecuperacionContrasenaService struct {
	usuarioRepo      *repositorios.UsuarioRepository
	clienteRepo      *repositorios.ClienteRepository
	recuperacionRepo *repositorios.RecuperacionContrasenaRepository
	emailService     *EmailService
}

// NewRecuperacionContrasenaService crea una nueva instancia del servicio
func NewRecuperacionContrasenaService(
	usuarioRepo *repositorios.UsuarioRepository,
	clienteRepo *repositorios.ClienteRepository,
	recuperacionRepo *repositorios.RecuperacionContrasenaRepository,
	emailService *EmailService,
) *RecuperacionContrasenaService {
	return &RecuperacionContrasenaService{
		usuarioRepo:      usuarioRepo,
		clienteRepo:      clienteRepo,
		recuperacionRepo: recuperacionRepo,
		emailService:     emailService,
	}
}

// SolicitarRecuperacion inicia el proceso de recuperación de contraseña
func (s *RecuperacionContrasenaService) SolicitarRecuperacion(solicitud *entidades.SolicitudRecuperacion) error {
	var entidadID int
	var nombreDestinatario string
	var entidadEncontrada bool

	log.Printf("Procesando solicitud de recuperación para correo: %s, tipo: %s",
		solicitud.Correo, solicitud.TipoEntidad)

	// Buscar la entidad por correo según su tipo
	if solicitud.TipoEntidad == entidades.EntidadUsuario {
		usuario, err := s.usuarioRepo.GetByEmail(solicitud.Correo)
		if err == nil {
			entidadID = usuario.ID
			nombreDestinatario = fmt.Sprintf("%s %s", usuario.Nombres, usuario.Apellidos)
			entidadEncontrada = true
			log.Printf("Usuario encontrado con ID: %d, nombre: %s", entidadID, nombreDestinatario)
		} else {
			log.Printf("Usuario no encontrado: %v", err)
		}
	} else if solicitud.TipoEntidad == entidades.EntidadCliente {
		cliente, err := s.clienteRepo.GetByCorreo(solicitud.Correo)
		if err == nil {
			entidadID = cliente.ID
			if cliente.TipoDocumento == "RUC" {
				nombreDestinatario = cliente.RazonSocial
			} else {
				nombreDestinatario = fmt.Sprintf("%s %s", cliente.Nombres, cliente.Apellidos)
			}
			entidadEncontrada = true
			log.Printf("Cliente encontrado con ID: %d, nombre: %s", entidadID, nombreDestinatario)
		} else {
			log.Printf("Cliente no encontrado: %v", err)
		}
	} else {
		return errors.New("tipo de entidad inválido")
	}

	// Si no se encontró la entidad, simplemente retornar éxito (por seguridad no revelar si existe)
	if !entidadEncontrada {
		log.Printf("Entidad no encontrada para correo: %s, tipo: %s",
			solicitud.Correo, solicitud.TipoEntidad)
		return nil
	}

	// Invalidar tokens anteriores para esta entidad
	err := s.recuperacionRepo.InvalidateOldTokens(entidadID, solicitud.TipoEntidad)
	if err != nil {
		log.Printf("Error al invalidar tokens antiguos: %v", err)
		return errors.New("error al procesar la solicitud")
	}

	// Generar token aleatorio
	token, err := generarTokenAleatorio(32)
	if err != nil {
		log.Printf("Error al generar token: %v", err)
		return errors.New("error al generar token")
	}

	// Crear registro de recuperación
	recuperacion := &entidades.RecuperacionContrasena{
		EntidadID:   entidadID,
		TipoEntidad: solicitud.TipoEntidad,
		Token:       token,
		Expiracion:  time.Now().Add(1 * time.Hour), // Token válido por 1 hora
		Utilizado:   false,
		CreadoEn:    time.Now(),
	}

	// Guardar el token en la base de datos
	err = s.recuperacionRepo.Create(recuperacion)
	if err != nil {
		log.Printf("Error al guardar token: %v", err)
		return errors.New("error al guardar token de recuperación")
	}

	log.Printf("Token generado exitosamente para ID: %d, tipo: %s",
		entidadID, solicitud.TipoEntidad)

	// Enviar correo con el token
	err = s.emailService.EnviarCorreoRecuperacionContrasena(
		solicitud.Correo,
		token,
		nombreDestinatario,
		string(solicitud.TipoEntidad),
	)
	if err != nil {
		log.Printf("Error al enviar correo: %v", err)
		return errors.New("error al enviar correo de recuperación")
	}

	log.Printf("Proceso de recuperación completado exitosamente para ID: %d, tipo: %s",
		entidadID, solicitud.TipoEntidad)
	return nil
}

// ValidarToken verifica si un token es válido
func (s *RecuperacionContrasenaService) ValidarToken(token string) (*entidades.RecuperacionContrasena, error) {
	log.Printf("Validando token: %s...", token[:10]) // Solo mostrar los primeros caracteres por seguridad

	// Obtener el token desde la base de datos
	recuperacion, err := s.recuperacionRepo.GetByToken(token)
	if err != nil {
		log.Printf("Error al buscar token: %v", err)
		return nil, errors.New("token inválido o expirado")
	}

	// Verificar si el token ya fue utilizado
	if recuperacion.Utilizado {
		log.Printf("Token ya utilizado: %s...", token[:10])
		return nil, errors.New("este token ya ha sido utilizado")
	}

	// Verificar si el token ha expirado
	if time.Now().After(recuperacion.Expiracion) {
		log.Printf("Token expirado: %s...", token[:10])
		return nil, errors.New("el token ha expirado")
	}

	log.Printf("Token validado exitosamente para ID: %d, tipo: %s",
		recuperacion.EntidadID, recuperacion.TipoEntidad)
	return recuperacion, nil
}

// CambiarContrasena cambia la contraseña utilizando un token de recuperación
func (s *RecuperacionContrasenaService) CambiarContrasena(cambio *entidades.ReseteoContrasena) error {
	log.Printf("Procesando cambio de contraseña con token: %s...", cambio.Token[:10])

	// Validar el token
	recuperacion, err := s.ValidarToken(cambio.Token)
	if err != nil {
		return err
	}

	// Encriptar la nueva contraseña
	hashedPassword, err := utils.HashPassword(cambio.NuevaContrasena)
	if err != nil {
		log.Printf("Error al hashear contraseña: %v", err)
		return errors.New("error al procesar la contraseña")
	}

	// Actualizar la contraseña según el tipo de entidad
	if recuperacion.TipoEntidad == entidades.EntidadUsuario {
		err = s.usuarioRepo.UpdatePassword(recuperacion.EntidadID, hashedPassword)
		log.Printf("Actualizando contraseña para usuario ID: %d", recuperacion.EntidadID)
	} else if recuperacion.TipoEntidad == entidades.EntidadCliente {
		err = s.clienteRepo.UpdatePassword(recuperacion.EntidadID, hashedPassword)
		log.Printf("Actualizando contraseña para cliente ID: %d", recuperacion.EntidadID)
	} else {
		return errors.New("tipo de entidad inválido")
	}

	if err != nil {
		log.Printf("Error al actualizar contraseña: %v", err)
		return errors.New("error al actualizar la contraseña")
	}

	// Marcar el token como utilizado
	err = s.recuperacionRepo.MarkAsUsed(recuperacion.ID)
	if err != nil {
		log.Printf("Error al marcar token como utilizado (no crítico): %v", err)
		// No devolver error al cliente, ya que la contraseña ya se actualizó correctamente
	}

	log.Printf("Contraseña actualizada exitosamente para ID: %d, tipo: %s",
		recuperacion.EntidadID, recuperacion.TipoEntidad)
	return nil
}

// generarTokenAleatorio genera un token aleatorio hexadecimal
func generarTokenAleatorio(length int) (string, error) {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
