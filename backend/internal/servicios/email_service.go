/*
package servicios

import (

	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/resend/resend-go/v2"

)

// EmailService maneja el envío de correos electrónicos

	type EmailService struct {
		client               *resend.Client
		fromEmail            string
		fromName             string
		replyToEmail         string
		clienteAppURL        string
		administrativoAppURL string
	}

// NewEmailService crea una nueva instancia del servicio de correo

	func NewEmailService() (*EmailService, error) {
		apiKey := os.Getenv("RESEND_API_KEY")
		if apiKey == "" {
			apiKey = "re_Ddxs19PD_9KD6K4yPpZa84yzYqCRVmmZH" // Valor por defecto (solo para desarrollo)
		}

		// IMPORTANTE: Usar siempre un correo del dominio verificado
		fromEmail := os.Getenv("EMAIL_FROM_ADDRESS")
		if fromEmail == "" {
			fromEmail = "no-reply@correo.angelproyect.com" // Correo con dominio verificado
		}

		// Opcional: Configurar el correo de respuesta (puede ser gmail u otro)
		replyToEmail := os.Getenv("EMAIL_REPLY_TO")
		if replyToEmail == "" {
			replyToEmail = "oceantours.pisco@gmail.com" // Email para recibir respuestas
		}

		fromName := os.Getenv("EMAIL_FROM_NAME")
		if fromName == "" {
			fromName = "Ocean Tours" // Nombre de remitente
		}

		clienteAppURL := os.Getenv("CLIENTE_APP_URL")
		if clienteAppURL == "" {
			clienteAppURL = "https://reservas.angelproyect.com" // URL para clientes
		}

		administrativoAppURL := os.Getenv("ADMIN_APP_URL")
		if administrativoAppURL == "" {
			administrativoAppURL = "https://admin.angelproyect.com" // URL para administradores
		}

		client := resend.NewClient(apiKey)

		log.Printf("EmailService inicializado con: remitente=%s, reply-to=%s, cliente URL=%s, admin URL=%s",
			fromEmail, replyToEmail, clienteAppURL, administrativoAppURL)

		return &EmailService{
			client:               client,
			fromEmail:            fromEmail,
			fromName:             fromName,
			replyToEmail:         replyToEmail,
			clienteAppURL:        clienteAppURL,
			administrativoAppURL: administrativoAppURL,
		}, nil
	}

// EnviarCorreoRecuperacionContrasena envía un correo para recuperar contraseña

	func (s *EmailService) EnviarCorreoRecuperacionContrasena(email, token, nombreDestinatario string, tipoEntidad string) error {
		// Determinar la URL de recuperación según el tipo de entidad
		var resetURL string
		if tipoEntidad == "USUARIO" {
			resetURL = fmt.Sprintf("%s/cambiar-contrasena", s.administrativoAppURL)
		} else {
			resetURL = fmt.Sprintf("%s/cambiar-contrasena", s.clienteAppURL)
		}

		resetLink := fmt.Sprintf("%s?token=%s", resetURL, token)
		log.Printf("Generando enlace de recuperación: %s", resetLink)

		// Preparar el remitente con formato "Nombre <email>"
		from := fmt.Sprintf("%s <%s>", s.fromName, s.fromEmail)

		// Construir el asunto
		subject := "Recuperación de contraseña - Angel Ocean Tours"

		// Construir el cuerpo HTML
		htmlBody := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<title>Recuperación de contraseña</title>
			<style>
				body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
				.container { max-width: 600px; margin: 0 auto; padding: 20px; }
				.header { background-color: #007bff; padding: 20px; text-align: center; color: white; }
				.content { padding: 20px; background-color: #f9f9f9; }
				.btn { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; }
				.footer { margin-top: 30px; font-size: 12px; color: #777; text-align: center; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<h1>Recuperación de contraseña</h1>
				</div>
				<div class="content">
					<h2>Hola %s,</h2>
					<p>Hemos recibido una solicitud para restablecer tu contraseña. Si no realizaste esta solicitud, puedes ignorar este correo.</p>
					<p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
					<p style="text-align: center;">
						<a href="%s" class="btn" style="color: white;">Restablecer contraseña</a>
					</p>
					<p>O copia y pega el siguiente enlace en tu navegador:</p>
					<p>%s</p>
					<p>Este enlace expirará en 1 hora por motivos de seguridad.</p>
				</div>
				<div class="footer">
					<p>Este es un correo automático, por favor no respondas a este mensaje.</p>
					<p>Fecha y hora: %s</p>
					<p>&copy; %d Angel Ocean Tours</p>
				</div>
			</div>
		</body>
		</html>
		`, nombreDestinatario, resetLink, resetLink, time.Now().Format("2006-01-02 15:04:05"), time.Now().Year())

		// Configurar los parámetros del correo con ReplyTo
		params := &resend.SendEmailRequest{
			From:    from,
			To:      []string{email},
			ReplyTo: s.replyToEmail, // Agregar Reply-To para respuestas
			Subject: subject,
			Html:    htmlBody,
		}

		log.Printf("Enviando correo de recuperación a: %s, desde: %s, reply-to: %s",
			email, from, s.replyToEmail)

		// Enviar el correo
		response, err := s.client.Emails.Send(params)
		if err != nil {
			log.Printf("Error al enviar correo: %v", err)
			return fmt.Errorf("error al enviar correo: %w", err)
		}

		// Verificar la respuesta
		if response.Id == "" {
			log.Printf("Error: No se recibió ID en la respuesta")
			return errors.New("no se recibió ID de correo en la respuesta")
		}

		log.Printf("Correo enviado exitosamente, ID: %s", response.Id)
		return nil
	}
*/
package servicios

import (
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/resend/resend-go/v2"
)

// EmailService maneja el envío de correos electrónicos
type EmailService struct {
	client               *resend.Client
	fromEmail            string
	fromName             string
	replyToEmail         string
	clienteAppURL        string
	administrativoAppURL string
}

// NewEmailService crea una nueva instancia del servicio de correo
func NewEmailService() (*EmailService, error) {
	apiKey := os.Getenv("RESEND_API_KEY")
	if apiKey == "" {
		apiKey = "re_Ddxs19PD_9KD6K4yPpZa84yzYqCRVmmZH" // Valor por defecto (solo para desarrollo)
	}

	fromEmail := os.Getenv("EMAIL_FROM_ADDRESS")
	if fromEmail == "" {
		fromEmail = "no-reply@correo.angelproyect.com" // Correo con dominio verificado
	}

	replyToEmail := os.Getenv("EMAIL_REPLY_TO")
	if replyToEmail == "" {
		replyToEmail = "oceantours.pisco@gmail.com" // Email para recibir respuestas
	}

	fromName := os.Getenv("EMAIL_FROM_NAME")
	if fromName == "" {
		fromName = "Ocean Tours" // Nombre de remitente
	}

	clienteAppURL := os.Getenv("CLIENTE_APP_URL")
	if clienteAppURL == "" {
		clienteAppURL = "https://reservas.angelproyect.com" // URL para clientes
	}

	administrativoAppURL := os.Getenv("ADMIN_APP_URL")
	if administrativoAppURL == "" {
		administrativoAppURL = "https://admin.angelproyect.com" // URL para administradores
	}

	client := resend.NewClient(apiKey)

	log.Printf("EmailService inicializado con: remitente=%s, reply-to=%s, cliente URL=%s, admin URL=%s",
		fromEmail, replyToEmail, clienteAppURL, administrativoAppURL)

	return &EmailService{
		client:               client,
		fromEmail:            fromEmail,
		fromName:             fromName,
		replyToEmail:         replyToEmail,
		clienteAppURL:        clienteAppURL,
		administrativoAppURL: administrativoAppURL,
	}, nil
}

// EnviarCorreoRecuperacionContrasena envía un correo para recuperar contraseña
func (s *EmailService) EnviarCorreoRecuperacionContrasena(email, token, nombreDestinatario string, tipoEntidad string) error {
	// Determinar la URL de recuperación según el tipo de entidad
	var resetURL string
	if tipoEntidad == "USUARIO" {
		resetURL = fmt.Sprintf("%s/cambiar-contrasena", s.administrativoAppURL)
	} else {
		resetURL = fmt.Sprintf("%s/cambiar-contrasena", s.clienteAppURL)
	}

	resetLink := fmt.Sprintf("%s?token=%s", resetURL, token)
	from := fmt.Sprintf("%s <%s>", s.fromName, s.fromEmail)
	subject := "Recuperación de contraseña - Angel Ocean Tours"

	// Construir el cuerpo HTML con logo y fondo degradado océano
	htmlBody := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Recuperación de contraseña</title>
</head>
<body style="margin:0; padding:0; background: linear-gradient(to bottom, #eff6ff, #e0f2fe, #cffafe); font-family: Arial, sans-serif; color: #333;">
	<table width=\"100%%\" cellpadding="0" cellspacing="0" border="0">
		<tr>
			<td align="center">
				<table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden; margin:20px 0;">
					<tr>
						<td style="padding:20px; background: linear-gradient(to bottom, #007bff, #00c6ff); text-align:center;">
							<!-- Logo -->
							<div style="display:inline-block; vertical-align:middle;">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff" width="48" height="48" style="vertical-align:middle;">
									<path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
								</svg>
							</div>
							<div style="display:inline-block; vertical-align:middle; margin-left:10px;">
								<h1 style="color:#ffffff; margin:0; font-size:24px;">Angel Ocean Tours</h1>
								<p style="color:#e0f7fa; font-size:14px; margin:4px 0 0;">Pisco, Perú</p>
							</div>
						</td>
					</tr>
					<tr>
						<td style="padding:30px;">
							<h2 style="margin-top:0;">Hola %s,</h2>
							<p>Hemos recibido una solicitud para restablecer tu contraseña. Si no realizaste esta solicitud, puedes ignorar este correo.</p>
							<p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
							<p style="text-align:center; margin:20px 0;">
								<a href="%s" style="display:inline-block; padding:12px 24px; background:#007bff; color:#ffffff; text-decoration:none; border-radius:4px;">Restablecer contraseña</a>
							</p>
							<p>O copia y pega el siguiente enlace en tu navegador:</p>
							<p style="word-break:break-all;">%s</p>
							<p style="font-size:12px; color:#777;">Este enlace expirará en 1 hora por motivos de seguridad.</p>
						</td>
					</tr>
					<tr>
						<td style="padding:20px; text-align:center; font-size:12px; color:#777; background:#f0f4f8;">
							<p>Este es un correo automático, por favor no respondas a este mensaje.</p>
							<p>Fecha y hora: %s</p>
							<p>&copy; %d Angel Ocean Tours</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>
`, nombreDestinatario, resetLink, resetLink, time.Now().Format("2006-01-02 15:04:05"), time.Now().Year())

	params := &resend.SendEmailRequest{
		From:    from,
		To:      []string{email},
		ReplyTo: s.replyToEmail,
		Subject: subject,
		Html:    htmlBody,
	}

	response, err := s.client.Emails.Send(params)
	if err != nil {
		log.Printf("Error al enviar correo: %v", err)
		return fmt.Errorf("error al enviar correo: %w", err)
	}

	if response.Id == "" {
		log.Printf("Error: No se recibió ID en la respuesta")
		return errors.New("no se recibió ID de correo en la respuesta")
	}

	log.Printf("Correo enviado exitosamente, ID: %s", response.Id)
	return nil
}
