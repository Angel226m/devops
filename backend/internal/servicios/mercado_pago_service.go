/*
package servicios

import (

	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"sistema-toursseft/internal/entidades"
	"strconv"
	"strings"
	"time"

)

// MercadoPagoService maneja la integración con Mercado Pago

	type MercadoPagoService struct {
		AccessToken string
		PublicKey   string
		ApiBaseURL  string
	}

// NewMercadoPagoService crea una nueva instancia del servicio de Mercado Pago

	func NewMercadoPagoService() *MercadoPagoService {
		// Obtener del entorno o usar valores por defecto para desarrollo
		accessToken := os.Getenv("MERCADOPAGO_ACCESS_TOKEN")
		publicKey := os.Getenv("MERCADOPAGO_PUBLIC_KEY")

		// Si no están configuradas, usar valores de prueba
		if accessToken == "" {
			accessToken = "TEST-7578930656151955-061121-f88fb2ff5472a156247e4a4b9a2b22a6-639593569"
		}

		if publicKey == "" {
			publicKey = "TEST-77110b60-f2cc-454f-ad25-5d08b927ac85"
		}

		return &MercadoPagoService{
			AccessToken: accessToken,
			PublicKey:   publicKey,
			ApiBaseURL:  "https://api.mercadopago.com",
		}
	}

// PreferenceItem representa un ítem en la preferencia de Mercado Pago

	type PreferenceItem struct {
		ID          string  `json:"id"`
		Title       string  `json:"title"`
		Description string  `json:"description"`
		PictureURL  string  `json:"picture_url,omitempty"`
		CategoryID  string  `json:"category_id,omitempty"`
		Quantity    int     `json:"quantity"`
		CurrencyID  string  `json:"currency_id"`
		UnitPrice   float64 `json:"unit_price"`
	}

// Payer representa al pagador en Mercado Pago

	type Payer struct {
		Name    string `json:"name"`
		Surname string `json:"surname"`
		Email   string `json:"email"`
		Phone   struct {
			AreaCode string `json:"area_code"`
			Number   string `json:"number"`
		} `json:"phone"`
		Identification struct {
			Type   string `json:"type"`
			Number string `json:"number"`
		} `json:"identification"`
		Address struct {
			ZipCode      string `json:"zip_code"`
			StreetName   string `json:"street_name"`
			StreetNumber int    `json:"street_number"`
		} `json:"address"`
	}

// BackURLs representa las URLs de redirección tras el pago

	type BackURLs struct {
		Success string `json:"success"`
		Failure string `json:"failure"`
		Pending string `json:"pending"`
	}

// PaymentMethods representa las configuraciones de métodos de pago

	type PaymentMethods struct {
		ExcludedPaymentMethods []struct {
			ID string `json:"id"`
		} `json:"excluded_payment_methods"`
		ExcludedPaymentTypes []struct {
			ID string `json:"id"`
		} `json:"excluded_payment_types"`
		Installments int `json:"installments"`
	}

// PreferenceRequest representa la solicitud para crear una preferencia

	type PreferenceRequest struct {
		Items               []PreferenceItem `json:"items"`
		Payer               Payer            `json:"payer"`
		BackURLs            BackURLs         `json:"back_urls"`
		AutoReturn          string           `json:"auto_return"`
		PaymentMethods      PaymentMethods   `json:"payment_methods"`
		NotificationURL     string           `json:"notification_url"`
		ExternalReference   string           `json:"external_reference"`
		StatementDescriptor string           `json:"statement_descriptor"`
	}

// PreferenceResponse representa la respuesta de Mercado Pago al crear una preferencia

	type PreferenceResponse struct {
		ID               string    `json:"id"`
		InitPoint        string    `json:"init_point"`
		SandboxInitPoint string    `json:"sandbox_init_point"`
		DateCreated      time.Time `json:"date_created"`
		LastUpdated      time.Time `json:"last_updated"`
	}

// PaymentNotification representa la notificación de un pago de Mercado Pago

	type PaymentNotification struct {
		ID            int64     `json:"id"`
		LiveMode      bool      `json:"live_mode"`
		Type          string    `json:"type"`
		DateCreated   time.Time `json:"date_created"`
		ApplicationID int64     `json:"application_id"`
		UserID        int64     `json:"user_id"`
		Version       int       `json:"version"`
		Data          struct {
			ID string `json:"id"`
		} `json:"data"`
	}

// PaymentResponse representa los detalles de un pago de Mercado Pago

	type PaymentResponse struct {
		ID                int64     `json:"id"`
		DateCreated       time.Time `json:"date_created"`
		DateApproved      time.Time `json:"date_approved"`
		DateLastUpdated   time.Time `json:"date_last_updated"`
		DateOfExpiration  time.Time `json:"date_of_expiration"`
		MoneyReleaseDate  time.Time `json:"money_release_date"`
		OperationType     string    `json:"operation_type"`
		IssuerId          string    `json:"issuer_id"`
		PaymentMethodId   string    `json:"payment_method_id"`
		PaymentTypeId     string    `json:"payment_type_id"`
		Status            string    `json:"status"`
		StatusDetail      string    `json:"status_detail"`
		CurrencyId        string    `json:"currency_id"`
		Description       string    `json:"description"`
		TransactionAmount float64   `json:"transaction_amount"`
		ExternalReference string    `json:"external_reference"`
	}

// CreatePreference crea una preferencia de pago en Mercado Pago
func (s *MercadoPagoService) CreatePreference(

	tourNombre string,
	monto float64,
	idReserva int,
	cliente *entidades.Cliente,
	frontendURL string,

	) (*PreferenceResponse, error) {
		// Construir la solicitud de preferencia
		preferenceURL := fmt.Sprintf("%s/checkout/preferences", s.ApiBaseURL)

		// Crear item para la preferencia
		items := []PreferenceItem{
			{
				ID:          fmt.Sprintf("TOUR-%d", idReserva),
				Title:       fmt.Sprintf("Reserva: %s", tourNombre),
				Description: "Reserva de tour en Tours Perú",
				Quantity:    1,
				CurrencyID:  "PEN", // Soles peruanos
				UnitPrice:   monto,
			},
		}

		// Configurar información del pagador
		payer := Payer{
			Name:    cliente.Nombres,
			Surname: cliente.Apellidos,
			Email:   cliente.Correo,
		}

		// Configurar número de teléfono si está disponible
		if cliente.NumeroCelular != "" {
			// Suponiendo que el número es algo como +51987654321
			payer.Phone.AreaCode = "51" // Código de país para Perú
			payer.Phone.Number = cliente.NumeroCelular
		}

		// Configurar documento de identidad si está disponible
		if cliente.NumeroDocumento != "" {
			payer.Identification.Type = "DNI" // Para Perú generalmente es DNI
			payer.Identification.Number = cliente.NumeroDocumento
		}

		// URLs de redirección después del pago
		backURLs := BackURLs{
			Success: fmt.Sprintf("%s/reserva-exitosa", frontendURL),
			Failure: fmt.Sprintf("%s/pago-fallido", frontendURL),
			Pending: fmt.Sprintf("%s/pago-pendiente", frontendURL),
		}

		// Configuración de métodos de pago
		paymentMethods := PaymentMethods{
			Installments: 1, // Solo pago en una cuota
		}

		// Crear la solicitud completa
		preferenceReq := PreferenceRequest{
			Items:               items,
			Payer:               payer,
			BackURLs:            backURLs,
			AutoReturn:          "approved",
			PaymentMethods:      paymentMethods,
			NotificationURL:     "https://reservas.angelproyect.com/api/v1/webhook/mercadopago",
			ExternalReference:   fmt.Sprintf("RESERVA-%d", idReserva),
			StatementDescriptor: "TOURS PERU",
		}

		// Convertir la solicitud a JSON
		jsonData, err := json.Marshal(preferenceReq)
		if err != nil {
			return nil, err
		}

		// Crear contexto con timeout
		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()

		// Crear la solicitud HTTP con contexto
		req, err := http.NewRequestWithContext(ctx, "POST", preferenceURL, bytes.NewBuffer(jsonData))
		if err != nil {
			return nil, err
		}

		// Configurar headers
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

		// Realizar la solicitud
		client := &http.Client{Timeout: 15 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()

		// Leer respuesta
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return nil, err
		}

		// Verificar código de respuesta
		if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("error al crear preferencia: %s - código: %d", string(body), resp.StatusCode)
		}

		// Deserializar respuesta
		var preferenceResp PreferenceResponse
		err = json.Unmarshal(body, &preferenceResp)
		if err != nil {
			return nil, err
		}

		return &preferenceResp, nil
	}

// GetPaymentInfo obtiene la información de un pago específico

	func (s *MercadoPagoService) GetPaymentInfo(paymentId string) (*PaymentResponse, error) {
		// Construir URL para obtener detalles del pago
		paymentURL := fmt.Sprintf("%s/v1/payments/%s", s.ApiBaseURL, paymentId)

		// Crear contexto con timeout
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// Crear la solicitud HTTP con contexto
		req, err := http.NewRequestWithContext(ctx, "GET", paymentURL, nil)
		if err != nil {
			return nil, err
		}

		// Configurar headers
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

		// Realizar la solicitud con reintentos
		var lastErr error
		maxRetries := 3

		for i := 0; i < maxRetries; i++ {
			client := &http.Client{Timeout: 10 * time.Second}
			resp, err := client.Do(req)
			if err != nil {
				lastErr = err
				if i < maxRetries-1 {
					time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
					continue
				}
				return nil, err
			}
			defer resp.Body.Close()

			// Leer respuesta
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				lastErr = err
				if i < maxRetries-1 {
					time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
					continue
				}
				return nil, err
			}

			// Verificar código de respuesta
			if resp.StatusCode != http.StatusOK {
				lastErr = fmt.Errorf("error al obtener información del pago: %s - código: %d", string(body), resp.StatusCode)
				if i < maxRetries-1 {
					time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
					continue
				}
				return nil, lastErr
			}

			// Deserializar respuesta
			var paymentResp PaymentResponse
			err = json.Unmarshal(body, &paymentResp)
			if err != nil {
				lastErr = err
				if i < maxRetries-1 {
					time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
					continue
				}
				return nil, err
			}

			// Si llegamos aquí, todo salió bien
			return &paymentResp, nil
		}

		// Si llegamos aquí, todos los intentos fallaron
		return nil, fmt.Errorf("error después de %d intentos: %v", maxRetries, lastErr)
	}

// MapMercadoPagoStatusToInternal mapea los estados de Mercado Pago a estados internos del sistema

	func (s *MercadoPagoService) MapMercadoPagoStatusToInternal(mpStatus string) string {
		switch mpStatus {
		case "approved":
			return "CONFIRMADA" // Cambiado de "PROCESADO" a "CONFIRMADA" para la reserva
		case "refunded", "cancelled", "rejected":
			return "CANCELADA" // Cambiado de "ANULADO" a "CANCELADA" para coincidir con estados de reserva
		case "pending", "in_process", "authorized":
			return "RESERVADO" // Cambiado de "PENDIENTE" a "RESERVADO" para coincidir con estados iniciales
		default:
			return "RESERVADO" // Estado por defecto
		}
	}

// MapMercadoPagoStatusToPagoStatus mapea los estados de Mercado Pago a estados de pago

	func (s *MercadoPagoService) MapMercadoPagoStatusToPagoStatus(mpStatus string) string {
		switch mpStatus {
		case "approved":
			return "PROCESADO" // Estado para pagos procesados
		case "refunded", "cancelled", "rejected":
			return "ANULADO" // Estado para pagos anulados/rechazados
		case "pending", "in_process", "authorized":
			return "PENDIENTE" // Estado para pagos pendientes
		default:
			return "PENDIENTE" // Estado por defecto
		}
	}

// ProcessPaymentWebhook procesa la notificación de webhook de Mercado Pago

	func (s *MercadoPagoService) ProcessPaymentWebhook(notification *PaymentNotification) (*PaymentResponse, error) {
		if notification.Type != "payment" {
			return nil, errors.New("tipo de notificación no soportado")
		}

		// Obtener información detallada del pago
		paymentInfo, err := s.GetPaymentInfo(notification.Data.ID)
		if err != nil {
			return nil, err
		}

		return paymentInfo, nil
	}

// GeneratePreferenceForExistingReserva genera una preferencia de pago para una reserva existente
func (s *MercadoPagoService) GeneratePreferenceForExistingReserva(

	idReserva int,
	monto float64,
	cliente *entidades.Cliente,
	frontendURL string,

	) (*PreferenceResponse, error) {
		// Podemos reutilizar el método CreatePreference, pero necesitamos un nombre para el tour
		// En un caso real, obtendrías el nombre del tour desde la reserva
		tourNombre := "Reserva de Tour"

		return s.CreatePreference(tourNombre, monto, idReserva, cliente, frontendURL)
	}

// VerificarEstadoPago verifica el estado de un pago usando el ID de preferencia o el ID de pago

	func (s *MercadoPagoService) VerificarEstadoPago(preferenceID string, paymentID string) (string, string, int, error) {
		// Si tenemos un paymentID, usarlo directamente
		if paymentID != "" {
			paymentInfo, err := s.GetPaymentInfo(paymentID)
			if err != nil {
				return "", "", 0, err
			}

			// Extraer ID de reserva del external_reference (formato "RESERVA-12345")
			var reservaID int
			if paymentInfo.ExternalReference != "" {
				idReservaStr := strings.TrimPrefix(paymentInfo.ExternalReference, "RESERVA-")
				reservaID, _ = strconv.Atoi(idReservaStr)
			}

			return paymentInfo.Status, paymentID, reservaID, nil
		}

		// Si no tenemos paymentID pero sí preferenceID, buscar pagos asociados a esa preferencia
		if preferenceID != "" {
			// Construir URL para buscar pagos por preferencia
			searchURL := fmt.Sprintf("%s/v1/payments/search?preference_id=%s", s.ApiBaseURL, preferenceID)

			// Crear contexto con timeout
			ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			defer cancel()

			// Crear la solicitud HTTP con contexto
			req, err := http.NewRequestWithContext(ctx, "GET", searchURL, nil)
			if err != nil {
				return "", "", 0, err
			}

			// Configurar headers
			req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

			// Realizar la solicitud con reintentos
			var lastErr error
			maxRetries := 3

			for i := 0; i < maxRetries; i++ {
				client := &http.Client{Timeout: 10 * time.Second}
				resp, err := client.Do(req)
				if err != nil {
					lastErr = err
					if i < maxRetries-1 {
						time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
						continue
					}
					return "", "", 0, err
				}
				defer resp.Body.Close()

				// Leer respuesta
				body, err := ioutil.ReadAll(resp.Body)
				if err != nil {
					lastErr = err
					if i < maxRetries-1 {
						time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
						continue
					}
					return "", "", 0, err
				}

				// Verificar código de respuesta
				if resp.StatusCode != http.StatusOK {
					lastErr = fmt.Errorf("error al buscar pagos: %s - código: %d", string(body), resp.StatusCode)
					if i < maxRetries-1 {
						time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
						continue
					}
					return "", "", 0, lastErr
				}

				// Estructura para parsear resultados
				var searchResult struct {
					Paging struct {
						Total int `json:"total"`
					} `json:"paging"`
					Results []PaymentResponse `json:"results"`
				}

				// Deserializar respuesta
				err = json.Unmarshal(body, &searchResult)
				if err != nil {
					lastErr = err
					if i < maxRetries-1 {
						time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
						continue
					}
					return "", "", 0, err
				}

				// Si no hay resultados, no hay pagos asociados aún
				if searchResult.Paging.Total == 0 || len(searchResult.Results) == 0 {
					return "pending", "", 0, nil
				}

				// Tomar el pago más reciente
				payment := searchResult.Results[0]

				// Extraer ID de reserva del external_reference
				var reservaID int
				if payment.ExternalReference != "" {
					idReservaStr := strings.TrimPrefix(payment.ExternalReference, "RESERVA-")
					reservaID, _ = strconv.Atoi(idReservaStr)
				}

				return payment.Status, fmt.Sprintf("%d", payment.ID), reservaID, nil
			}

			// Si llegamos aquí, todos los intentos fallaron
			return "", "", 0, fmt.Errorf("error después de %d intentos: %v", maxRetries, lastErr)
		}

		return "", "", 0, errors.New("se requiere preferenceID o paymentID para verificar estado")
	}
*/
package servicios

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"sistema-toursseft/internal/entidades"
	"strconv"
	"strings"
	"time"
)

// MercadoPagoService maneja la integración con Mercado Pago
type MercadoPagoService struct {
	AccessToken string
	PublicKey   string
	ApiBaseURL  string
}

// NewMercadoPagoService crea una nueva instancia del servicio de Mercado Pago
func NewMercadoPagoService() *MercadoPagoService {
	// Obtener del entorno o usar valores por defecto para desarrollo
	accessToken := os.Getenv("MERCADOPAGO_ACCESS_TOKEN")
	publicKey := os.Getenv("MERCADOPAGO_PUBLIC_KEY")

	// Si no están configuradas, usar valores de prueba
	if accessToken == "" {
		accessToken = "TEST-7578930656151955-061121-f88fb2ff5472a156247e4a4b9a2b22a6-639593569"
	}

	if publicKey == "" {
		publicKey = "TEST-77110b60-f2cc-454f-ad25-5d08b927ac85"
	}

	return &MercadoPagoService{
		AccessToken: accessToken,
		PublicKey:   publicKey,
		ApiBaseURL:  "https://api.mercadopago.com",
	}
}

// PreferenceItem representa un ítem en la preferencia de Mercado Pago
type PreferenceItem struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	PictureURL  string  `json:"picture_url,omitempty"`
	CategoryID  string  `json:"category_id,omitempty"`
	Quantity    int     `json:"quantity"`
	CurrencyID  string  `json:"currency_id"`
	UnitPrice   float64 `json:"unit_price"`
}

// Payer representa al pagador en Mercado Pago
type Payer struct {
	Name    string `json:"name"`
	Surname string `json:"surname"`
	Email   string `json:"email"`
	Phone   struct {
		AreaCode string `json:"area_code"`
		Number   string `json:"number"`
	} `json:"phone"`
	Identification struct {
		Type   string `json:"type"`
		Number string `json:"number"`
	} `json:"identification"`
	Address struct {
		ZipCode      string `json:"zip_code"`
		StreetName   string `json:"street_name"`
		StreetNumber int    `json:"street_number"`
	} `json:"address"`
}

// BackURLs representa las URLs de redirección tras el pago
type BackURLs struct {
	Success string `json:"success"`
	Failure string `json:"failure"`
	Pending string `json:"pending"`
}

// PaymentMethods representa las configuraciones de métodos de pago
type PaymentMethods struct {
	ExcludedPaymentMethods []struct {
		ID string `json:"id"`
	} `json:"excluded_payment_methods"`
	ExcludedPaymentTypes []struct {
		ID string `json:"id"`
	} `json:"excluded_payment_types"`
	Installments int `json:"installments"`
}

// PreferenceRequest representa la solicitud para crear una preferencia
type PreferenceRequest struct {
	Items               []PreferenceItem `json:"items"`
	Payer               Payer            `json:"payer"`
	BackURLs            BackURLs         `json:"back_urls"`
	AutoReturn          string           `json:"auto_return"`
	PaymentMethods      PaymentMethods   `json:"payment_methods"`
	NotificationURL     string           `json:"notification_url"`
	ExternalReference   string           `json:"external_reference"`
	StatementDescriptor string           `json:"statement_descriptor"`
	ExpirationDateFrom  *time.Time       `json:"expiration_date_from,omitempty"`
	ExpirationDateTo    *time.Time       `json:"expiration_date_to,omitempty"`
}

// PreferenceResponse representa la respuesta de Mercado Pago al crear una preferencia
type PreferenceResponse struct {
	ID               string    `json:"id"`
	InitPoint        string    `json:"init_point"`
	SandboxInitPoint string    `json:"sandbox_init_point"`
	DateCreated      time.Time `json:"date_created"`
	LastUpdated      time.Time `json:"last_updated"`
}

// PaymentNotification representa la notificación de un pago de Mercado Pago
type PaymentNotification struct {
	ID            int64     `json:"id"`
	LiveMode      bool      `json:"live_mode"`
	Type          string    `json:"type"`
	DateCreated   time.Time `json:"date_created"`
	ApplicationID int64     `json:"application_id"`
	UserID        int64     `json:"user_id"`
	Version       int       `json:"version"`
	Data          struct {
		ID string `json:"id"`
	} `json:"data"`
}

// PaymentResponse representa los detalles de un pago de Mercado Pago
type PaymentResponse struct {
	ID                int64     `json:"id"`
	DateCreated       time.Time `json:"date_created"`
	DateApproved      time.Time `json:"date_approved"`
	DateLastUpdated   time.Time `json:"date_last_updated"`
	DateOfExpiration  time.Time `json:"date_of_expiration"`
	MoneyReleaseDate  time.Time `json:"money_release_date"`
	OperationType     string    `json:"operation_type"`
	IssuerId          string    `json:"issuer_id"`
	PaymentMethodId   string    `json:"payment_method_id"`
	PaymentTypeId     string    `json:"payment_type_id"`
	Status            string    `json:"status"`
	StatusDetail      string    `json:"status_detail"`
	CurrencyId        string    `json:"currency_id"`
	Description       string    `json:"description"`
	TransactionAmount float64   `json:"transaction_amount"`
	ExternalReference string    `json:"external_reference"`
}

// GetPublicKey devuelve la clave pública para operaciones en el frontend
func (s *MercadoPagoService) GetPublicKey() string {
	return s.PublicKey
}

// CreatePreference crea una preferencia de pago en Mercado Pago
func (s *MercadoPagoService) CreatePreference(
	tourNombre string,
	monto float64,
	idReserva int,
	cliente *entidades.Cliente,
	frontendURL string,
) (*PreferenceResponse, error) {
	// Registrar inicio de creación de preferencia
	fmt.Printf("CreatePreference: Iniciando creación para reserva ID=%d, tour=%s, monto=%.2f\n",
		idReserva, tourNombre, monto)

	// Construir la solicitud de preferencia
	preferenceURL := fmt.Sprintf("%s/checkout/preferences", s.ApiBaseURL)

	// Crear item para la preferencia
	items := []PreferenceItem{
		{
			ID:          fmt.Sprintf("TOUR-%d", idReserva),
			Title:       fmt.Sprintf("Reserva: %s", tourNombre),
			Description: "Reserva de tour en Tours Perú",
			Quantity:    1,
			CurrencyID:  "PEN", // Soles peruanos
			UnitPrice:   monto,
		},
	}

	// Configurar información del pagador
	payer := Payer{
		Name:    cliente.Nombres,
		Surname: cliente.Apellidos,
		Email:   cliente.Correo,
	}

	// Configurar número de teléfono si está disponible
	if cliente.NumeroCelular != "" {
		// Limpiar el número telefónico de cualquier prefijo como "+"
		cleanNumber := strings.TrimPrefix(cliente.NumeroCelular, "+")
		cleanNumber = strings.TrimPrefix(cleanNumber, "51") // Quitar prefijo de Perú si existe

		payer.Phone.AreaCode = "51" // Código de país para Perú
		payer.Phone.Number = cleanNumber

		fmt.Printf("CreatePreference: Configurando teléfono: +%s %s\n", payer.Phone.AreaCode, payer.Phone.Number)
	}

	// Configurar documento de identidad si está disponible
	if cliente.NumeroDocumento != "" {
		payer.Identification.Type = "DNI" // Para Perú generalmente es DNI
		payer.Identification.Number = cliente.NumeroDocumento
		fmt.Printf("CreatePreference: Configurando documento: %s %s\n",
			payer.Identification.Type, payer.Identification.Number)
	}

	// URLs de redirección después del pago
	backURLs := BackURLs{
		Success: fmt.Sprintf("%s/reserva-exitosa?id_reserva=%d", frontendURL, idReserva),
		Failure: fmt.Sprintf("%s/pago-fallido?id_reserva=%d", frontendURL, idReserva),
		Pending: fmt.Sprintf("%s/pago-pendiente?id_reserva=%d", frontendURL, idReserva),
	}

	// Configuración de métodos de pago
	paymentMethods := PaymentMethods{
		Installments: 1, // Solo pago en una cuota
	}

	// Establecer fecha de expiración de la preferencia (24 horas desde ahora)
	now := time.Now()
	expirationDate := now.Add(24 * time.Hour)

	// Crear la solicitud completa
	preferenceReq := PreferenceRequest{
		Items:               items,
		Payer:               payer,
		BackURLs:            backURLs,
		AutoReturn:          "approved",
		PaymentMethods:      paymentMethods,
		NotificationURL:     "https://reservas.angelproyect.com/api/v1/webhook/mercadopago",
		ExternalReference:   fmt.Sprintf("RESERVA-%d", idReserva),
		StatementDescriptor: "TOURS PERU",
		ExpirationDateTo:    &expirationDate,
	}

	// Convertir la solicitud a JSON
	jsonData, err := json.Marshal(preferenceReq)
	if err != nil {
		fmt.Printf("CreatePreference: Error al serializar solicitud: %v\n", err)
		return nil, err
	}

	// Crear contexto con timeout
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	// Crear la solicitud HTTP con contexto
	req, err := http.NewRequestWithContext(ctx, "POST", preferenceURL, bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("CreatePreference: Error al crear solicitud HTTP: %v\n", err)
		return nil, err
	}

	// Configurar headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

	// Realizar la solicitud con reintentos
	var lastErr error
	maxRetries := 3

	for i := 0; i < maxRetries; i++ {
		// Registrar intento
		if i > 0 {
			fmt.Printf("CreatePreference: Reintento %d/%d\n", i+1, maxRetries)
		}

		client := &http.Client{Timeout: 15 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			lastErr = err
			fmt.Printf("CreatePreference: Error en la solicitud HTTP: %v\n", err)
			if i < maxRetries-1 {
				time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
				continue
			}
			return nil, err
		}
		defer resp.Body.Close()

		// Leer respuesta
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			lastErr = err
			fmt.Printf("CreatePreference: Error al leer respuesta: %v\n", err)
			if i < maxRetries-1 {
				time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
				continue
			}
			return nil, err
		}

		// Verificar código de respuesta
		if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
			lastErr = fmt.Errorf("error al crear preferencia: %s - código: %d", string(body), resp.StatusCode)
			fmt.Printf("CreatePreference: Error en respuesta: %v\n", lastErr)
			if i < maxRetries-1 {
				time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
				continue
			}
			return nil, lastErr
		}

		// Deserializar respuesta
		var preferenceResp PreferenceResponse
		err = json.Unmarshal(body, &preferenceResp)
		if err != nil {
			lastErr = err
			fmt.Printf("CreatePreference: Error al deserializar respuesta: %v\n", err)
			if i < maxRetries-1 {
				time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
				continue
			}
			return nil, err
		}

		fmt.Printf("CreatePreference: Preferencia creada exitosamente: ID=%s\n", preferenceResp.ID)
		return &preferenceResp, nil
	}

	// Si llegamos aquí, todos los intentos fallaron
	return nil, fmt.Errorf("error después de %d intentos: %v", maxRetries, lastErr)
}

// GetPaymentInfo obtiene la información de un pago específico
func (s *MercadoPagoService) GetPaymentInfo(paymentId string) (*PaymentResponse, error) {
	// Registrar inicio de consulta
	fmt.Printf("GetPaymentInfo: Consultando pago ID=%s\n", paymentId)

	// Construir URL para obtener detalles del pago
	paymentURL := fmt.Sprintf("%s/v1/payments/%s", s.ApiBaseURL, paymentId)

	// Crear contexto con timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Crear la solicitud HTTP con contexto
	req, err := http.NewRequestWithContext(ctx, "GET", paymentURL, nil)
	if err != nil {
		fmt.Printf("GetPaymentInfo: Error al crear solicitud HTTP: %v\n", err)
		return nil, err
	}

	// Configurar headers
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

	// Realizar la solicitud con reintentos
	var lastErr error
	maxRetries := 3

	for i := 0; i < maxRetries; i++ {
		// Registrar intento
		if i > 0 {
			fmt.Printf("GetPaymentInfo: Reintento %d/%d\n", i+1, maxRetries)
		}

		client := &http.Client{Timeout: 10 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			lastErr = err
			fmt.Printf("GetPaymentInfo: Error en la solicitud HTTP: %v\n", err)
			if i < maxRetries-1 {
				time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
				continue
			}
			return nil, err
		}
		defer resp.Body.Close()

		// Leer respuesta
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			lastErr = err
			fmt.Printf("GetPaymentInfo: Error al leer respuesta: %v\n", err)
			if i < maxRetries-1 {
				time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
				continue
			}
			return nil, err
		}

		// Verificar código de respuesta
		if resp.StatusCode != http.StatusOK {
			lastErr = fmt.Errorf("error al obtener información del pago: %s - código: %d", string(body), resp.StatusCode)
			fmt.Printf("GetPaymentInfo: Error en respuesta: %v\n", lastErr)
			if i < maxRetries-1 {
				time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
				continue
			}
			return nil, lastErr
		}

		// Deserializar respuesta
		var paymentResp PaymentResponse
		err = json.Unmarshal(body, &paymentResp)
		if err != nil {
			lastErr = err
			fmt.Printf("GetPaymentInfo: Error al deserializar respuesta: %v\n", err)
			if i < maxRetries-1 {
				time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
				continue
			}
			return nil, err
		}

		// Si llegamos aquí, todo salió bien
		fmt.Printf("GetPaymentInfo: Información obtenida correctamente - status=%s, method=%s\n",
			paymentResp.Status, paymentResp.PaymentMethodId)
		return &paymentResp, nil
	}

	// Si llegamos aquí, todos los intentos fallaron
	return nil, fmt.Errorf("error después de %d intentos: %v", maxRetries, lastErr)
}

// MapMercadoPagoStatusToInternal mapea los estados de Mercado Pago a estados internos del sistema
func (s *MercadoPagoService) MapMercadoPagoStatusToInternal(mpStatus string) string {
	switch mpStatus {
	case "approved":
		return "CONFIRMADA" // Cambiado de "PROCESADO" a "CONFIRMADA" para la reserva
	case "refunded", "cancelled", "rejected":
		return "CANCELADA" // Cambiado de "ANULADO" a "CANCELADA" para coincidir con estados de reserva
	case "pending", "in_process", "authorized":
		return "RESERVADO" // Cambiado de "PENDIENTE" a "RESERVADO" para coincidir con estados iniciales
	default:
		return "RESERVADO" // Estado por defecto
	}
}

// MapMercadoPagoStatusToPagoStatus mapea los estados de Mercado Pago a estados de pago
func (s *MercadoPagoService) MapMercadoPagoStatusToPagoStatus(mpStatus string) string {
	switch mpStatus {
	case "approved":
		return "PROCESADO" // Estado para pagos procesados
	case "refunded", "cancelled", "rejected":
		return "ANULADO" // Estado para pagos anulados/rechazados
	case "pending", "in_process", "authorized":
		return "PENDIENTE" // Estado para pagos pendientes
	default:
		return "PENDIENTE" // Estado por defecto
	}
}

// ProcessPaymentWebhook procesa la notificación de webhook de Mercado Pago
func (s *MercadoPagoService) ProcessPaymentWebhook(notification *PaymentNotification) (*PaymentResponse, error) {
	// Registrar inicio de procesamiento
	fmt.Printf("ProcessPaymentWebhook: Procesando notificación tipo=%s, data.id=%s\n",
		notification.Type, notification.Data.ID)

	if notification.Type != "payment" {
		return nil, errors.New("tipo de notificación no soportado")
	}

	// Obtener información detallada del pago
	paymentInfo, err := s.GetPaymentInfo(notification.Data.ID)
	if err != nil {
		fmt.Printf("ProcessPaymentWebhook: Error al obtener información del pago: %v\n", err)
		return nil, err
	}

	return paymentInfo, nil
}

// GeneratePreferenceForExistingReserva genera una preferencia de pago para una reserva existente
func (s *MercadoPagoService) GeneratePreferenceForExistingReserva(
	idReserva int,
	monto float64,
	cliente *entidades.Cliente,
	frontendURL string,
) (*PreferenceResponse, error) {
	// Registrar inicio de operación
	fmt.Printf("GeneratePreferenceForExistingReserva: Generando preferencia para reserva ID=%d\n", idReserva)

	// En un caso real, obtendrías el nombre del tour desde la reserva
	tourNombre := "Reserva de Tour"

	return s.CreatePreference(tourNombre, monto, idReserva, cliente, frontendURL)
}

// VerificarEstadoPago verifica el estado de un pago usando el ID de preferencia o el ID de pago
func (s *MercadoPagoService) VerificarEstadoPago(preferenceID string, paymentID string) (string, string, int, error) {
	// Registrar inicio de verificación
	fmt.Printf("VerificarEstadoPago: Verificando pago - preferenceID=%s, paymentID=%s\n", preferenceID, paymentID)

	// Si tenemos un paymentID, usarlo directamente
	if paymentID != "" {
		paymentInfo, err := s.GetPaymentInfo(paymentID)
		if err != nil {
			fmt.Printf("VerificarEstadoPago: Error al obtener información del pago: %v\n", err)
			return "", "", 0, err
		}

		// Extraer ID de reserva del external_reference (formato "RESERVA-12345")
		var reservaID int
		if paymentInfo.ExternalReference != "" {
			idReservaStr := strings.TrimPrefix(paymentInfo.ExternalReference, "RESERVA-")
			reservaID, _ = strconv.Atoi(idReservaStr)
		}

		fmt.Printf("VerificarEstadoPago: Información obtenida - status=%s, reservaID=%d\n",
			paymentInfo.Status, reservaID)
		return paymentInfo.Status, paymentInfo.PaymentMethodId, reservaID, nil
	}

	// Si no tenemos paymentID pero sí preferenceID, buscar pagos asociados a esa preferencia
	if preferenceID != "" {
		// Construir URL para buscar pagos por preferencia
		searchURL := fmt.Sprintf("%s/v1/payments/search?preference_id=%s", s.ApiBaseURL, preferenceID)

		// Crear contexto con timeout
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// Crear la solicitud HTTP con contexto
		req, err := http.NewRequestWithContext(ctx, "GET", searchURL, nil)
		if err != nil {
			fmt.Printf("VerificarEstadoPago: Error al crear solicitud HTTP: %v\n", err)
			return "", "", 0, err
		}

		// Configurar headers
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

		// Realizar la solicitud con reintentos
		var lastErr error
		maxRetries := 3

		for i := 0; i < maxRetries; i++ {
			// Registrar intento
			if i > 0 {
				fmt.Printf("VerificarEstadoPago: Reintento %d/%d\n", i+1, maxRetries)
			}

			client := &http.Client{Timeout: 10 * time.Second}
			resp, err := client.Do(req)
			if err != nil {
				lastErr = err
				fmt.Printf("VerificarEstadoPago: Error en la solicitud HTTP: %v\n", err)
				if i < maxRetries-1 {
					time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
					continue
				}
				return "", "", 0, err
			}
			defer resp.Body.Close()

			// Leer respuesta
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				lastErr = err
				fmt.Printf("VerificarEstadoPago: Error al leer respuesta: %v\n", err)
				if i < maxRetries-1 {
					time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
					continue
				}
				return "", "", 0, err
			}

			// Verificar código de respuesta
			if resp.StatusCode != http.StatusOK {
				lastErr = fmt.Errorf("error al buscar pagos: %s - código: %d", string(body), resp.StatusCode)
				fmt.Printf("VerificarEstadoPago: Error en respuesta: %v\n", lastErr)
				if i < maxRetries-1 {
					time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
					continue
				}
				return "", "", 0, lastErr
			}

			// Estructura para parsear resultados
			var searchResult struct {
				Paging struct {
					Total int `json:"total"`
				} `json:"paging"`
				Results []PaymentResponse `json:"results"`
			}

			// Deserializar respuesta
			err = json.Unmarshal(body, &searchResult)
			if err != nil {
				lastErr = err
				fmt.Printf("VerificarEstadoPago: Error al deserializar respuesta: %v\n", err)
				if i < maxRetries-1 {
					time.Sleep(time.Duration(i+1) * 500 * time.Millisecond)
					continue
				}
				return "", "", 0, err
			}

			// Si no hay resultados, no hay pagos asociados aún
			if searchResult.Paging.Total == 0 || len(searchResult.Results) == 0 {
				fmt.Printf("VerificarEstadoPago: No hay pagos asociados a la preferencia\n")
				return "pending", "", 0, nil
			}

			// Tomar el pago más reciente
			payment := searchResult.Results[0]

			// Extraer ID de reserva del external_reference
			var reservaID int
			if payment.ExternalReference != "" {
				idReservaStr := strings.TrimPrefix(payment.ExternalReference, "RESERVA-")
				reservaID, _ = strconv.Atoi(idReservaStr)
			}

			fmt.Printf("VerificarEstadoPago: Pago encontrado - status=%s, method=%s, reservaID=%d\n",
				payment.Status, payment.PaymentMethodId, reservaID)
			return payment.Status, payment.PaymentMethodId, reservaID, nil
		}

		// Si llegamos aquí, todos los intentos fallaron
		return "", "", 0, fmt.Errorf("error después de %d intentos: %v", maxRetries, lastErr)
	}

	return "", "", 0, errors.New("se requiere preferenceID o paymentID para verificar estado")
}

// GetExpirationTimeForPaymentMethod devuelve el tiempo de expiración en horas según el método de pago
func (s *MercadoPagoService) GetExpirationTimeForPaymentMethod(paymentMethod string) int {
	// Registrar método solicitado
	fmt.Printf("GetExpirationTimeForPaymentMethod: Calculando tiempo para método %s\n", paymentMethod)

	// Métodos de pago offline o que requieren más tiempo
	offlineMethods := map[string]bool{
		"bank_transfer": true,
		"atm":           true,
		"ticket":        true,
		"pago_efectivo": true,
		"boleto":        true,
		"pse":           true,
		"rapipago":      true,
		"pagofacil":     true,
		"oxxo":          true,
		"webpay":        true,
	}

	// Métodos de pago móviles
	mobileMethods := map[string]bool{
		"yape":          true,
		"plin":          true,
		"tunki":         true,
		"mobile_wallet": true,
	}

	// Determinar el tiempo de expiración según el tipo de método
	var horasExpiracion int

	if offlineMethods[paymentMethod] {
		horasExpiracion = 48 // 48 horas para métodos offline
	} else if mobileMethods[paymentMethod] {
		horasExpiracion = 36 // 36 horas para métodos móviles
	} else {
		horasExpiracion = 24 // 24 horas para otros métodos (tarjetas, etc.)
	}

	fmt.Printf("GetExpirationTimeForPaymentMethod: Tiempo de expiración calculado: %d horas\n", horasExpiracion)
	return horasExpiracion
}
