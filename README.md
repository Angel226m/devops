# Sistema de Tours - Ocean Tours

Sistema de gestión integral para tours turísticos con panel administrativo, reservas online y automatización de procesos.

## Arquitectura del Proyecto

```
comleto/
├── backend/              # API REST en Go (Gin + GORM + PostgreSQL)
├── frontend/             # Panel administrativo (React + TypeScript + Vite)
├── paginawebbtour/        # Página web pública para reservas (React + TypeScript)
├── scripts/              # Scripts de automatización y backup
├── terraform/             # Infraestructura como código (AWS)
├── certs/                 # Certificados SSL
├── ssl/                   # Certificados SSL adicionales
├── backups/               # Directorio para backups locales
├── nginx.conf             # Configuración del proxy inverso Nginx
└── docker-compose.yml     # Orquestación de servicios con Docker Compose
```

## Dominios y Servicios

| Dominio | Descripción | Puerto Interno |
|---------|-------------|----------------|
| [admin.angelproyect.com](https://admin.angelproyect.com) | Panel administrativo | 3000 |
| [reservas.angelproyect.com](https://reservas.angelproyect.com) | Página pública de reservas | 3001 |
| [stream.angelproyect.com](https://stream.angelproyect.com) | Streaming en vivo (HLS) | 18889 |
| [portafolio.angelproyect.com](https://portafolio.angelproyect.com) | Portafolio web estático | 8081 |

## Stack Tecnológico

### Backend
- **Lenguaje**: Go 1.24.1
- **Framework Web**: Gin v1.11.0
- **ORM**: GORM v1.31.1
- **Base de datos**: PostgreSQL 15 ( Alpine)
- **Autenticación**: JWT (golang-jwt v4.5.2)
- **Encriptación**: AES-256-CBC + HMAC-SHA256
- **Email**: Resend API v2
- **Testing**: go-sqlmock, embedded-postgres, testify
- **Puerto**: 8080

### Frontend (Panel Administrativo)
- **Framework**: React 19.1.0
- **Lenguaje**: TypeScript 5.8.3
- **Build Tool**: Vite 6.3.5
- **Gestión de Estado**: Redux Toolkit 2.8.2
- **Consultas HTTP**: TanStack Query 5.76.1
- **Enrutamiento**: React Router 7.6.0
- **Formularios**: React Hook Form 7.56.4 + Zod
- **Validación**: Zod 3.25.20
- **Estilos**: Tailwind CSS 4.1.7
- **Animaciones**: Framer Motion 12.12.2
- **Gráficos**: Chart.js + Recharts
- **PDF/Excel**: jsPDF, xlsx, jspdf-autotable
- **Internacionalización**: i18next 25.2.1
- **Notificaciones**: React Toastify 11.0.5

### Frontend (Página Web Pública)
- **Framework**: React 18.2.0
- **Lenguaje**: TypeScript 5.8.3
- **Build Tool**: Vite 6.3.5
- **Gestión de Estado**: Redux Toolkit 2.9.0
- **Enrutamiento**: React Router 7.9.3
- **Estilos**: Tailwind CSS 3.3.3
- **Formularios**: React Hook Form 7.56.4
- **Validación**: Zod 3.25.20
- **Animaciones**: Framer Motion 12.23.22
- **PDF**: jsPDF
- **Fechas**: date-fns 4.1.0
- **Notificaciones**: React Hot Toast 2.5.2

### Infraestructura
- **Contenedores**: Docker + Docker Compose
- **Proxy Inverso**: Nginx (Alpine)
- **CDN/SSL**: Backblaze B2 para backups
- **Cloud**: AWS EC2 + Terraform
- **CI/CD**: GitHub Actions

## Base de Datos

### Modelo de Datos

```
sede (Sedes)
├── usuario (Usuarios)
│   └── usuario_idioma (Idiomas por usuario)
├── embarcacion (Embarcaciones)
├── tipo_tour (Tipos de tour)
│   ├── galeria_tour (Galería de imágenes)
│   └── horario_tour (Horarios programados)
└── horario_chofer (Horarios de chóferes)
    └── canal_venta (Canales de venta)
        └── instancia_tour (Instancias de tour)
            ├── reserva (Reservas)
            │   └── pago (Pagos)
            │       └── comprobante_pago (Comprobantes)
            ├── cliente (Clientes)
            │   └── recuperacion_contrasena (Recuperación de contraseña)
            └── tipo_pasaje (Tipos de pasaje)
                └── paquete_pasajes (Paquetes de pasajes)
```

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `sede` | Sedes/oficinas del sistema |
| `usuario` | Usuarios del sistema (ADMIN, VENDEDOR, CHOFER) |
| `usuario_idioma` | Idiomas que habla cada usuario |
| `idioma` | Idiomas disponibles |
| `embarcacion` | Embarcaciones disponibles |
| `tipo_tour` | Tipos de tour ofrecidos |
| `galeria_tour` | Galería de imágenes por tour |
| `horario_tour` | Horarios disponibles por tour |
| `horario_chofer` | Horarios asignados a chóferes |
| `canal_venta` | Canales de venta (web, mostrador, etc.) |
| `instancia_tour` | Instancias programadas de tours |
| `reserva` | Reservas realizadas |
| `cliente` | Clientes registrados |
| `pago` | Pagos realizados |
| `comprobante_pago` | Comprobantes de pago |
| `tipo_pasaje` | Tipos de pasaje (adulto, niño, etc.) |
| `paquete_pasajes` | Paquetes de pasajes |
| `metodo_pago` | Métodos de pago disponibles |
| `tour_programado` | Tours programados |
| `recuperacion_contrasena` | Tokens de recuperación |

## API Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login de usuario interno |
| POST | `/api/v1/clientes/login` | Login de cliente |
| POST | `/api/v1/clientes/registro` | Registro de cliente |
| POST | `/api/v1/clientes/refresh` | Refrescar token |
| POST | `/api/v1/auth/recuperar-contrasena` | Solicitar recuperación |
| POST | `/api/v1/auth/restablecer-contrasena` | Restablecer contraseña |

### Tours y Reservas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/tours` | Listar tours disponibles |
| GET | `/api/v1/tours/:id/horarios` | Horarios de un tour |
| GET | `/api/v1/reservas` | Listar reservas |
| POST | `/api/v1/reservas` | Crear reserva |
| PUT | `/api/v1/reservas/:id` | Actualizar reserva |
| GET | `/api/v1/reservas/cliente/:id` | Reservas por cliente |

### Clientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/clientes` | Listar clientes |
| POST | `/api/v1/clientes` | Crear cliente |
| GET | `/api/v1/clientes/:id` | Obtener cliente |
| PUT | `/api/v1/clientes/:id` | Actualizar cliente |

### Pagos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/pagos` | Listar pagos |
| POST | `/api/v1/pagos` | Registrar pago |
| GET | `/api/v1/pagos/:id/comprobante` | Generar comprobante |

## Instalación y Configuración

### Requisitos Previos

- Docker y Docker Compose instalados
- Go 1.24+ (para desarrollo local del backend)
- Node.js 20+ (para desarrollo local del frontend)
- PostgreSQL 15+ (para desarrollo local)

### Desarrollo Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/comleto.git
cd comleto
```

2. **Configurar variables de entorno**

Backend (`.env`):
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_tours
DB_USER=postgres
DB_PASSWORD=postgres123
SERVER_PORT=8080
SERVER_HOST=0.0.0.0
GIN_MODE=debug
ENV=development
JWT_SECRET=tu-secret-muy-largo-y-seguro
ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
RESEND_API_KEY=tu-api-key-de-resend
```

Frontend (`.env`):
```env
VITE_API_URL=http://localhost:8080/api/v1
```

3. **Iniciar con Docker Compose**
```bash
docker-compose up -d
```

4. **Ver logs**
```bash
docker-compose logs -f
```

### Desarrollo Local sin Docker

**Backend:**
```bash
cd backend
go mod download
go run cmd/main.go
```

**Frontend (Admin):**
```bash
cd frontend
npm install
npm run dev
```

**Frontend (Página Web):**
```bash
cd paginawebbtour
npm install
npm run dev
```

## Scripts Disponibles

### Backup a Backblaze B2

```bash
# El servicio de backup se ejecuta automáticamente:
# - Daily: 01:00 AM (América/Lima)
# - Test: cada 15 y 45 minutos
```

### Scripts de Carga de Prueba

Ubicados en `testcarga/`:

| Script | Descripción |
|--------|-------------|
| `cargaclientes.py` | Carga masiva de clientes de prueba |
| `cargausuario.py` | Carga masiva de usuarios de prueba |
| `cargainstancia.py` | Carga de instancias de tour |
| `stress_tipos_pasaje.py` | Test de estrés para tipos de pasaje |

## Testing

### Backend (Go)
```bash
cd backend
go test ./tests/... -v
```

### Frontend (React)
```bash
cd frontend
npm test

cd ../paginawebbtour
npm test
```

## CI/CD

El proyecto utiliza GitHub Actions para integración y despliegue continuo:

- **Push a main**: Ejecuta tests y despliega al servidor
- **Pull requests**: Solo ejecuta tests

### Secrets requeridos:
- `SSH_PRIVATE_KEY`: Clave SSH para acceso al servidor
- `SERVER_IP`: IP del servidor de producción
- `SERVER_USER`: Usuario SSH

## Seguridad

### Medidas Implementadas

- **Encriptación AES-256-CBC** para datos sensibles
- **HMAC-SHA256** para verificación de integridad
- **JWT** con expiración para autenticación
- **Rate Limiting** por endpoint:
  - Login: 2 req/s
  - API: 15 req/s
  - Portfolio: 20 req/s
- **CORS** configurado por dominio
- **Headers de seguridad**: HSTS, X-Frame-Options, CSP
- **SSL/TLS 1.2+** con cipher suites modernas

### Contraseñas

Las contraseñas se almacenan usando bcrypt con costo 12.

## Estructura del Backend

```
backend/
├── cmd/
│   └── main.go              # Punto de entrada
├── internal/
│   ├── config/              # Configuración
│   ├── controladores/       # Controladores HTTP
│   ├── entidades/          # Modelos de datos
│   ├── jobs/               # Tareas programadas
│   ├── middleware/         # Middleware HTTP
│   ├── repositorios/       # Acceso a datos
│   ├── rutas/              # Definición de rutas
│   ├── servicios/          # Lógica de negocio
│   └── utils/              # Utilidades (encriptación, etc.)
├── tests/
│   ├── controladores/
│   ├── entidades/
│   ├── repositorios/
│   └── servicios/
├── migrations/
│   └── crear_tablas.sql    # Schema de la base de datos
├── Dockerfile
├── Dockerfile.dev
├── docker-compose.yml
├── go.mod
└── go.sum
```

## Estructura del Frontend (Admin)

```
frontend/
├── src/
│   ├── application/
│   │   ├── ports/          # Interfaces de adaptación
│   │   └── use-cases/      # Casos de uso
│   ├── domain/
│   │   └── models/         # Modelos de dominio
│   ├── infrastructure/
│   │   ├── api/            # Cliente HTTP
│   │   └── services/        # Servicios externos
│   ├── shared/
│   │   ├── components/      # Componentes compartidos
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── utils/          # Utilidades
│   │   └── types/          # Tipos compartidos
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── Dockerfile
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Comandos Útiles

```bash
# Reconstruir un servicio específico
docker-compose up -d --build backend

# Ver logs de un servicio
docker-compose logs -f backend

# Reiniciar un servicio
docker-compose restart backend

# Detener todos los servicios
docker-compose down

# Ver uso de recursos
docker stats

# Acceder a la base de datos
docker exec -it sistema-tours-db psql -U postgres -d sistema_tours

# Restaurar backup manualmente
gunzip < backup.sql.gz | docker exec -i sistema-tours-db psql -U postgres -d sistema_tours
```

## Variables de Entorno en Producción

### Backend
| Variable | Descripción |
|----------|-------------|
| `DB_HOST` | Host de PostgreSQL |
| `DB_PORT` | Puerto de PostgreSQL |
| `DB_NAME` | Nombre de la base de datos |
| `DB_USER` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Contraseña de PostgreSQL |
| `SERVER_PORT` | Puerto del servidor |
| `JWT_SECRET` | Secret para tokens JWT |
| `ENCRYPTION_KEY` | Clave de encriptación (32 caracteres) |
| `CORS_ORIGIN` | Orígenes permitidos (separados por coma) |
| `RESEND_API_KEY` | API key de Resend para emails |

### Frontend
| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base del API |

## Contribuir

1. Fork el repositorio
2. Crear una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## Licencia

ISC - Ver archivo LICENSE para más detalles.