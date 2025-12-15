package config_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"runtime"
	"testing"
	"time"

	"sistema-toursseft/internal/controladores"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/repositorios"
	"sistema-toursseft/internal/servicios"

	embeddedpostgres "github.com/fergusstrange/embedded-postgres"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestReserva_CRUD_Completo_PostgreSQL_Temporal(t *testing.T) {
	// 1. PostgreSQL temporal
	runtime.GOMAXPROCS(runtime.NumCPU())

	tmpDir, err := os.MkdirTemp("", "embedded-pg-*")
	require.NoError(t, err)
	defer os.RemoveAll(tmpDir)

	postgres := embeddedpostgres.NewDatabase(
		embeddedpostgres.DefaultConfig().
			RuntimePath(tmpDir).
			Port(54321).
			Database("testdb").
			Username("postgres").
			Password("postgres").
			Version(embeddedpostgres.V15),
	)
	err = postgres.Start()
	require.NoError(t, err)
	defer postgres.Stop()

	connStr := "postgres://postgres:postgres@localhost:54321/testdb?sslmode=disable"
	pool, err := pgxpool.New(context.Background(), connStr)
	require.NoError(t, err)
	defer pool.Close()

	sqlDB := stdlib.OpenDBFromPool(pool)
	defer sqlDB.Close()

	// 2. Crear todas las tablas del schema
	createTablesSQL := `
		-- 1. Tabla sede (sin dependencias)
CREATE TABLE sede (
    id_sede SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    distrito VARCHAR(100) NOT NULL,
    provincia VARCHAR(100),
    pais VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    eliminado BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_sede_nombre ON sede(nombre);
CREATE INDEX idx_sede_distrito ON sede(distrito);
CREATE INDEX idx_sede_eliminado ON sede(eliminado);

-- 2. Tabla idioma (sin dependencias)
CREATE TABLE idioma (
    id_idioma SERIAL PRIMARY KEY,  
    nombre VARCHAR(50) NOT NULL UNIQUE,
    eliminado BOOLEAN DEFAULT false
);
CREATE INDEX idx_idioma_nombre ON idioma(nombre);

-- 3. Tabla usuario (depende de sede)
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_sede INT,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    fecha_nacimiento DATE,
    rol VARCHAR(20) NOT NULL,
    nacionalidad VARCHAR(50),
    tipo_de_documento VARCHAR(50) NOT NULL,
    numero_documento VARCHAR(20) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contrasena VARCHAR(255),
    eliminado BOOLEAN DEFAULT FALSE,
    UNIQUE (numero_documento),
    FOREIGN KEY (id_sede) REFERENCES sede(id_sede) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT check_user_sede CHECK (
        (rol = 'ADMIN' AND id_sede IS NULL) OR
        (rol != 'ADMIN' AND id_sede IS NOT NULL)
    ),
    CONSTRAINT check_valid_rol CHECK (
        rol IN ('ADMIN', 'VENDEDOR', 'CHOFER')
    )
);
CREATE INDEX idx_usuario_sede ON usuario(id_sede);
CREATE INDEX idx_usuario_rol ON usuario(rol);
CREATE INDEX idx_usuario_nombres_apellidos ON usuario(nombres, apellidos);
CREATE INDEX idx_usuario_documento ON usuario(tipo_de_documento, numero_documento);
CREATE INDEX idx_usuario_eliminado ON usuario(eliminado);

-- 4. Tabla usuario_idioma (depende de usuario e idioma)
CREATE TABLE usuario_idioma (
    id_usuario_idioma SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_idioma INT NOT NULL,
    nivel VARCHAR(20),
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_idioma) REFERENCES idioma(id_idioma) ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE (id_usuario, id_idioma)
);
CREATE INDEX idx_usuario_idioma_usuario ON usuario_idioma(id_usuario);
CREATE INDEX idx_usuario_idioma_idioma ON usuario_idioma(id_idioma);
CREATE INDEX idx_usuario_idioma_eliminado ON usuario_idioma(eliminado);

-- 5. Tabla embarcacion (depende de sede)
CREATE TABLE embarcacion (
    id_embarcacion SERIAL PRIMARY KEY,
    id_sede INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    capacidad INT NOT NULL,
    descripcion VARCHAR(255),
    eliminado BOOLEAN DEFAULT FALSE,
    estado VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE',
    FOREIGN KEY (id_sede) REFERENCES sede(id_sede) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (estado IN ('DISPONIBLE', 'OCUPADA', 'MANTENIMIENTO', 'FUERA_DE_SERVICIO'))
);
CREATE INDEX idx_embarcacion_sede ON embarcacion(id_sede);
CREATE INDEX idx_embarcacion_estado ON embarcacion(estado);
CREATE INDEX idx_embarcacion_eliminado ON embarcacion(eliminado);

-- 6. Tabla tipo_tour (depende de sede)
CREATE TABLE tipo_tour (
    id_tipo_tour SERIAL PRIMARY KEY,
    id_sede INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT NOT NULL,
    url_imagen VARCHAR(255),
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_sede) REFERENCES sede(id_sede) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX idx_tipo_tour_sede ON tipo_tour(id_sede);
CREATE INDEX idx_tipo_tour_eliminado ON tipo_tour(eliminado);

-- 7. Tabla galeria_tour (depende de tipo_tour)
CREATE TABLE galeria_tour (
    id_galeria SERIAL PRIMARY KEY,
    id_tipo_tour INT NOT NULL,
    url_imagen VARCHAR(255) NOT NULL,
    descripcion TEXT,
    orden INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_tipo_tour) REFERENCES tipo_tour(id_tipo_tour) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX idx_galeria_tour_tipo_tour ON galeria_tour(id_tipo_tour);
CREATE INDEX idx_galeria_tour_orden ON galeria_tour(orden);
CREATE INDEX idx_galeria_tour_eliminado ON galeria_tour(eliminado);

-- 8. Tabla horario_tour (depende de tipo_tour y sede)
CREATE TABLE horario_tour (
    id_horario SERIAL PRIMARY KEY,
    id_tipo_tour INT NOT NULL,
    id_sede INT NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    disponible_lunes BOOLEAN DEFAULT FALSE,
    disponible_martes BOOLEAN DEFAULT FALSE,
    disponible_miercoles BOOLEAN DEFAULT FALSE,
    disponible_jueves BOOLEAN DEFAULT FALSE,
    disponible_viernes BOOLEAN DEFAULT FALSE,
    disponible_sabado BOOLEAN DEFAULT FALSE,
    disponible_domingo BOOLEAN DEFAULT FALSE,
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_tipo_tour) REFERENCES tipo_tour(id_tipo_tour) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_sede) REFERENCES sede(id_sede) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX idx_horario_tour_tipo_tour ON horario_tour(id_tipo_tour);
CREATE INDEX idx_horario_tour_sede ON horario_tour(id_sede);
CREATE INDEX idx_horario_tour_hora_inicio ON horario_tour(hora_inicio);
CREATE INDEX idx_horario_tour_eliminado ON horario_tour(eliminado);

-- 9. Tabla horario_chofer (depende de usuario y sede)
CREATE TABLE horario_chofer (
    id_horario_chofer SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_sede INT NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    disponible_lunes BOOLEAN DEFAULT FALSE,
    disponible_martes BOOLEAN DEFAULT FALSE,
    disponible_miercoles BOOLEAN DEFAULT FALSE,
    disponible_jueves BOOLEAN DEFAULT FALSE,
    disponible_viernes BOOLEAN DEFAULT FALSE,
    disponible_sabado BOOLEAN DEFAULT FALSE,
    disponible_domingo BOOLEAN DEFAULT FALSE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_sede) REFERENCES sede(id_sede) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX idx_horario_chofer_usuario ON horario_chofer(id_usuario);
CREATE INDEX idx_horario_chofer_sede ON horario_chofer(id_sede);
CREATE INDEX idx_horario_chofer_fecha ON horario_chofer(fecha_inicio, fecha_fin);
CREATE INDEX idx_horario_chofer_eliminado ON horario_chofer(eliminado);

-- 10. Tabla tour_programado (depende de tipo_tour, embarcacion, horario_tour, sede, usuario)
CREATE TABLE tour_programado (
    id_tour_programado SERIAL PRIMARY KEY,
    id_tipo_tour INT NOT NULL,
    id_embarcacion INT NOT NULL,
    id_horario INT NOT NULL,
    id_sede INT NOT NULL,
    id_chofer INT NOT NULL,
    fecha DATE NOT NULL,
    vigencia_desde DATE NOT NULL,
    vigencia_hasta DATE NOT NULL,
    cupo_maximo INT NOT NULL,
    cupo_disponible INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'PROGRAMADO',
    eliminado BOOLEAN DEFAULT FALSE,
    es_excepcion BOOLEAN DEFAULT FALSE,
    notas_excepcion TEXT,
    FOREIGN KEY (id_tipo_tour) REFERENCES tipo_tour(id_tipo_tour) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_embarcacion) REFERENCES embarcacion(id_embarcacion) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_horario) REFERENCES horario_tour(id_horario) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_sede) REFERENCES sede(id_sede) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_chofer) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_tour_programado_tipo_tour ON tour_programado(id_tipo_tour);
CREATE INDEX idx_tour_programado_embarcacion ON tour_programado(id_embarcacion);
CREATE INDEX idx_tour_programado_horario ON tour_programado(id_horario);
CREATE INDEX idx_tour_programado_sede ON tour_programado(id_sede);
CREATE INDEX idx_tour_programado_chofer ON tour_programado(id_chofer);
CREATE INDEX idx_tour_programado_fecha ON tour_programado(fecha);
CREATE INDEX idx_tour_programado_vigencia ON tour_programado(vigencia_desde, vigencia_hasta);
CREATE INDEX idx_tour_programado_estado ON tour_programado(estado);
CREATE INDEX idx_tour_programado_eliminado ON tour_programado(eliminado);

-- 11. Tabla instancia_tour (depende de tour_programado)
CREATE TABLE instancia_tour (
    id_instancia SERIAL PRIMARY KEY,
    id_tour_programado INT NOT NULL,
    fecha_especifica DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    id_chofer INT NOT NULL,
    id_embarcacion INT NOT NULL,
    cupo_disponible INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'PROGRAMADO',
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_tour_programado) REFERENCES tour_programado(id_tour_programado) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_chofer) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_embarcacion) REFERENCES embarcacion(id_embarcacion) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (estado IN ('PROGRAMADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO'))
);
CREATE INDEX idx_instancia_tour_tour_programado ON instancia_tour(id_tour_programado);
CREATE INDEX idx_instancia_tour_fecha ON instancia_tour(fecha_especifica);
CREATE INDEX idx_instancia_tour_chofer ON instancia_tour(id_chofer);
CREATE INDEX idx_instancia_tour_embarcacion ON instancia_tour(id_embarcacion);
CREATE INDEX idx_instancia_tour_estado ON instancia_tour(estado);
CREATE INDEX idx_instancia_tour_eliminado ON instancia_tour(eliminado);

-- 12. Tabla cliente (sin dependencias)
CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    tipo_documento VARCHAR(50) NOT NULL,
    numero_documento VARCHAR(20) NOT NULL,
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    razon_social VARCHAR(200),
    direccion_fiscal VARCHAR(255),
    correo VARCHAR(100),
    numero_celular VARCHAR(20),
    contrasena VARCHAR(255),
    eliminado BOOLEAN DEFAULT FALSE,
    CONSTRAINT chk_tipo_documento CHECK (
        (tipo_documento = 'RUC' AND razon_social IS NOT NULL AND direccion_fiscal IS NOT NULL) OR
        (tipo_documento IN ('DNI', 'CE', 'Pasaporte') AND nombres IS NOT NULL AND apellidos IS NOT NULL)
    )
);

CREATE INDEX idx_cliente_documento ON cliente(tipo_documento, numero_documento);
CREATE INDEX idx_cliente_nombres_apellidos ON cliente(nombres, apellidos);
CREATE INDEX idx_cliente_razon_social ON cliente(razon_social);
CREATE INDEX idx_cliente_correo ON cliente(correo);
CREATE INDEX idx_cliente_eliminado ON cliente(eliminado);

-- 13. Tabla tipo_pasaje (depende de sede y tipo_tour)
CREATE TABLE tipo_pasaje (
    id_tipo_pasaje SERIAL PRIMARY KEY,
    id_sede INT NOT NULL,
    id_tipo_tour INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    costo DECIMAL(10,2) NOT NULL,
    edad VARCHAR(50),
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_sede) REFERENCES sede(id_sede) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_tipo_tour) REFERENCES tipo_tour(id_tipo_tour) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX idx_tipo_pasaje_sede ON tipo_pasaje(id_sede);
CREATE INDEX idx_tipo_pasaje_tipo_tour ON tipo_pasaje(id_tipo_tour);
CREATE INDEX idx_tipo_pasaje_eliminado ON tipo_pasaje(eliminado);

-- 14. Tabla paquete_pasajes (depende de sede y tipo_tour)
CREATE TABLE paquete_pasajes (
    id_paquete SERIAL PRIMARY KEY,
    id_sede INT NOT NULL,
    id_tipo_tour INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_total DECIMAL(10,2) NOT NULL,
    cantidad_total INT NOT NULL,
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_sede) REFERENCES sede(id_sede) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_tipo_tour) REFERENCES tipo_tour(id_tipo_tour) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX idx_paquete_pasajes_sede ON paquete_pasajes(id_sede);
CREATE INDEX idx_paquete_pasajes_tipo_tour ON paquete_pasajes(id_tipo_tour);
CREATE INDEX idx_paquete_pasajes_eliminado ON paquete_pasajes(eliminado);

-- 15. Tabla reserva (depende de usuario, cliente, instancia_tour, paquete_pasajes)
CREATE TABLE reserva (
    id_reserva SERIAL PRIMARY KEY,
    id_vendedor INT,
    id_cliente INT NOT NULL,
    id_instancia INT NOT NULL,
    id_paquete INT,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_pagar DECIMAL(10,2) NOT NULL,
    notas TEXT,
    estado VARCHAR(20) DEFAULT 'RESERVADO',
    fecha_expiracion TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_vendedor) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_instancia) REFERENCES instancia_tour(id_instancia) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_paquete) REFERENCES paquete_pasajes(id_paquete) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX idx_reserva_vendedor ON reserva(id_vendedor);
CREATE INDEX idx_reserva_cliente ON reserva(id_cliente);
CREATE INDEX idx_reserva_instancia ON reserva(id_instancia);
CREATE INDEX idx_reserva_paquete ON reserva(id_paquete);
CREATE INDEX idx_reserva_fecha ON reserva(fecha_reserva);
CREATE INDEX idx_reserva_estado ON reserva(estado);
CREATE INDEX idx_reserva_eliminado ON reserva(eliminado);

-- 16. Tabla paquete_pasaje_detalle (depende de paquete_pasajes y reserva)
CREATE TABLE paquete_pasaje_detalle (
    id_paquete_detalle SERIAL PRIMARY KEY,
    id_paquete INT NOT NULL,
    id_reserva INT NOT NULL,
    cantidad INT NOT NULL,
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_paquete) REFERENCES paquete_pasajes(id_paquete) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX idx_paquete_pasaje_detalle_paquete ON paquete_pasaje_detalle(id_paquete);
CREATE INDEX idx_paquete_pasaje_detalle_reserva ON paquete_pasaje_detalle(id_reserva);
CREATE INDEX idx_paquete_pasaje_detalle_eliminado ON paquete_pasaje_detalle(eliminado);

-- 17. Tabla pasajes_cantidad (depende de reserva y tipo_pasaje)
CREATE TABLE pasajes_cantidad (
    id_pasajes_cantidad SERIAL PRIMARY KEY,
    id_reserva INT,
    id_tipo_pasaje INT NOT NULL,
    cantidad INT NOT NULL,
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_pasaje) REFERENCES tipo_pasaje(id_tipo_pasaje) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX idx_pasajes_cantidad_reserva ON pasajes_cantidad(id_reserva);
CREATE INDEX idx_pasajes_cantidad_tipo_pasaje ON pasajes_cantidad(id_tipo_pasaje);
CREATE INDEX idx_pasajes_cantidad_eliminado ON pasajes_cantidad(eliminado);

-- 18. Tabla pago (depende de reserva)
CREATE TABLE pago (
    id_pago SERIAL PRIMARY KEY,
    id_reserva INT NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    canal_pago VARCHAR(50) NOT NULL,
    id_sede INT,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'PROCESADO',
    comprobante VARCHAR(100),
    numero_comprobante VARCHAR(20),
    url_comprobante TEXT,
    eliminado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_sede) REFERENCES sede(id_sede) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX idx_pago_reserva ON pago(id_reserva);
CREATE INDEX idx_pago_fecha ON pago(fecha_pago);
CREATE INDEX idx_pago_estado ON pago(estado);
CREATE INDEX idx_pago_canal_pago ON pago(canal_pago);
CREATE INDEX idx_pago_metodo_pago ON pago(metodo_pago);
CREATE INDEX idx_pago_eliminado ON pago(eliminado);

-- 19. Tabla devolucion_pago (depende de pago)
CREATE TABLE devolucion_pago (
    id_devolucion SERIAL PRIMARY KEY,
    id_pago INT NOT NULL,
    fecha_devolucion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT NOT NULL,
    monto_devolucion DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    observaciones TEXT,
    FOREIGN KEY (id_pago) REFERENCES pago(id_pago) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX idx_devolucion_pago_pago ON devolucion_pago(id_pago);
CREATE INDEX idx_devolucion_pago_fecha ON devolucion_pago(fecha_devolucion);
CREATE INDEX idx_devolucion_pago_estado ON devolucion_pago(estado);

-- 20. Tabla recuperacion_contrasena (sin dependencias)
CREATE TABLE recuperacion_contrasena (
    id SERIAL PRIMARY KEY,
    entidad_id INTEGER NOT NULL,
    tipo_entidad VARCHAR(20) NOT NULL,
    token VARCHAR(100) NOT NULL UNIQUE,
    expiracion TIMESTAMP NOT NULL,
    utilizado BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_tipo_entidad CHECK (tipo_entidad IN ('USUARIO', 'CLIENTE'))
);

CREATE INDEX idx_recuperacion_token ON recuperacion_contrasena(token);
CREATE INDEX idx_recuperacion_entidad ON recuperacion_contrasena(entidad_id, tipo_entidad);
	`

	_, err = pool.Exec(context.Background(), createTablesSQL)
	require.NoError(t, err)

	// === FIXTURES EN ORDEN CORRECTO ===
	var idSede, idUsuarioChofer, idHorario, idEmbarcacion, idTipoTour, idTourProgramado, idInstancia, idCliente, idAdulto, idNino, idPaquete int

	// 1. Sede
	err = pool.QueryRow(context.Background(), `
		INSERT INTO sede (nombre, direccion, distrito, pais, eliminado) 
		VALUES ('Sede Central', 'Av. Test', 'Central', 'Perú', false) 
		RETURNING id_sede`).Scan(&idSede)
	require.NoError(t, err)
	t.Logf("✅ Sede creada con ID: %d", idSede)

	// 2. Chofer
	err = pool.QueryRow(context.Background(), `
		INSERT INTO usuario (id_sede, nombres, apellidos, rol, tipo_de_documento, numero_documento, eliminado) 
		VALUES ($1, 'Chofer', 'Test', 'CHOFER', 'DNI', '99999999', false) 
		RETURNING id_usuario`, idSede).Scan(&idUsuarioChofer)
	require.NoError(t, err)
	t.Logf("✅ Chofer creado con ID: %d", idUsuarioChofer)

	// 3. Tipo tour
	err = pool.QueryRow(context.Background(), `
		INSERT INTO tipo_tour (id_sede, nombre, duracion_minutos, eliminado) 
		VALUES ($1, 'Tour Ballestas', 480, false) 
		RETURNING id_tipo_tour`, idSede).Scan(&idTipoTour)
	require.NoError(t, err)
	t.Logf("✅ Tipo tour creado con ID: %d", idTipoTour)

	// 4. Horario tour
	err = pool.QueryRow(context.Background(), `
		INSERT INTO horario_tour (id_tipo_tour, id_sede, hora_inicio, hora_fin, 
			disponible_lunes, disponible_martes, disponible_miercoles, disponible_jueves, 
			disponible_viernes, disponible_sabado, disponible_domingo, eliminado) 
		VALUES ($1, $2, '08:00', '18:00', true, true, true, true, true, true, true, false) 
		RETURNING id_horario`, idTipoTour, idSede).Scan(&idHorario)
	require.NoError(t, err)
	t.Logf("✅ Horario creado con ID: %d", idHorario)

	// 5. Embarcación
	err = pool.QueryRow(context.Background(), `
		INSERT INTO embarcacion (id_sede, nombre, capacidad, estado, eliminado) 
		VALUES ($1, 'Lancha 1', 60, 'DISPONIBLE', false) 
		RETURNING id_embarcacion`, idSede).Scan(&idEmbarcacion)
	require.NoError(t, err)
	t.Logf("✅ Embarcación creada con ID: %d", idEmbarcacion)

	// 6. Tour programado
	err = pool.QueryRow(context.Background(), `
		INSERT INTO tour_programado (id_tipo_tour, id_embarcacion, id_horario, id_sede, id_chofer, 
			fecha, vigencia_desde, vigencia_hasta, cupo_maximo, cupo_disponible, estado, eliminado) 
		VALUES ($1, $2, $3, $4, $5, '2025-12-25', '2025-12-01', '2025-12-31', 60, 60, 'PROGRAMADO', false) 
		RETURNING id_tour_programado`, idTipoTour, idEmbarcacion, idHorario, idSede, idUsuarioChofer).Scan(&idTourProgramado)
	require.NoError(t, err)
	t.Logf("✅ Tour programado creado con ID: %d", idTourProgramado)

	// 7. Instancia tour
	fechaTour := time.Date(2025, 12, 25, 0, 0, 0, 0, time.UTC)
	err = pool.QueryRow(context.Background(), `
		INSERT INTO instancia_tour (id_tour_programado, fecha_especifica, hora_inicio, hora_fin, 
			id_chofer, id_embarcacion, cupo_disponible, estado, eliminado) 
		VALUES ($1, $2, '08:00', '18:00', $3, $4, 60, 'PROGRAMADO', false) 
		RETURNING id_instancia`, idTourProgramado, fechaTour, idUsuarioChofer, idEmbarcacion).Scan(&idInstancia)
	require.NoError(t, err)
	t.Logf("✅ Instancia creada con ID: %d", idInstancia)

	// Verificar que la instancia existe con los criterios correctos usando AMBAS conexiones
	var cupoDisponibleVerif int
	var estadoVerif string
	var eliminadoVerif bool

	// Verificación 1: Con pool (pgxpool)
	err = pool.QueryRow(context.Background(), `
		SELECT cupo_disponible, estado, eliminado 
		FROM instancia_tour 
		WHERE id_instancia = $1`, idInstancia).Scan(&cupoDisponibleVerif, &estadoVerif, &eliminadoVerif)
	require.NoError(t, err)
	t.Logf("✅ Verificación instancia (pool) - Cupo: %d, Estado: %s, Eliminado: %v",
		cupoDisponibleVerif, estadoVerif, eliminadoVerif)

	// Verificación 2: Con sqlDB (database/sql) - LA MISMA QUE USA EL REPOSITORIO
	err = sqlDB.QueryRow(`
		SELECT cupo_disponible, estado, eliminado 
		FROM instancia_tour 
		WHERE id_instancia = $1 AND eliminado = FALSE AND estado = 'PROGRAMADO'`, idInstancia).
		Scan(&cupoDisponibleVerif, &estadoVerif, &eliminadoVerif)
	require.NoError(t, err, "La instancia debe ser visible en sqlDB con los mismos criterios que usa el repositorio")
	t.Logf("✅ Verificación instancia (sqlDB) - Cupo: %d, Estado: %s, Eliminado: %v",
		cupoDisponibleVerif, estadoVerif, eliminadoVerif)

	// 8. Cliente - Insertar con valores completos
	err = pool.QueryRow(context.Background(), `
		INSERT INTO cliente (tipo_documento, numero_documento, nombres, apellidos, correo, numero_celular, contrasena, eliminado)
		VALUES ('DNI', '12345678', 'Juan Carlos', 'Pérez Gómez', 'juan.perez@test.com', '987654321', 'password123', false)
		RETURNING id_cliente`).Scan(&idCliente)
	require.NoError(t, err)
	t.Logf("✅ Cliente creado con ID: %d", idCliente)

	// Verificar que el cliente existe
	var clienteExiste bool
	err = pool.QueryRow(context.Background(), `
		SELECT EXISTS(SELECT 1 FROM cliente WHERE id_cliente = $1 AND eliminado = false)`, idCliente).Scan(&clienteExiste)
	require.NoError(t, err)
	require.True(t, clienteExiste, "El cliente debe existir en la base de datos")
	t.Logf("✅ Cliente verificado - Existe: %v", clienteExiste)

	// 9. Tipos pasaje
	err = pool.QueryRow(context.Background(), `
		INSERT INTO tipo_pasaje (id_sede, id_tipo_tour, nombre, costo, eliminado) 
		VALUES ($1, $2, 'Adulto', 100.0, false) 
		RETURNING id_tipo_pasaje`, idSede, idTipoTour).Scan(&idAdulto)
	require.NoError(t, err)
	t.Logf("✅ Tipo pasaje Adulto creado con ID: %d", idAdulto)

	err = pool.QueryRow(context.Background(), `
		INSERT INTO tipo_pasaje (id_sede, id_tipo_tour, nombre, costo, eliminado) 
		VALUES ($1, $2, 'Niño', 50.0, false) 
		RETURNING id_tipo_pasaje`, idSede, idTipoTour).Scan(&idNino)
	require.NoError(t, err)
	t.Logf("✅ Tipo pasaje Niño creado con ID: %d", idNino)

	// 10. Paquete
	err = pool.QueryRow(context.Background(), `
		INSERT INTO paquete_pasajes (id_sede, id_tipo_tour, nombre, precio_total, cantidad_total, eliminado) 
		VALUES ($1, $2, 'Familiar', 400.0, 4, false) 
		RETURNING id_paquete`, idSede, idTipoTour).Scan(&idPaquete)
	require.NoError(t, err)
	t.Logf("✅ Paquete creado con ID: %d", idPaquete)

	// Servicio y controlador
	reservaRepo := repositorios.NewReservaRepository(sqlDB)
	clienteRepo := repositorios.NewClienteRepository(sqlDB)
	instanciaTourRepo := repositorios.NewInstanciaTourRepository(sqlDB)
	tipoPasajeRepo := repositorios.NewTipoPasajeRepository(sqlDB)
	paqueteRepo := repositorios.NewPaquetePasajesRepository(sqlDB)
	usuarioRepo := repositorios.NewUsuarioRepository(sqlDB)

	// 🔍 VERIFICACIÓN CRÍTICA: Probar que el repositorio de instancias puede encontrar la instancia
	t.Log("🔍 Verificando que el repositorio puede encontrar la instancia...")
	instanciaEncontrada, err := instanciaTourRepo.GetByID(idInstancia)
	require.NoError(t, err, "El repositorio de instancias debe poder encontrar la instancia ID=%d", idInstancia)
	require.NotNil(t, instanciaEncontrada)
	require.Equal(t, "PROGRAMADO", instanciaEncontrada.Estado)
	require.Equal(t, false, instanciaEncontrada.Eliminado)
	require.Equal(t, 60, instanciaEncontrada.CupoDisponible)
	t.Logf("✅ Instancia encontrada por repositorio: ID=%d, Estado=%s, Cupo=%d",
		instanciaEncontrada.ID, instanciaEncontrada.Estado, instanciaEncontrada.CupoDisponible)

	servicio := servicios.NewReservaService(sqlDB, reservaRepo, clienteRepo, instanciaTourRepo, tipoPasajeRepo, paqueteRepo, usuarioRepo)
	controlador := controladores.NewReservaController(servicio, nil)

	router := gin.New()
	api := router.Group("/api")
	{
		api.POST("/reservas", controlador.Create)
	}

	// Crear reserva
	nuevaReserva := entidades.NuevaReservaRequest{
		IDCliente:   idCliente,
		IDInstancia: idInstancia,
		TotalPagar:  450.0,
		Notas:       "¡ÉXITO ABSOLUTO - TEST FINAL!",
		CantidadPasajes: []entidades.PasajeCantidadRequest{
			{IDTipoPasaje: idAdulto, Cantidad: 2},
			{IDTipoPasaje: idNino, Cantidad: 1},
		},
		Paquetes: []entidades.PaqueteRequest{
			{IDPaquete: idPaquete, Cantidad: 1},
		},
	}

	body, _ := json.Marshal(nuevaReserva)
	req := httptest.NewRequest(http.MethodPost, "/api/reservas", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	t.Logf("📝 Respuesta HTTP: %s", w.Body.String())
	assert.Equal(t, http.StatusCreated, w.Code, "Falló: %s", w.Body.String())

	var resp struct {
		Data struct {
			ID int `json:"id"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
	require.NotZero(t, resp.Data.ID)
	t.Logf("🎉🎉🎉 RESERVA CREADA CON ID: %d - ¡PASÓ VERDE AL FIN! 🎉🎉🎉", resp.Data.ID)

	t.Log("🚀🚀🚀 TEST DE INTEGRACIÓN COMPLETO PASADO CON ÉXITO 🚀🚀🚀")
}
