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
		IsSandbox   bool
	}

// NewMercadoPagoService crea una nueva instancia del servicio de Mercado Pago

	func NewMercadoPagoService() *MercadoPagoService {
		// 🔧 FORZAR SANDBOX PARA DEBUGGING
		fmt.Printf("🧪 FORZANDO MODO SANDBOX PARA PRUEBAS\n")

		// Hardcodear sandbox temporalmente
		isSandbox := true
		accessToken := "APP_USR-1479267288961423-092100-4b20738369b4ae4efc6647bba62b1533-2503618286"
		publicKey := "APP_USR-bab1c568-ca8d-4fbc-9c87-b2b797744fc6"

		// Verificar que las credenciales sean de sandbox
		if !strings.HasPrefix(accessToken, "APP_USR-1479267288961423") {
			panic("❌ ERROR: No se están usando las credenciales de sandbox correctas")
		}

		fmt.Printf("✅ Credenciales de sandbox verificadas:\n")
		fmt.Printf("   - Access Token: %s\n", accessToken)
		fmt.Printf("   - Public Key: %s\n", publicKey)
		fmt.Printf("   - Is Sandbox: %v\n", isSandbox)

		return &MercadoPagoService{
			AccessToken: accessToken,
			PublicKey:   publicKey,
			ApiBaseURL:  "https://api.mercadopago.com",
			IsSandbox:   isSandbox,
		}
	}

// Estructuras para MercadoPago

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

	type BackURLs struct {
		Success string `json:"success"`
		Failure string `json:"failure"`
		Pending string `json:"pending"`
	}

	type PaymentMethods struct {
		ExcludedPaymentMethods []struct {
			ID string `json:"id"`
		} `json:"excluded_payment_methods"`
		ExcludedPaymentTypes []struct {
			ID string `json:"id"`
		} `json:"excluded_payment_types"`
		Installments int `json:"installments"`
	}

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

	type PreferenceResponse struct {
		ID               string    `json:"id"`
		InitPoint        string    `json:"init_point"`
		SandboxInitPoint string    `json:"sandbox_init_point"`
		DateCreated      time.Time `json:"date_created"`
		LastUpdated      time.Time `json:"last_updated"`
	}

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

// GetPublicKey devuelve la clave pública para el frontend

	func (s *MercadoPagoService) GetPublicKey() string {
		return s.PublicKey
	}

// GetIsSandbox devuelve si estamos en modo sandbox

	func (s *MercadoPagoService) GetIsSandbox() bool {
		return s.IsSandbox
	}

// CreatePreference crea una preferencia de pago
func (s *MercadoPagoService) CreatePreference(

	tourNombre string,
	monto float64,
	idReserva int,
	cliente *entidades.Cliente,
	frontendURL string,

) (*PreferenceResponse, error) {

		fmt.Printf("🚀 CreatePreference: Iniciando creación\n")
		fmt.Printf("   - Reserva ID: %d\n", idReserva)
		fmt.Printf("   - Tour: %s\n", tourNombre)
		fmt.Printf("   - Monto: S/ %.2f\n", monto)
		fmt.Printf("   - Cliente: %s %s (%s)\n", cliente.Nombres, cliente.Apellidos, cliente.Correo)
		fmt.Printf("   - Sandbox: %v\n", s.IsSandbox)

		// URL del endpoint
		preferenceURL := fmt.Sprintf("%s/checkout/preferences", s.ApiBaseURL)

		// Crear item del tour
		items := []PreferenceItem{
			{
				ID:          fmt.Sprintf("TOUR-%d", idReserva),
				Title:       fmt.Sprintf("🏝️ %s", tourNombre),
				Description: fmt.Sprintf("Reserva de tour #%d - Tours Perú", idReserva),
				Quantity:    1,
				CurrencyID:  "PEN", // Soles peruanos
				UnitPrice:   monto,
				CategoryID:  "travel",
			},
		}

		// Configurar pagador
		payer := Payer{
			Name:    cliente.Nombres,
			Surname: cliente.Apellidos,
			Email:   cliente.Correo,
		}

		// Configurar teléfono si existe
		if cliente.NumeroCelular != "" {
			cleanNumber := strings.TrimSpace(cliente.NumeroCelular)
			cleanNumber = strings.TrimPrefix(cleanNumber, "+")
			cleanNumber = strings.TrimPrefix(cleanNumber, "51")

			if len(cleanNumber) >= 9 {
				payer.Phone.AreaCode = "51"
				payer.Phone.Number = cleanNumber
				fmt.Printf("   - Teléfono configurado: +51 %s\n", cleanNumber)
			}
		}

		// Configurar documento si existe
		if cliente.NumeroDocumento != "" {
			payer.Identification.Type = "DNI"
			payer.Identification.Number = cliente.NumeroDocumento
			fmt.Printf("   - Documento configurado: DNI %s\n", cliente.NumeroDocumento)
		}

		// URLs de retorno - CLAVE PARA QUE FUNCIONE EL SANDBOX
		baseReturnURL := frontendURL
		if !strings.HasSuffix(baseReturnURL, "/") {
			baseReturnURL += "/"
		}

		backURLs := BackURLs{
			Success: fmt.Sprintf("%sproceso-pago?status=approved&external_reference=RESERVA-%d", baseReturnURL, idReserva),
			Failure: fmt.Sprintf("%sproceso-pago?status=rejected&external_reference=RESERVA-%d", baseReturnURL, idReserva),
			Pending: fmt.Sprintf("%sproceso-pago?status=pending&external_reference=RESERVA-%d", baseReturnURL, idReserva),
		}

		fmt.Printf("   - URLs de retorno configuradas:\n")
		fmt.Printf("     Success: %s\n", backURLs.Success)
		fmt.Printf("     Failure: %s\n", backURLs.Failure)
		fmt.Printf("     Pending: %s\n", backURLs.Pending)

		// Configurar métodos de pago
		paymentMethods := PaymentMethods{
			ExcludedPaymentMethods: []struct {
				ID string `json:"id"`
			}{},
			ExcludedPaymentTypes: []struct {
				ID string `json:"id"`
			}{},
			Installments: 1, // Solo una cuota
		}

		// Fecha de expiración (24 horas en sandbox, menos tiempo)
		now := time.Now()
		expirationHours := 24
		if s.IsSandbox {
			expirationHours = 2 // 2 horas en sandbox para pruebas rápidas
		}
		expirationDate := now.Add(time.Duration(expirationHours) * time.Hour)

		// Webhook URL
		webhookURL := "https://reservas.angelproyect.com/api/v1/webhook/mercadopago"

		// Crear solicitud completa
		preferenceReq := PreferenceRequest{
			Items:               items,
			Payer:               payer,
			BackURLs:            backURLs,
			AutoReturn:          "approved", // Auto-retornar en aprobados
			PaymentMethods:      paymentMethods,
			NotificationURL:     webhookURL,
			ExternalReference:   fmt.Sprintf("RESERVA-%d", idReserva),
			StatementDescriptor: "TOURS PERU",
			ExpirationDateTo:    &expirationDate,
		}

		// Serializar a JSON
		jsonData, err := json.Marshal(preferenceReq)
		if err != nil {
			fmt.Printf("❌ Error al serializar solicitud: %v\n", err)
			return nil, fmt.Errorf("error al preparar solicitud: %v", err)
		}

		fmt.Printf("🔄 Enviando solicitud a MercadoPago...\n")
		fmt.Printf("   URL: %s\n", preferenceURL)

		// Crear contexto con timeout
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		// Crear solicitud HTTP
		req, err := http.NewRequestWithContext(ctx, "POST", preferenceURL, bytes.NewBuffer(jsonData))
		if err != nil {
			fmt.Printf("❌ Error al crear solicitud HTTP: %v\n", err)
			return nil, fmt.Errorf("error al crear solicitud: %v", err)
		}

		// Headers
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

		// Ejecutar solicitud con reintentos
		var lastErr error
		maxRetries := 3

		for i := 0; i < maxRetries; i++ {
			if i > 0 {
				fmt.Printf("🔄 Reintento %d/%d\n", i+1, maxRetries)
			}

			client := &http.Client{Timeout: 30 * time.Second}
			resp, err := client.Do(req)
			if err != nil {
				lastErr = err
				fmt.Printf("❌ Error en solicitud HTTP (intento %d): %v\n", i+1, err)
				if i < maxRetries-1 {
					time.Sleep(time.Duration(i+1) * time.Second)
					continue
				}
				return nil, fmt.Errorf("error de conexión después de %d intentos: %v", maxRetries, err)
			}
			defer resp.Body.Close()

			// Leer respuesta
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				lastErr = err
				fmt.Printf("❌ Error al leer respuesta (intento %d): %v\n", i+1, err)
				if i < maxRetries-1 {
					time.Sleep(time.Duration(i+1) * time.Second)
					continue
				}
				return nil, fmt.Errorf("error al leer respuesta: %v", err)
			}

			fmt.Printf("📥 Respuesta HTTP %d recibida\n", resp.StatusCode)

			// Verificar código de respuesta
			if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
				lastErr = fmt.Errorf("código HTTP %d: %s", resp.StatusCode, string(body))
				fmt.Printf("❌ Error en respuesta: %v\n", lastErr)

				// Si es error 400/401, no reintentar
				if resp.StatusCode == 400 || resp.StatusCode == 401 {
					return nil, fmt.Errorf("error de credenciales o datos: %s", string(body))
				}

				if i < maxRetries-1 {
					time.Sleep(time.Duration(i+1) * time.Second)
					continue
				}
				return nil, lastErr
			}

			// Deserializar respuesta exitosa
			var preferenceResp PreferenceResponse
			err = json.Unmarshal(body, &preferenceResp)
			if err != nil {
				lastErr = err
				fmt.Printf("❌ Error al deserializar respuesta: %v\n", err)
				fmt.Printf("Respuesta raw: %s\n", string(body))
				if i < maxRetries-1 {
					time.Sleep(time.Duration(i+1) * time.Second)
					continue
				}
				return nil, fmt.Errorf("error al procesar respuesta: %v", err)
			}

			// ¡Éxito!
			fmt.Printf("✅ Preferencia creada exitosamente!\n")
			fmt.Printf("   - ID: %s\n", preferenceResp.ID)
			fmt.Printf("   - Init Point: %s\n", preferenceResp.InitPoint)
			if s.IsSandbox && preferenceResp.SandboxInitPoint != "" {
				fmt.Printf("   - Sandbox Init Point: %s\n", preferenceResp.SandboxInitPoint)
			}

			return &preferenceResp, nil
		}

		return nil, fmt.Errorf("error después de %d intentos: %v", maxRetries, lastErr)
	}

// GetPaymentInfo obtiene información de un pago específico

	func (s *MercadoPagoService) GetPaymentInfo(paymentId string) (*PaymentResponse, error) {
		fmt.Printf("🔍 GetPaymentInfo: Consultando pago ID=%s (Sandbox: %v)\n", paymentId, s.IsSandbox)

		paymentURL := fmt.Sprintf("%s/v1/payments/%s", s.ApiBaseURL, paymentId)

		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()

		req, err := http.NewRequestWithContext(ctx, "GET", paymentURL, nil)
		if err != nil {
			return nil, fmt.Errorf("error al crear solicitud: %v", err)
		}

		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

		client := &http.Client{Timeout: 15 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			return nil, fmt.Errorf("error en solicitud: %v", err)
		}
		defer resp.Body.Close()

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return nil, fmt.Errorf("error al leer respuesta: %v", err)
		}

		if resp.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("error HTTP %d: %s", resp.StatusCode, string(body))
		}

		var paymentResp PaymentResponse
		err = json.Unmarshal(body, &paymentResp)
		if err != nil {
			return nil, fmt.Errorf("error al deserializar: %v", err)
		}

		fmt.Printf("✅ Pago consultado - Status: %s, Method: %s\n",
			paymentResp.Status, paymentResp.PaymentMethodId)

		return &paymentResp, nil
	}

// VerificarEstadoPago verifica el estado usando preference_id o payment_id

	func (s *MercadoPagoService) VerificarEstadoPago(preferenceID string, paymentID string) (string, string, int, error) {
		fmt.Printf("🔍 VerificarEstadoPago: preferenceID=%s, paymentID=%s (Sandbox: %v)\n",
			preferenceID, paymentID, s.IsSandbox)

		// Si tenemos paymentID, usarlo directamente
		if paymentID != "" {
			paymentInfo, err := s.GetPaymentInfo(paymentID)
			if err != nil {
				return "", "", 0, err
			}

			var reservaID int
			if paymentInfo.ExternalReference != "" {
				idReservaStr := strings.TrimPrefix(paymentInfo.ExternalReference, "RESERVA-")
				reservaID, _ = strconv.Atoi(idReservaStr)
			}

			return paymentInfo.Status, paymentInfo.PaymentMethodId, reservaID, nil
		}

		// Si tenemos preferenceID, buscar pagos asociados
		if preferenceID != "" {
			searchURL := fmt.Sprintf("%s/v1/payments/search?preference_id=%s", s.ApiBaseURL, preferenceID)

			ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
			defer cancel()

			req, err := http.NewRequestWithContext(ctx, "GET", searchURL, nil)
			if err != nil {
				return "", "", 0, err
			}

			req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

			client := &http.Client{Timeout: 15 * time.Second}
			resp, err := client.Do(req)
			if err != nil {
				return "", "", 0, err
			}
			defer resp.Body.Close()

			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				return "", "", 0, err
			}

			if resp.StatusCode != http.StatusOK {
				return "", "", 0, fmt.Errorf("error HTTP %d: %s", resp.StatusCode, string(body))
			}

			var searchResult struct {
				Paging struct {
					Total int `json:"total"`
				} `json:"paging"`
				Results []PaymentResponse `json:"results"`
			}

			err = json.Unmarshal(body, &searchResult)
			if err != nil {
				return "", "", 0, err
			}

			if searchResult.Paging.Total == 0 || len(searchResult.Results) == 0 {
				fmt.Printf("⏳ No hay pagos asociados a la preferencia aún\n")
				return "pending", "", 0, nil
			}

			// Tomar el pago más reciente
			payment := searchResult.Results[0]

			var reservaID int
			if payment.ExternalReference != "" {
				idReservaStr := strings.TrimPrefix(payment.ExternalReference, "RESERVA-")
				reservaID, _ = strconv.Atoi(idReservaStr)
			}

			fmt.Printf("✅ Pago encontrado - Status: %s, Method: %s, ReservaID: %d\n",
				payment.Status, payment.PaymentMethodId, reservaID)

			return payment.Status, payment.PaymentMethodId, reservaID, nil
		}

		return "", "", 0, errors.New("se requiere preferenceID o paymentID")
	}

// Mapeo de estados

	func (s *MercadoPagoService) MapMercadoPagoStatusToInternal(mpStatus string) string {
		statusMap := map[string]string{
			"approved":   "CONFIRMADA",
			"rejected":   "CANCELADA",
			"cancelled":  "CANCELADA",
			"refunded":   "CANCELADA",
			"pending":    "RESERVADO",
			"in_process": "RESERVADO",
			"authorized": "RESERVADO",
		}

		if status, exists := statusMap[mpStatus]; exists {
			return status
		}
		return "RESERVADO" // Por defecto
	}

	func (s *MercadoPagoService) MapMercadoPagoStatusToPagoStatus(mpStatus string) string {
		statusMap := map[string]string{
			"approved":   "PROCESADO",
			"rejected":   "ANULADO",
			"cancelled":  "ANULADO",
			"refunded":   "ANULADO",
			"pending":    "PENDIENTE",
			"in_process": "PENDIENTE",
			"authorized": "PENDIENTE",
		}

		if status, exists := statusMap[mpStatus]; exists {
			return status
		}
		return "PENDIENTE" // Por defecto
	}

// ProcessPaymentWebhook procesa notificaciones de webhook

	func (s *MercadoPagoService) ProcessPaymentWebhook(notification *PaymentNotification) (*PaymentResponse, error) {
		fmt.Printf("🔔 ProcessPaymentWebhook: Tipo=%s, DataID=%s (Sandbox: %v)\n",
			notification.Type, notification.Data.ID, s.IsSandbox)

		if notification.Type != "payment" {
			return nil, errors.New("tipo de notificación no soportado")
		}

		return s.GetPaymentInfo(notification.Data.ID)
	}

// GeneratePreferenceForExistingReserva para reservas existentes
func (s *MercadoPagoService) GeneratePreferenceForExistingReserva(

	idReserva int,
	monto float64,
	cliente *entidades.Cliente,
	frontendURL string,

	) (*PreferenceResponse, error) {
		return s.CreatePreference("Reserva de Tour", monto, idReserva, cliente, frontendURL)
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
	IsSandbox   bool
}

// 🆕 NUEVAS ESTRUCTURAS PARA CHECKOUT API
type CheckoutAPIPaymentRequest struct {
	TransactionAmount float64                   `json:"transaction_amount"`
	Token             string                    `json:"token"`
	Description       string                    `json:"description"`
	PaymentMethodID   string                    `json:"payment_method_id"`
	Payer             CheckoutAPIPayer          `json:"payer"`
	ExternalReference string                    `json:"external_reference"`
	NotificationURL   string                    `json:"notification_url"`
	Metadata          map[string]interface{}    `json:"metadata"`
	AdditionalInfo    CheckoutAPIAdditionalInfo `json:"additional_info"`
	Installments      int                       `json:"installments,omitempty"`
	IssuerID          string                    `json:"issuer_id,omitempty"`
}

type CheckoutAPIPayer struct {
	Email          string                    `json:"email"`
	FirstName      string                    `json:"first_name"`
	LastName       string                    `json:"last_name"`
	Identification CheckoutAPIIdentification `json:"identification"`
	Phone          CheckoutAPIPhone          `json:"phone,omitempty"`
	Address        CheckoutAPIAddress        `json:"address,omitempty"`
}

type CheckoutAPIIdentification struct {
	Type   string `json:"type"`
	Number string `json:"number"`
}

type CheckoutAPIPhone struct {
	AreaCode string `json:"area_code"`
	Number   string `json:"number"`
}

type CheckoutAPIAddress struct {
	ZipCode      string `json:"zip_code"`
	StreetName   string `json:"street_name"`
	StreetNumber string `json:"street_number"`
}

type CheckoutAPIAdditionalInfo struct {
	Items []CheckoutAPIItem `json:"items"`
}

type CheckoutAPIItem struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Quantity    string `json:"quantity"`
	UnitPrice   string `json:"unit_price"`
}

type CheckoutAPIPaymentResponse struct {
	ID                int64     `json:"id"`
	Status            string    `json:"status"`
	StatusDetail      string    `json:"status_detail"`
	TransactionAmount float64   `json:"transaction_amount"`
	DateCreated       time.Time `json:"date_created"`
	DateApproved      time.Time `json:"date_approved"`
	ExternalReference string    `json:"external_reference"`
	PaymentMethodID   string    `json:"payment_method_id"`
	PaymentTypeID     string    `json:"payment_type_id"`
}

// ESTRUCTURAS EXISTENTES PARA CHECKOUT PRO...
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

type BackURLs struct {
	Success string `json:"success"`
	Failure string `json:"failure"`
	Pending string `json:"pending"`
}

type PaymentMethods struct {
	ExcludedPaymentMethods []struct {
		ID string `json:"id"`
	} `json:"excluded_payment_methods"`
	ExcludedPaymentTypes []struct {
		ID string `json:"id"`
	} `json:"excluded_payment_types"`
	Installments int `json:"installments"`
}

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

type PreferenceResponse struct {
	ID               string    `json:"id"`
	InitPoint        string    `json:"init_point"`
	SandboxInitPoint string    `json:"sandbox_init_point"`
	DateCreated      time.Time `json:"date_created"`
	LastUpdated      time.Time `json:"last_updated"`
}

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

// NewMercadoPagoService crea una nueva instancia del servicio de Mercado Pago
// NewMercadoPagoService crea una nueva instancia del servicio de Mercado Pago
func NewMercadoPagoService() *MercadoPagoService {
	fmt.Printf("🧪 INICIALIZANDO MERCADOPAGO - MODO TEST PARA CHECKOUT API\n")

	// 🔧 LEER CREDENCIALES DE TEST DESDE VARIABLES DE ENTORNO
	accessToken := os.Getenv("MERCADOPAGO_TEST_ACCESS_TOKEN")
	publicKey := os.Getenv("MERCADOPAGO_TEST_PUBLIC_KEY")

	// Verificar que las credenciales existen
	if accessToken == "" || publicKey == "" {
		fmt.Printf("⚠️ Credenciales de MercadoPago no encontradas en ENV, usando hardcodeadas para desarrollo\n")
		// Fallback a credenciales hardcodeadas para desarrollo local
		accessToken = "TEST-5127959896141909-092114-1f2cdf7ec34afb228745a81a34daeff0-639593569"
		publicKey = "TEST-4e0f5e55-d687-4b7e-83db-12a20d3d6beb"
	}

	// Verificar que las credenciales sean de TEST
	if !strings.HasPrefix(accessToken, "TEST-") || !strings.HasPrefix(publicKey, "TEST-") {
		panic("❌ ERROR: No se están usando las credenciales de TEST correctas")
	}

	isSandbox := true // Mantener como sandbox para el comportamiento interno

	fmt.Printf("✅ Configuración verificada:\n")
	fmt.Printf("   - Access Token: %s...\n", accessToken[:25])
	fmt.Printf("   - Public Key: %s...\n", publicKey[:25])
	fmt.Printf("   - Mode: TEST (para Checkout API)\n")
	fmt.Printf("   - API Base URL: https://api.mercadopago.com\n")

	return &MercadoPagoService{
		AccessToken: accessToken,
		PublicKey:   publicKey,
		ApiBaseURL:  "https://api.mercadopago.com",
		IsSandbox:   isSandbox,
	}
}

// ========== MÉTODOS PARA CHECKOUT API (NUEVOS) ==========

// 🆕 ProcessCardPayment procesa un pago con tarjeta usando Checkout API
func (s *MercadoPagoService) ProcessCardPayment(
	token string,
	transactionAmount float64,
	paymentMethodID string,
	issuerID string,
	installments int,
	cliente *entidades.Cliente,
	idReserva int,
) (*CheckoutAPIPaymentResponse, error) {

	fmt.Printf("💳 ProcessCardPayment: Iniciando pago con Checkout API\n")
	fmt.Printf("   - Token: %s\n", token)
	fmt.Printf("   - Monto: S/ %.2f\n", transactionAmount)
	fmt.Printf("   - Método: %s\n", paymentMethodID)
	fmt.Printf("   - Emisor: %s\n", issuerID)
	fmt.Printf("   - Cuotas: %d\n", installments)
	fmt.Printf("   - Reserva ID: %d\n", idReserva)

	// URL del endpoint
	paymentURL := fmt.Sprintf("%s/v1/payments", s.ApiBaseURL)

	// Preparar datos del pagador
	payer := CheckoutAPIPayer{
		Email:     cliente.Correo,
		FirstName: cliente.Nombres,
		LastName:  cliente.Apellidos,
	}

	// Configurar identificación
	if cliente.NumeroDocumento != "" {
		payer.Identification = CheckoutAPIIdentification{
			Type:   "DNI",
			Number: cliente.NumeroDocumento,
		}
	}

	// Configurar teléfono
	if cliente.NumeroCelular != "" {
		cleanNumber := strings.TrimSpace(cliente.NumeroCelular)
		cleanNumber = strings.TrimPrefix(cleanNumber, "+")
		cleanNumber = strings.TrimPrefix(cleanNumber, "51")

		if len(cleanNumber) >= 9 {
			payer.Phone = CheckoutAPIPhone{
				AreaCode: "51",
				Number:   cleanNumber,
			}
		}
	}

	// Configurar dirección (opcional para sandbox)
	payer.Address = CheckoutAPIAddress{
		ZipCode:      "15001",
		StreetName:   "Av. Principal",
		StreetNumber: "123",
	}

	// Información adicional
	additionalInfo := CheckoutAPIAdditionalInfo{
		Items: []CheckoutAPIItem{
			{
				ID:          fmt.Sprintf("TOUR-%d", idReserva),
				Title:       "Reserva de Tour",
				Description: fmt.Sprintf("Reserva #%d - Tours Perú", idReserva),
				Quantity:    "1",
				UnitPrice:   fmt.Sprintf("%.2f", transactionAmount),
			},
		},
	}

	// Webhook URL
	webhookURL := "https://reservas.angelproyect.com/api/v1/webhook/mercadopago"

	// Crear request de pago
	paymentReq := CheckoutAPIPaymentRequest{
		TransactionAmount: transactionAmount,
		Token:             token,
		Description:       fmt.Sprintf("Reserva de Tour #%d", idReserva),
		PaymentMethodID:   paymentMethodID,
		Payer:             payer,
		ExternalReference: fmt.Sprintf("RESERVA-%d", idReserva),
		NotificationURL:   webhookURL,
		Metadata: map[string]interface{}{
			"reserva_id": idReserva,
			"cliente_id": cliente.ID,
		},
		AdditionalInfo: additionalInfo,
		Installments:   installments,
	}

	// Agregar issuer si está disponible
	if issuerID != "" {
		paymentReq.IssuerID = issuerID
	}

	// Serializar a JSON
	jsonData, err := json.Marshal(paymentReq)
	if err != nil {
		return nil, fmt.Errorf("error al serializar request: %v", err)
	}

	fmt.Printf("🔄 Enviando pago a MercadoPago API...\n")
	fmt.Printf("   URL: %s\n", paymentURL)

	// Crear contexto con timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Crear solicitud HTTP
	req, err := http.NewRequestWithContext(ctx, "POST", paymentURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("error al crear request: %v", err)
	}

	// Headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))
	req.Header.Set("X-Idempotency-Key", fmt.Sprintf("reserva-%d-%d", idReserva, time.Now().Unix()))

	// Ejecutar solicitud
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error en solicitud: %v", err)
	}
	defer resp.Body.Close()

	// Leer respuesta
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error al leer respuesta: %v", err)
	}

	fmt.Printf("📥 Respuesta HTTP %d recibida\n", resp.StatusCode)

	// Verificar código de respuesta
	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		fmt.Printf("❌ Error en pago: %s\n", string(body))
		return nil, fmt.Errorf("error en pago HTTP %d: %s", resp.StatusCode, string(body))
	}

	// Deserializar respuesta
	var paymentResp CheckoutAPIPaymentResponse
	err = json.Unmarshal(body, &paymentResp)
	if err != nil {
		return nil, fmt.Errorf("error al deserializar respuesta: %v", err)
	}

	fmt.Printf("✅ Pago procesado exitosamente!\n")
	fmt.Printf("   - Payment ID: %d\n", paymentResp.ID)
	fmt.Printf("   - Status: %s\n", paymentResp.Status)
	fmt.Printf("   - Status Detail: %s\n", paymentResp.StatusDetail)
	fmt.Printf("   - Amount: S/ %.2f\n", paymentResp.TransactionAmount)

	return &paymentResp, nil
}

// 🆕 GetPaymentMethods obtiene métodos de pago disponibles
func (s *MercadoPagoService) GetPaymentMethods() ([]map[string]interface{}, error) {
	fmt.Printf("📋 GetPaymentMethods: Obteniendo métodos de pago\n")

	url := fmt.Sprintf("%s/v1/payment_methods", s.ApiBaseURL)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error HTTP %d: %s", resp.StatusCode, string(body))
	}

	var methods []map[string]interface{}
	err = json.Unmarshal(body, &methods)
	if err != nil {
		return nil, err
	}

	fmt.Printf("✅ %d métodos de pago obtenidos\n", len(methods))
	return methods, nil
}

// 🆕 GetCardIssuers obtiene emisores de tarjetas
func (s *MercadoPagoService) GetCardIssuers(paymentMethodID string) ([]map[string]interface{}, error) {
	fmt.Printf("🏛️ GetCardIssuers: Obteniendo emisores para %s\n", paymentMethodID)

	url := fmt.Sprintf("%s/v1/payment_methods/card_issuers?payment_method_id=%s", s.ApiBaseURL, paymentMethodID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error HTTP %d: %s", resp.StatusCode, string(body))
	}

	var issuers []map[string]interface{}
	err = json.Unmarshal(body, &issuers)
	if err != nil {
		return nil, err
	}

	fmt.Printf("✅ %d emisores obtenidos\n", len(issuers))
	return issuers, nil
}

// 🆕 GetInstallments obtiene opciones de cuotas
func (s *MercadoPagoService) GetInstallments(amount, paymentMethodID, issuerID string) ([]map[string]interface{}, error) {
	fmt.Printf("💰 GetInstallments: Obteniendo cuotas para %s\n", paymentMethodID)

	url := fmt.Sprintf("%s/v1/payment_methods/installments?amount=%s&payment_method_id=%s",
		s.ApiBaseURL, amount, paymentMethodID)

	if issuerID != "" {
		url += "&issuer_id=" + issuerID
	}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error HTTP %d: %s", resp.StatusCode, string(body))
	}

	var installments []map[string]interface{}
	err = json.Unmarshal(body, &installments)
	if err != nil {
		return nil, err
	}

	fmt.Printf("✅ Opciones de cuotas obtenidas\n")
	return installments, nil
}

// ========== MÉTODOS EXISTENTES PARA CHECKOUT PRO ==========

// GetPublicKey devuelve la clave pública para el frontend
func (s *MercadoPagoService) GetPublicKey() string {
	return s.PublicKey
}

// GetIsSandbox devuelve si estamos en modo sandbox
func (s *MercadoPagoService) GetIsSandbox() bool {
	return s.IsSandbox
}

// CreatePreference crea una preferencia de pago (CHECKOUT PRO)
func (s *MercadoPagoService) CreatePreference(
	tourNombre string,
	monto float64,
	idReserva int,
	cliente *entidades.Cliente,
	frontendURL string,
) (*PreferenceResponse, error) {

	fmt.Printf("🚀 CreatePreference: Iniciando creación (Checkout Pro)\n")
	fmt.Printf("   - Reserva ID: %d\n", idReserva)
	fmt.Printf("   - Tour: %s\n", tourNombre)
	fmt.Printf("   - Monto: S/ %.2f\n", monto)
	fmt.Printf("   - Cliente: %s %s (%s)\n", cliente.Nombres, cliente.Apellidos, cliente.Correo)
	fmt.Printf("   - Sandbox: %v\n", s.IsSandbox)

	// URL del endpoint
	preferenceURL := fmt.Sprintf("%s/checkout/preferences", s.ApiBaseURL)

	// Crear item del tour
	items := []PreferenceItem{
		{
			ID:          fmt.Sprintf("TOUR-%d", idReserva),
			Title:       fmt.Sprintf("🏝️ %s", tourNombre),
			Description: fmt.Sprintf("Reserva de tour #%d - Tours Perú", idReserva),
			Quantity:    1,
			CurrencyID:  "PEN", // Soles peruanos
			UnitPrice:   monto,
			CategoryID:  "travel",
		},
	}

	// Configurar pagador
	payer := Payer{
		Name:    cliente.Nombres,
		Surname: cliente.Apellidos,
		Email:   cliente.Correo,
	}

	// Configurar teléfono si existe
	if cliente.NumeroCelular != "" {
		cleanNumber := strings.TrimSpace(cliente.NumeroCelular)
		cleanNumber = strings.TrimPrefix(cleanNumber, "+")
		cleanNumber = strings.TrimPrefix(cleanNumber, "51")

		if len(cleanNumber) >= 9 {
			payer.Phone.AreaCode = "51"
			payer.Phone.Number = cleanNumber
			fmt.Printf("   - Teléfono configurado: +51 %s\n", cleanNumber)
		}
	}

	// Configurar documento si existe
	if cliente.NumeroDocumento != "" {
		payer.Identification.Type = "DNI"
		payer.Identification.Number = cliente.NumeroDocumento
		fmt.Printf("   - Documento configurado: DNI %s\n", cliente.NumeroDocumento)
	}

	// URLs de retorno - CORREGIDAS
	baseReturnURL := frontendURL
	if !strings.HasSuffix(baseReturnURL, "/") {
		baseReturnURL += "/"
	}

	backURLs := BackURLs{
		Success: fmt.Sprintf("%sproceso-pago?status=approved&external_reference=RESERVA-%d", baseReturnURL, idReserva),
		Failure: fmt.Sprintf("%sproceso-pago?status=rejected&external_reference=RESERVA-%d", baseReturnURL, idReserva),
		Pending: fmt.Sprintf("%sproceso-pago?status=pending&external_reference=RESERVA-%d", baseReturnURL, idReserva),
	}

	fmt.Printf("   - URLs de retorno configuradas:\n")
	fmt.Printf("     Success: %s\n", backURLs.Success)
	fmt.Printf("     Failure: %s\n", backURLs.Failure)
	fmt.Printf("     Pending: %s\n", backURLs.Pending)

	// Configurar métodos de pago
	paymentMethods := PaymentMethods{
		ExcludedPaymentMethods: []struct {
			ID string `json:"id"`
		}{},
		ExcludedPaymentTypes: []struct {
			ID string `json:"id"`
		}{},
		Installments: 1, // Solo una cuota
	}

	// Fecha de expiración
	now := time.Now()
	expirationHours := 24
	if s.IsSandbox {
		expirationHours = 2 // 2 horas en sandbox para pruebas rápidas
	}
	expirationDate := now.Add(time.Duration(expirationHours) * time.Hour)

	// Webhook URL
	webhookURL := "https://reservas.angelproyect.com/api/v1/webhook/mercadopago"

	// Crear solicitud completa
	preferenceReq := PreferenceRequest{
		Items:               items,
		Payer:               payer,
		BackURLs:            backURLs,
		AutoReturn:          "approved",
		PaymentMethods:      paymentMethods,
		NotificationURL:     webhookURL,
		ExternalReference:   fmt.Sprintf("RESERVA-%d", idReserva),
		StatementDescriptor: "TOURS PERU",
		ExpirationDateTo:    &expirationDate,
	}

	// Serializar a JSON
	jsonData, err := json.Marshal(preferenceReq)
	if err != nil {
		fmt.Printf("❌ Error al serializar solicitud: %v\n", err)
		return nil, fmt.Errorf("error al preparar solicitud: %v", err)
	}

	fmt.Printf("🔄 Enviando solicitud a MercadoPago...\n")
	fmt.Printf("   URL: %s\n", preferenceURL)

	// Crear contexto con timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Crear solicitud HTTP
	req, err := http.NewRequestWithContext(ctx, "POST", preferenceURL, bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("❌ Error al crear solicitud HTTP: %v\n", err)
		return nil, fmt.Errorf("error al crear solicitud: %v", err)
	}

	// Headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

	// Ejecutar solicitud con reintentos
	var lastErr error
	maxRetries := 3

	for i := 0; i < maxRetries; i++ {
		if i > 0 {
			fmt.Printf("🔄 Reintento %d/%d\n", i+1, maxRetries)
		}

		client := &http.Client{Timeout: 30 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			lastErr = err
			fmt.Printf("❌ Error en solicitud HTTP (intento %d): %v\n", i+1, err)
			if i < maxRetries-1 {
				time.Sleep(time.Duration(i+1) * time.Second)
				continue
			}
			return nil, fmt.Errorf("error de conexión después de %d intentos: %v", maxRetries, err)
		}
		defer resp.Body.Close()

		// Leer respuesta
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			lastErr = err
			fmt.Printf("❌ Error al leer respuesta (intento %d): %v\n", i+1, err)
			if i < maxRetries-1 {
				time.Sleep(time.Duration(i+1) * time.Second)
				continue
			}
			return nil, fmt.Errorf("error al leer respuesta: %v", err)
		}

		fmt.Printf("📥 Respuesta HTTP %d recibida\n", resp.StatusCode)

		// Verificar código de respuesta
		if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
			lastErr = fmt.Errorf("código HTTP %d: %s", resp.StatusCode, string(body))
			fmt.Printf("❌ Error en respuesta: %v\n", lastErr)

			// Si es error 400/401, no reintentar
			if resp.StatusCode == 400 || resp.StatusCode == 401 {
				return nil, fmt.Errorf("error de credenciales o datos: %s", string(body))
			}

			if i < maxRetries-1 {
				time.Sleep(time.Duration(i+1) * time.Second)
				continue
			}
			return nil, lastErr
		}

		// Deserializar respuesta exitosa
		var preferenceResp PreferenceResponse
		err = json.Unmarshal(body, &preferenceResp)
		if err != nil {
			lastErr = err
			fmt.Printf("❌ Error al deserializar respuesta: %v\n", err)
			fmt.Printf("Respuesta raw: %s\n", string(body))
			if i < maxRetries-1 {
				time.Sleep(time.Duration(i+1) * time.Second)
				continue
			}
			return nil, fmt.Errorf("error al procesar respuesta: %v", err)
		}

		// ¡Éxito!
		fmt.Printf("✅ Preferencia creada exitosamente!\n")
		fmt.Printf("   - ID: %s\n", preferenceResp.ID)
		fmt.Printf("   - Init Point: %s\n", preferenceResp.InitPoint)
		if s.IsSandbox && preferenceResp.SandboxInitPoint != "" {
			fmt.Printf("   - Sandbox Init Point: %s\n", preferenceResp.SandboxInitPoint)
		}

		return &preferenceResp, nil
	}

	return nil, fmt.Errorf("error después de %d intentos: %v", maxRetries, lastErr)
}

// GetPaymentInfo obtiene información de un pago específico
func (s *MercadoPagoService) GetPaymentInfo(paymentId string) (*PaymentResponse, error) {
	fmt.Printf("🔍 GetPaymentInfo: Consultando pago ID=%s (Sandbox: %v)\n", paymentId, s.IsSandbox)

	paymentURL := fmt.Sprintf("%s/v1/payments/%s", s.ApiBaseURL, paymentId)

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, "GET", paymentURL, nil)
	if err != nil {
		return nil, fmt.Errorf("error al crear solicitud: %v", err)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error en solicitud: %v", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error al leer respuesta: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error HTTP %d: %s", resp.StatusCode, string(body))
	}

	var paymentResp PaymentResponse
	err = json.Unmarshal(body, &paymentResp)
	if err != nil {
		return nil, fmt.Errorf("error al deserializar: %v", err)
	}

	fmt.Printf("✅ Pago consultado - Status: %s, Method: %s\n",
		paymentResp.Status, paymentResp.PaymentMethodId)

	return &paymentResp, nil
}

// VerificarEstadoPago verifica el estado usando preference_id o payment_id
func (s *MercadoPagoService) VerificarEstadoPago(preferenceID string, paymentID string) (string, string, int, error) {
	fmt.Printf("🔍 VerificarEstadoPago: preferenceID=%s, paymentID=%s (Sandbox: %v)\n",
		preferenceID, paymentID, s.IsSandbox)

	// Si tenemos paymentID, usarlo directamente
	if paymentID != "" {
		paymentInfo, err := s.GetPaymentInfo(paymentID)
		if err != nil {
			return "", "", 0, err
		}

		var reservaID int
		if paymentInfo.ExternalReference != "" {
			idReservaStr := strings.TrimPrefix(paymentInfo.ExternalReference, "RESERVA-")
			reservaID, _ = strconv.Atoi(idReservaStr)
		}

		return paymentInfo.Status, paymentInfo.PaymentMethodId, reservaID, nil
	}

	// Si tenemos preferenceID, buscar pagos asociados
	if preferenceID != "" {
		searchURL := fmt.Sprintf("%s/v1/payments/search?preference_id=%s", s.ApiBaseURL, preferenceID)

		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()

		req, err := http.NewRequestWithContext(ctx, "GET", searchURL, nil)
		if err != nil {
			return "", "", 0, err
		}

		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.AccessToken))

		client := &http.Client{Timeout: 15 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			return "", "", 0, err
		}
		defer resp.Body.Close()

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return "", "", 0, err
		}

		if resp.StatusCode != http.StatusOK {
			return "", "", 0, fmt.Errorf("error HTTP %d: %s", resp.StatusCode, string(body))
		}

		var searchResult struct {
			Paging struct {
				Total int `json:"total"`
			} `json:"paging"`
			Results []PaymentResponse `json:"results"`
		}

		err = json.Unmarshal(body, &searchResult)
		if err != nil {
			return "", "", 0, err
		}

		if searchResult.Paging.Total == 0 || len(searchResult.Results) == 0 {
			fmt.Printf("⏳ No hay pagos asociados a la preferencia aún\n")
			return "pending", "", 0, nil
		}

		// Tomar el pago más reciente
		payment := searchResult.Results[0]

		var reservaID int
		if payment.ExternalReference != "" {
			idReservaStr := strings.TrimPrefix(payment.ExternalReference, "RESERVA-")
			reservaID, _ = strconv.Atoi(idReservaStr)
		}

		fmt.Printf("✅ Pago encontrado - Status: %s, Method: %s, ReservaID: %d\n",
			payment.Status, payment.PaymentMethodId, reservaID)

		return payment.Status, payment.PaymentMethodId, reservaID, nil
	}

	return "", "", 0, errors.New("se requiere preferenceID o paymentID")
}

// ========== MÉTODOS DE MAPEO Y UTILIDADES ==========

// Mapeo de estados
func (s *MercadoPagoService) MapMercadoPagoStatusToInternal(mpStatus string) string {
	statusMap := map[string]string{
		"approved":   "CONFIRMADA",
		"rejected":   "CANCELADA",
		"cancelled":  "CANCELADA",
		"refunded":   "CANCELADA",
		"pending":    "RESERVADO",
		"in_process": "RESERVADO",
		"authorized": "RESERVADO",
	}

	if status, exists := statusMap[mpStatus]; exists {
		return status
	}
	return "RESERVADO" // Por defecto
}

func (s *MercadoPagoService) MapMercadoPagoStatusToPagoStatus(mpStatus string) string {
	statusMap := map[string]string{
		"approved":   "PROCESADO",
		"rejected":   "ANULADO",
		"cancelled":  "ANULADO",
		"refunded":   "ANULADO",
		"pending":    "PENDIENTE",
		"in_process": "PENDIENTE",
		"authorized": "PENDIENTE",
	}

	if status, exists := statusMap[mpStatus]; exists {
		return status
	}
	return "PENDIENTE" // Por defecto
}

// ProcessPaymentWebhook procesa notificaciones de webhook
func (s *MercadoPagoService) ProcessPaymentWebhook(notification *PaymentNotification) (*PaymentResponse, error) {
	fmt.Printf("🔔 ProcessPaymentWebhook: Tipo=%s, DataID=%s (Sandbox: %v)\n",
		notification.Type, notification.Data.ID, s.IsSandbox)

	if notification.Type != "payment" {
		return nil, errors.New("tipo de notificación no soportado")
	}

	return s.GetPaymentInfo(notification.Data.ID)
}

// GeneratePreferenceForExistingReserva para reservas existentes (CHECKOUT PRO)
func (s *MercadoPagoService) GeneratePreferenceForExistingReserva(
	idReserva int,
	monto float64,
	cliente *entidades.Cliente,
	frontendURL string,
) (*PreferenceResponse, error) {
	return s.CreatePreference("Reserva de Tour", monto, idReserva, cliente, frontendURL)
}
