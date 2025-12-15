package config_test

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
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

func TestUsuario_CRUD_Completo_PostgreSQL_Temporal(t *testing.T) {
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

	// === SCHEMA COMPLETO (PEGA TODO TU SQL AQUÍ) ===
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

	// === FIXTURES ===
	var idSede, idUsuario int

	// 1. Sede (necesaria para usuarios no ADMIN)
	// 1. Sede
	err = pool.QueryRow(context.Background(), `INSERT INTO sede (nombre, direccion, distrito, pais) VALUES ('Sede Central', 'Av. Test', 'Central', 'Perú') RETURNING id_sede`).Scan(&idSede)
	require.NoError(t, err)
	t.Logf("✅ Sede creada con ID: %d", idSede)

	// === REPOS Y SERVICIO ===
	usuarioRepo := repositorios.NewUsuarioRepository(sqlDB)
	usuarioIdiomaRepo := repositorios.NewUsuarioIdiomaRepository(sqlDB) // Asegúrate de tenerlo

	servicio := servicios.NewUsuarioService(usuarioRepo, usuarioIdiomaRepo)
	controlador := controladores.NewUsuarioController(servicio)

	router := gin.New()
	api := router.Group("/api")
	{
		api.POST("/usuarios", controlador.Create)
		api.GET("/usuarios/:id", controlador.GetByID)
		api.PUT("/usuarios/:id", controlador.Update)
		api.DELETE("/usuarios/:id", controlador.Delete)
		api.POST("/usuarios/:id/restore", controlador.Restore)
		api.GET("/usuarios", controlador.List)
		api.GET("/usuarios/eliminados", controlador.ListDeleted)
		api.GET("/usuarios/rol/:rol", controlador.ListByRol)
	}

	// === 1. CREAR USUARIO ===
	nuevoUsuario := entidades.NuevoUsuarioRequest{
		IdSede:          &idSede,
		Nombres:         "María",
		Apellidos:       "López",
		Correo:          "maria.lopez@test.com",
		Telefono:        "987654321",
		Direccion:       "Calle Falsa 123",
		FechaNacimiento: time.Date(1985, 8, 20, 0, 0, 0, 0, time.UTC),
		Rol:             "VENDEDOR",
		Nacionalidad:    "Peruana",
		TipoDocumento:   "DNI",
		NumeroDocumento: "76543210",
		Contrasena:      "securepass123",
	}

	body, _ := json.Marshal(nuevoUsuario)
	req := httptest.NewRequest(http.MethodPost, "/api/usuarios", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code, "Falló creación: %s", w.Body.String())

	var respCreate struct {
		Data struct {
			ID int `json:"id"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respCreate))
	idUsuario = respCreate.Data.ID
	require.NotZero(t, idUsuario)
	t.Logf("🎉 USUARIO CREADO CON ID: %d", idUsuario)

	// === 2. OBTENER POR ID ===
	url := fmt.Sprintf("/api/usuarios/%d", idUsuario)
	req = httptest.NewRequest(http.MethodGet, url, nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var respGet struct {
		Data *entidades.Usuario `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respGet))
	assert.Equal(t, idUsuario, respGet.Data.ID)
	assert.Equal(t, "María", respGet.Data.Nombres)
	assert.Equal(t, "VENDEDOR", respGet.Data.Rol)
	t.Log("✅ Usuario obtenido por ID")

	// === 3. LISTAR ACTIVOS ===
	req = httptest.NewRequest(http.MethodGet, "/api/usuarios", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var respList struct {
		Data []*entidades.Usuario `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respList))
	assert.GreaterOrEqual(t, len(respList.Data), 1)
	t.Logf("✅ Listados %d usuarios activos", len(respList.Data))

	// === 4. LISTAR POR ROL ===
	req = httptest.NewRequest(http.MethodGet, "/api/usuarios/rol/VENDEDOR", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respList))
	assert.GreaterOrEqual(t, len(respList.Data), 1)
	t.Log("✅ Listado por rol VENDEDOR")

	// === 5. ACTUALIZAR ===
	usuarioActualizado := entidades.Usuario{
		ID:              idUsuario,
		IdSede:          &idSede,
		Nombres:         "María Actualizada",
		Apellidos:       "López Modificada",
		Correo:          "maria.nueva@test.com",
		Telefono:        "999888777",
		Rol:             "VENDEDOR",
		TipoDocumento:   "DNI",
		NumeroDocumento: "76543210",
	}

	body, _ = json.Marshal(usuarioActualizado)
	req = httptest.NewRequest(http.MethodPut, fmt.Sprintf("/api/usuarios/%d", idUsuario), bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	t.Log("✅ Usuario actualizado")

	// Verificar actualización
	req = httptest.NewRequest(http.MethodGet, fmt.Sprintf("/api/usuarios/%d", idUsuario), nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respGet))
	assert.Equal(t, "María Actualizada", respGet.Data.Nombres)
	assert.Equal(t, "maria.nueva@test.com", respGet.Data.Correo)

	// === 6. SOFT DELETE ===
	req = httptest.NewRequest(http.MethodDelete, fmt.Sprintf("/api/usuarios/%d", idUsuario), nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	t.Log("✅ Usuario eliminado lógicamente")

	// === 7. LISTAR ELIMINADOS ===
	req = httptest.NewRequest(http.MethodGet, "/api/usuarios/eliminados", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respList))
	assert.GreaterOrEqual(t, len(respList.Data), 1)
	assert.Equal(t, idUsuario, respList.Data[0].ID)
	t.Log("✅ Usuario en lista de eliminados")

	// === 8. RESTAURAR ===
	req = httptest.NewRequest(http.MethodPost, fmt.Sprintf("/api/usuarios/%d/restore", idUsuario), nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	t.Log("✅ Usuario restaurado")

	// Verificar restauración
	req = httptest.NewRequest(http.MethodGet, "/api/usuarios", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &respList))
	found := false
	for _, u := range respList.Data {
		if u.ID == idUsuario {
			found = true
			break
		}
	}
	assert.True(t, found, "Usuario restaurado debe aparecer en activos")

	t.Log("🚀🚀🚀 TEST DE INTEGRACIÓN USUARIOS COMPLETO PASADO CON ÉXITO 🚀🚀🚀")
}
