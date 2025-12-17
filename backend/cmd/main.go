/*
package main

import (

	"database/sql"
	"fmt"
	"log"
	"os"
	"sistema-toursseft/internal/config"
	"sistema-toursseft/internal/controladores"
	"sistema-toursseft/internal/jobs"
	"sistema-toursseft/internal/repositorios"
	"sistema-toursseft/internal/rutas"
	"sistema-toursseft/internal/servicios"
	"sistema-toursseft/internal/utils"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"

)

	func initRecuperacionContrasena(db *sql.DB, usuarioRepo *repositorios.UsuarioRepository, clienteRepo *repositorios.ClienteRepository) *controladores.RecuperacionContrasenaController {
		// 1. Crear el servicio de email
		emailService, err := servicios.NewEmailService()
		if err != nil {
			log.Fatalf("Error al inicializar el servicio de email: %v", err)
		}

		// 2. Crear el repositorio de recuperación
		recuperacionRepo := repositorios.NewRecuperacionContrasenaRepository(db)

		// 3. Crear el servicio de recuperación
		recuperacionService := servicios.NewRecuperacionContrasenaService(
			usuarioRepo,
			clienteRepo,
			recuperacionRepo,
			emailService,
		)

		// 4. Crear el controlador
		return controladores.NewRecuperacionContrasenaController(recuperacionService)
	}

func main() {

		//
		// Cargar configuración
		cfg := config.LoadConfig()
		encryptionKey := cfg.EncryptionKey
		if encryptionKey == "" {
			log.Fatal("❌ ENCRYPTION_KEY no está configurada en las variables de entorno")
		}

		if len(encryptionKey) != 32 {
			log.Fatalf("❌ ENCRYPTION_KEY debe ser de 32 caracteres, tiene %d", len(encryptionKey))
		}

		if err := utils.InitCrypto(encryptionKey); err != nil {
			log.Fatalf("❌ Error al inicializar encriptación: %v", err)
		}

		// ✅ NUEVO: Inicializar sistema de encriptación
		// La clave debe ser de 64 caracteres (32 para cifrado + 32 para HMAC)

		// Configurar modo de Gin según entorno
		if cfg.Env == "production" {
			gin.SetMode(gin.ReleaseMode)
		}

		// Inicializar router
		router := gin.Default()

		// Middleware de recuperación y logging
		router.Use(gin.Recovery())
		router.Use(gin.Logger())

		// ✅ CORS configurado para recibir desde múltiples dominios
		corsConfig := cors.Config{
			AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
			AllowHeaders: []string{
				"Origin",
				"Content-Type",
				"Content-Length",
				"Accept",
				"Authorization",
				"X-Requested-With",
				"X-CSRF-Token",
			},

			ExposeHeaders:    []string{"Content-Length", "Content-Type", "Authorization", "Set-Cookie"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
			AllowWildcard:    true, // ⚠️ Seguridad en producción
			AllowWebSockets:  true,
		}

		// 🔄 Configurar orígenes según el entorno
		if cfg.Env == "production" {
			corsConfig.AllowOrigins = []string{
				// Panel administrativo
				"https://admin.angelproyect.com",
				"https://www.admin.angelproyect.com",
				// Sistema de reservas
				"https://reservas.angelproyect.com",
				"https://www.reservas.angelproyect.com",
			}
			log.Println("✅ CORS configurado para producción: admin.angelproyect.com y reservas.angelproyect.com")
		} else {
			corsConfig.AllowOrigins = []string{
				// Frontend admin en desarrollo
				"http://localhost:5173",
				"http://127.0.0.1:5173",
				"https://localhost:5173",
				// Página web de reservas en desarrollo
				"http://localhost:5174",
				"http://127.0.0.1:5174",
				"https://localhost:5174",
			}
			log.Println("ℹ️ CORS configurado para desarrollo - ambos frontends")
		}

		router.Use(cors.New(corsConfig))

		// ✅ Health check mejorado
		router.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status":    "ok",
				"timestamp": time.Now().UTC().Format(time.RFC3339),
				"version":   "1.0.0",
				"service":   "sistema-tours-api",
				"env":       cfg.Env,
				"cors":      corsConfig.AllowOrigins,
			})
		})

		// ✅ Health check adicional para API
		router.GET("/api/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status":  "ok",
				"api":     "sistema-tours",
				"version": "1.0.0",
			})
		})

		utils.InitValidator()

		// Conectar a la base de datos con reintentos
		db, err := connectDBWithRetry(cfg)
		if err != nil {
			log.Fatalf("❌ Error al conectar a la base de datos: %v", err)
		}
		defer db.Close()

		log.Println("📋 Ejecutando migraciones...")
		if err := runMigrations(db); err != nil {
			log.Fatalf("❌ Error al ejecutar migraciones: %v", err)
		}

		// Inicializar repositorios
		usuarioRepo := repositorios.NewUsuarioRepository(db)
		idiomaRepo := repositorios.NewIdiomaRepository(db)
		embarcacionRepo := repositorios.NewEmbarcacionRepository(db)
		usuarioIdiomaRepo := repositorios.NewUsuarioIdiomaRepository(db) // Nuevo repositorio

		sedeRepo := repositorios.NewSedeRepository(db)
		tipoTourRepo := repositorios.NewTipoTourRepository(db)
		galeriaTourRepo := repositorios.NewGaleriaTourRepo(db)

		horarioTourRepo := repositorios.NewHorarioTourRepository(db)
		horarioChoferRepo := repositorios.NewHorarioChoferRepository(db)
		tourProgramadoRepo := repositorios.NewTourProgramadoRepository(db)

		metodoPagoRepo := repositorios.NewMetodoPagoRepository(db)
		tipoPasajeRepo := repositorios.NewTipoPasajeRepository(db)
		paquetePasajesRepo := repositorios.NewPaquetePasajesRepository(db)

		canalVentaRepo := repositorios.NewCanalVentaRepository(db)
		clienteRepo := repositorios.NewClienteRepository(db)
		reservaRepo := repositorios.NewReservaRepository(db)
		pagoRepo := repositorios.NewPagoRepository(db)
		comprobantePagoRepo := repositorios.NewComprobantePagoRepository(db)
		instanciaTourRepo := repositorios.NewInstanciaTourRepository(db)

		// Inicializar servicios
		authService := servicios.NewAuthService(usuarioRepo, sedeRepo, cfg)
		usuarioService := servicios.NewUsuarioService(usuarioRepo, usuarioIdiomaRepo)                         // Modificado para incluir usuarioIdiomaRepo
		usuarioIdiomaService := servicios.NewUsuarioIdiomaService(usuarioIdiomaRepo, idiomaRepo, usuarioRepo) // Nuevo servicio

		idiomaService := servicios.NewIdiomaService(idiomaRepo)
		sedeService := servicios.NewSedeService(sedeRepo)
		embarcacionService := servicios.NewEmbarcacionService(embarcacionRepo, sedeRepo)
		tipoTourService := servicios.NewTipoTourService(tipoTourRepo, sedeRepo)
		galeriaTourService := servicios.NewGaleriaTourService(galeriaTourRepo, tipoTourRepo)

		paquetePasajesService := servicios.NewPaquetePasajesService(paquetePasajesRepo, sedeRepo, tipoTourRepo)

		horarioTourService := servicios.NewHorarioTourService(horarioTourRepo, tipoTourRepo, sedeRepo)
		horarioChoferService := servicios.NewHorarioChoferService(horarioChoferRepo, usuarioRepo, sedeRepo)

		// 🔧 LÍNEA CORREGIDA - Verifica el orden de parámetros en tu constructor TourProgramadoService
		tourProgramadoService := servicios.NewTourProgramadoService(
			tourProgramadoRepo,
			tipoTourRepo,
			embarcacionRepo,
			horarioTourRepo,
			sedeRepo,
			usuarioRepo, // *repositorios.UsuarioRepository <- FALTA ESTE
		)

		metodoPagoService := servicios.NewMetodoPagoService(metodoPagoRepo, sedeRepo)
		tipoPasajeService := servicios.NewTipoPasajeService(tipoPasajeRepo, sedeRepo, tipoTourRepo)
		canalVentaService := servicios.NewCanalVentaService(canalVentaRepo, sedeRepo)
		clienteService := servicios.NewClienteService(clienteRepo, cfg)
		mercadoPagoService := servicios.NewMercadoPagoService()

		// Servicios de reserva
		reservaService := servicios.NewReservaService(
			db,
			reservaRepo,
			clienteRepo,
			instanciaTourRepo,
			tipoPasajeRepo,
			paquetePasajesRepo,
			usuarioRepo,
		)

		// Servicios de pago
		pagoService := servicios.NewPagoService(
			pagoRepo,
			reservaRepo,
			sedeRepo,
		)

		// Servicios de comprobante de pago
		comprobantePagoService := servicios.NewComprobantePagoService(
			comprobantePagoRepo,
			reservaRepo,
			pagoRepo,
			sedeRepo,
		)
		instanciaTourService := servicios.NewInstanciaTourService(instanciaTourRepo)
		// AGREGAR ESTA LÍNEA:
		dashboardService := servicios.NewDashboardService(
			usuarioRepo,
			sedeRepo,
			reservaRepo,
			tourProgramadoRepo,
			clienteRepo,
			pagoRepo,
			instanciaTourRepo,
			tipoTourRepo,
			embarcacionRepo,
			db,
		)
		// Iniciar job de limpieza (cada 1 hora)
		cleanupJob := jobs.NewCleanupJob(reservaService, 1)
		cleanupJob.Start()

		// Middleware global para agregar la configuración al contexto
		router.Use(func(c *gin.Context) {
			c.Set("config", cfg)
			c.Next()
		})

		// Inicializar controladores
		authController := controladores.NewAuthController(authService)
		usuarioController := controladores.NewUsuarioController(usuarioService)
		idiomaController := controladores.NewIdiomaController(idiomaService)
		usuarioIdiomaController := controladores.NewUsuarioIdiomaController(usuarioIdiomaService) // Nuevo controlador
		embarcacionController := controladores.NewEmbarcacionController(embarcacionService)
		tipoTourController := controladores.NewTipoTourController(tipoTourService)
		galeriaTourController := controladores.NewGaleriaTourController(galeriaTourService)

		horarioTourController := controladores.NewHorarioTourController(horarioTourService)
		horarioChoferController := controladores.NewHorarioChoferController(horarioChoferService)
		tourProgramadoController := controladores.NewTourProgramadoController(tourProgramadoService)
		metodoPagoController := controladores.NewMetodoPagoController(metodoPagoService)
		tipoPasajeController := controladores.NewTipoPasajeController(tipoPasajeService)
		paquetePasajesController := controladores.NewPaquetePasajesController(paquetePasajesService)

		canalVentaController := controladores.NewCanalVentaController(canalVentaService)
		sedeController := controladores.NewSedeController(sedeService)
		clienteController := controladores.NewClienteController(clienteService, cfg)
		reservaController := controladores.NewReservaController(reservaService, mercadoPagoService)
		pagoController := controladores.NewPagoController(pagoService)
		comprobantePagoController := controladores.NewComprobantePagoController(comprobantePagoService)
		instanciaTourController := controladores.NewInstanciaTourController(instanciaTourService)
		mercadoPagoController := controladores.NewMercadoPagoController(
			mercadoPagoService,
			pagoService,
			reservaService,
			clienteService)

		recuperacionController := initRecuperacionContrasena(db, usuarioRepo, clienteRepo)
		dashboardController := controladores.NewDashboardController(dashboardService)

		// Configurar rutas
		rutas.SetupRoutes(
			router,
			cfg,
			authController,
			usuarioController,
			idiomaController,
			usuarioIdiomaController,
			embarcacionController,
			tipoTourController,
			galeriaTourController, // Añadir el nuevo controlador aquí

			horarioTourController,
			horarioChoferController,
			tourProgramadoController,
			tipoPasajeController,
			paquetePasajesController, // Nuevo controlador
			metodoPagoController,
			canalVentaController,
			clienteController,
			reservaController,
			pagoController,
			comprobantePagoController,
			sedeController,
			instanciaTourController, // Agregar el nuevo controlador aquí
			mercadoPagoController,   // Añadido aquí
			recuperacionController,  // Añadido el controlador de recuperación
			dashboardController,     // AGREGAR ESTA LÍNEA
			reservaService,
			clienteService,
			mercadoPagoService,
		)

		// Iniciar servidor
		serverAddr := fmt.Sprintf("%s:%s", cfg.ServerHost, cfg.ServerPort)
		log.Printf("🚀 Servidor iniciado en %s (entorno: %s)", serverAddr, cfg.Env)
		if err := router.Run(serverAddr); err != nil {
			log.Fatalf("❌ Error al iniciar servidor: %v", err)
		}
	}

// ✅ Función de conexión mejorada

	func connectDBWithRetry(cfg *config.Config) (*sql.DB, error) {
		dsn := fmt.Sprintf(
			"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
			cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode,
		)

		if cfg.Env != "production" {
			log.Printf("🔗 DSN: %s", dsn)
		} else {
			log.Printf("🔗 Conectando a: %s:%s/%s", cfg.DBHost, cfg.DBPort, cfg.DBName)
		}

		var db *sql.DB
		var err error
		maxRetries := 10
		retryInterval := 5 * time.Second

		for i := 0; i < maxRetries; i++ {
			log.Printf("🔄 Conectando a DB (intento %d/%d)...", i+1, maxRetries)

			db, err = sql.Open("postgres", dsn)
			if err != nil {
				log.Printf("❌ Error al abrir conexión: %v. Reintentando en %s...", err, retryInterval)
				time.Sleep(retryInterval)
				continue
			}

			// Configurar pool de conexiones
			db.SetMaxOpenConns(25)
			db.SetMaxIdleConns(5)
			db.SetConnMaxLifetime(5 * time.Minute)

			err = db.Ping()
			if err == nil {
				log.Println("✅ Conexión exitosa a la base de datos")
				return db, nil
			}

			log.Printf("❌ Error al verificar conexión: %v. Reintentando en %s...", err, retryInterval)
			db.Close()
			time.Sleep(retryInterval)
		}

		return nil, fmt.Errorf("❌ No se pudo conectar a la base de datos después de %d intentos: %v", maxRetries, err)
	}

// ✅ Migraciones mejoradas

	func runMigrations(db *sql.DB) error {
		var existsSede bool
		err := db.QueryRow("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sede')").Scan(&existsSede)
		if err != nil {
			return fmt.Errorf("error al verificar tabla sede: %v", err)
		}

		if !existsSede {
			log.Println("📋 Ejecutando migraciones iniciales...")

			migrationPath := "./migrations/crear_tablas.sql"
			if _, err := os.Stat(migrationPath); os.IsNotExist(err) {
				migrationPath = "/app/migrations/crear_tablas.sql"
			}

			migrationFile, err := os.ReadFile(migrationPath)
			if err != nil {
				return fmt.Errorf("error al leer archivo de migración: %v", err)
			}

			_, err = db.Exec(string(migrationFile))
			if err != nil {
				return fmt.Errorf("error al ejecutar migraciones: %v", err)
			}

			log.Println("✅ Migraciones iniciales completadas")
		} else {
			log.Println("ℹ️ Base de datos ya inicializada, saltando migraciones")
		}

		return nil
	}
*/
package main

import (
	"database/sql"
	"fmt"
	"log"
	"sistema-toursseft/internal/config"
	"sistema-toursseft/internal/controladores"
	"sistema-toursseft/internal/jobs"
	"sistema-toursseft/internal/repositorios"
	"sistema-toursseft/internal/rutas"
	"sistema-toursseft/internal/servicios"
	"sistema-toursseft/internal/utils"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func initRecuperacionContrasena(db *sql.DB, usuarioRepo *repositorios.UsuarioRepository, clienteRepo *repositorios.ClienteRepository) *controladores.RecuperacionContrasenaController {
	emailService, err := servicios.NewEmailService()
	if err != nil {
		log.Fatalf("Error al inicializar el servicio de email: %v", err)
	}

	recuperacionRepo := repositorios.NewRecuperacionContrasenaRepository(db)
	recuperacionService := servicios.NewRecuperacionContrasenaService(
		usuarioRepo,
		clienteRepo,
		recuperacionRepo,
		emailService,
	)

	return controladores.NewRecuperacionContrasenaController(recuperacionService)
}

func main() {
	// Cargar configuración
	cfg := config.LoadConfig()

	// ✅ Inicializar sistema de encriptación
	encryptionKey := cfg.EncryptionKey
	if encryptionKey == "" {
		log.Fatal("❌ ENCRYPTION_KEY no está configurada en las variables de entorno")
	}

	if len(encryptionKey) != 32 {
		log.Fatalf("❌ ENCRYPTION_KEY debe ser de 32 caracteres, tiene %d", len(encryptionKey))
	}

	if err := utils.InitCrypto(encryptionKey); err != nil {
		log.Fatalf("❌ Error al inicializar encriptación: %v", err)
	}
	log.Println("✅ Sistema de encriptación inicializado")

	// Configurar modo de Gin según entorno
	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Inicializar router
	router := gin.Default()

	// Middleware de recuperación y logging
	router.Use(gin.Recovery())
	router.Use(gin.Logger())

	// ✅ CORS configurado para recibir desde múltiples dominios
	corsConfig := cors.Config{
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Content-Length",
			"Accept",
			"Authorization",
			"X-Requested-With",
			"X-CSRF-Token",
		},
		ExposeHeaders:    []string{"Content-Length", "Content-Type", "Authorization", "Set-Cookie"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
		AllowWildcard:    true,
		AllowWebSockets:  true,
	}

	// Configurar orígenes según el entorno
	if cfg.Env == "production" {
		corsConfig.AllowOrigins = []string{
			"https://admin.angelproyect.com",
			"https://www.admin.angelproyect.com",
			"https://reservas.angelproyect.com",
			"https://www.reservas.angelproyect.com",
		}
		log.Println("✅ CORS configurado para producción")
	} else {
		corsConfig.AllowOrigins = []string{
			"http://localhost:5173",
			"http://127.0.0.1:5173",
			"https://localhost:5173",
			"http://localhost:5174",
			"http://127.0.0.1:5174",
			"https://localhost:5174",
		}
		log.Println("ℹ️ CORS configurado para desarrollo")
	}

	router.Use(cors.New(corsConfig))

	// Health checks
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":    "ok",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
			"version":   "1.0.0",
			"service":   "sistema-tours-api",
			"env":       cfg.Env,
			"cors":      corsConfig.AllowOrigins,
		})
	})

	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"api":     "sistema-tours",
			"version": "1.0.0",
		})
	})

	utils.InitValidator()

	// Conectar a la base de datos con reintentos
	db, err := connectDBWithRetry(cfg)
	if err != nil {
		log.Fatalf("❌ Error al conectar a la base de datos: %v", err)
	}
	defer db.Close()

	// ✅ NO ejecutar migraciones (BD ya configurada manualmente)
	log.Println("ℹ️ Base de datos lista (sin migraciones automáticas)")

	// Inicializar repositorios
	usuarioRepo := repositorios.NewUsuarioRepository(db)
	idiomaRepo := repositorios.NewIdiomaRepository(db)
	embarcacionRepo := repositorios.NewEmbarcacionRepository(db)
	usuarioIdiomaRepo := repositorios.NewUsuarioIdiomaRepository(db)
	sedeRepo := repositorios.NewSedeRepository(db)
	tipoTourRepo := repositorios.NewTipoTourRepository(db)
	galeriaTourRepo := repositorios.NewGaleriaTourRepo(db)
	horarioTourRepo := repositorios.NewHorarioTourRepository(db)
	horarioChoferRepo := repositorios.NewHorarioChoferRepository(db)
	tourProgramadoRepo := repositorios.NewTourProgramadoRepository(db)
	metodoPagoRepo := repositorios.NewMetodoPagoRepository(db)
	tipoPasajeRepo := repositorios.NewTipoPasajeRepository(db)
	paquetePasajesRepo := repositorios.NewPaquetePasajesRepository(db)
	canalVentaRepo := repositorios.NewCanalVentaRepository(db)
	clienteRepo := repositorios.NewClienteRepository(db)
	reservaRepo := repositorios.NewReservaRepository(db)
	pagoRepo := repositorios.NewPagoRepository(db)
	comprobantePagoRepo := repositorios.NewComprobantePagoRepository(db)
	instanciaTourRepo := repositorios.NewInstanciaTourRepository(db)

	// Inicializar servicios
	authService := servicios.NewAuthService(usuarioRepo, sedeRepo, cfg)
	usuarioService := servicios.NewUsuarioService(usuarioRepo, usuarioIdiomaRepo)
	usuarioIdiomaService := servicios.NewUsuarioIdiomaService(usuarioIdiomaRepo, idiomaRepo, usuarioRepo)
	idiomaService := servicios.NewIdiomaService(idiomaRepo)
	sedeService := servicios.NewSedeService(sedeRepo)
	embarcacionService := servicios.NewEmbarcacionService(embarcacionRepo, sedeRepo)
	tipoTourService := servicios.NewTipoTourService(tipoTourRepo, sedeRepo)
	galeriaTourService := servicios.NewGaleriaTourService(galeriaTourRepo, tipoTourRepo)
	paquetePasajesService := servicios.NewPaquetePasajesService(paquetePasajesRepo, sedeRepo, tipoTourRepo)
	horarioTourService := servicios.NewHorarioTourService(horarioTourRepo, tipoTourRepo, sedeRepo)
	horarioChoferService := servicios.NewHorarioChoferService(horarioChoferRepo, usuarioRepo, sedeRepo)
	tourProgramadoService := servicios.NewTourProgramadoService(
		tourProgramadoRepo,
		tipoTourRepo,
		embarcacionRepo,
		horarioTourRepo,
		sedeRepo,
		usuarioRepo,
	)
	metodoPagoService := servicios.NewMetodoPagoService(metodoPagoRepo, sedeRepo)
	tipoPasajeService := servicios.NewTipoPasajeService(tipoPasajeRepo, sedeRepo, tipoTourRepo)
	canalVentaService := servicios.NewCanalVentaService(canalVentaRepo, sedeRepo)
	clienteService := servicios.NewClienteService(clienteRepo, cfg)
	mercadoPagoService := servicios.NewMercadoPagoService()
	reservaService := servicios.NewReservaService(
		db,
		reservaRepo,
		clienteRepo,
		instanciaTourRepo,
		tipoPasajeRepo,
		paquetePasajesRepo,
		usuarioRepo,
	)
	pagoService := servicios.NewPagoService(pagoRepo, reservaRepo, sedeRepo)
	comprobantePagoService := servicios.NewComprobantePagoService(
		comprobantePagoRepo,
		reservaRepo,
		pagoRepo,
		sedeRepo,
	)
	instanciaTourService := servicios.NewInstanciaTourService(instanciaTourRepo)
	dashboardService := servicios.NewDashboardService(
		usuarioRepo,
		sedeRepo,
		reservaRepo,
		tourProgramadoRepo,
		clienteRepo,
		pagoRepo,
		instanciaTourRepo,
		tipoTourRepo,
		embarcacionRepo,
		db,
	)

	// Iniciar job de limpieza
	cleanupJob := jobs.NewCleanupJob(reservaService, 1)
	cleanupJob.Start()

	// Middleware global
	router.Use(func(c *gin.Context) {
		c.Set("config", cfg)
		c.Next()
	})

	// Inicializar controladores
	authController := controladores.NewAuthController(authService)
	usuarioController := controladores.NewUsuarioController(usuarioService)
	idiomaController := controladores.NewIdiomaController(idiomaService)
	usuarioIdiomaController := controladores.NewUsuarioIdiomaController(usuarioIdiomaService)
	embarcacionController := controladores.NewEmbarcacionController(embarcacionService)
	tipoTourController := controladores.NewTipoTourController(tipoTourService)
	galeriaTourController := controladores.NewGaleriaTourController(galeriaTourService)
	horarioTourController := controladores.NewHorarioTourController(horarioTourService)
	horarioChoferController := controladores.NewHorarioChoferController(horarioChoferService)
	tourProgramadoController := controladores.NewTourProgramadoController(tourProgramadoService)
	metodoPagoController := controladores.NewMetodoPagoController(metodoPagoService)
	tipoPasajeController := controladores.NewTipoPasajeController(tipoPasajeService)
	paquetePasajesController := controladores.NewPaquetePasajesController(paquetePasajesService)
	canalVentaController := controladores.NewCanalVentaController(canalVentaService)
	sedeController := controladores.NewSedeController(sedeService)
	clienteController := controladores.NewClienteController(clienteService, cfg)
	reservaController := controladores.NewReservaController(reservaService, mercadoPagoService)
	pagoController := controladores.NewPagoController(pagoService)
	comprobantePagoController := controladores.NewComprobantePagoController(comprobantePagoService)
	instanciaTourController := controladores.NewInstanciaTourController(instanciaTourService)
	mercadoPagoController := controladores.NewMercadoPagoController(
		mercadoPagoService,
		pagoService,
		reservaService,
		clienteService)
	recuperacionController := initRecuperacionContrasena(db, usuarioRepo, clienteRepo)
	dashboardController := controladores.NewDashboardController(dashboardService)

	// Configurar rutas
	rutas.SetupRoutes(
		router,
		cfg,
		authController,
		usuarioController,
		idiomaController,
		usuarioIdiomaController,
		embarcacionController,
		tipoTourController,
		galeriaTourController,
		horarioTourController,
		horarioChoferController,
		tourProgramadoController,
		tipoPasajeController,
		paquetePasajesController,
		metodoPagoController,
		canalVentaController,
		clienteController,
		reservaController,
		pagoController,
		comprobantePagoController,
		sedeController,
		instanciaTourController,
		mercadoPagoController,
		recuperacionController,
		dashboardController,
		reservaService,
		clienteService,
		mercadoPagoService,
	)

	// Iniciar servidor
	serverAddr := fmt.Sprintf("%s:%s", cfg.ServerHost, cfg.ServerPort)
	log.Printf("🚀 Servidor iniciado en %s (entorno: %s)", serverAddr, cfg.Env)
	if err := router.Run(serverAddr); err != nil {
		log.Fatalf("❌ Error al iniciar servidor: %v", err)
	}
}

// connectDBWithRetry conecta a la base de datos con reintentos
func connectDBWithRetry(cfg *config.Config) (*sql.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode,
	)

	if cfg.Env != "production" {
		log.Printf("🔗 DSN:  %s", dsn)
	} else {
		log.Printf("🔗 Conectando a:  %s:%s/%s", cfg.DBHost, cfg.DBPort, cfg.DBName)
	}

	var db *sql.DB
	var err error
	maxRetries := 10
	retryInterval := 5 * time.Second

	for i := 0; i < maxRetries; i++ {
		log.Printf("🔄 Conectando a DB (intento %d/%d)...", i+1, maxRetries)

		db, err = sql.Open("postgres", dsn)
		if err != nil {
			log.Printf("❌ Error al abrir conexión: %v.  Reintentando en %s.. .", err, retryInterval)
			time.Sleep(retryInterval)
			continue
		}

		// Configurar pool de conexiones
		db.SetMaxOpenConns(25)
		db.SetMaxIdleConns(5)
		db.SetConnMaxLifetime(5 * time.Minute)

		err = db.Ping()
		if err == nil {
			log.Println("✅ Conexión exitosa a la base de datos")
			return db, nil
		}

		log.Printf("❌ Error al verificar conexión: %v.  Reintentando en %s.. .", err, retryInterval)
		db.Close()
		time.Sleep(retryInterval)
	}

	return nil, fmt.Errorf("❌ No se pudo conectar a la base de datos después de %d intentos:  %v", maxRetries, err)
}
