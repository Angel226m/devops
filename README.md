# Sistema de Gestión de Tours — Ocean Tours
Para ver si ya baneó alguna IP:
bashfail2ban-client status nginx-badbots
fail2ban-client status nginx-noscript
fail2ban-client status nginx-limit-req
Y para ver el log en tiempo real mientras llegan ataques:
bashtail -f /var/log/fail2ban.log
Son dos cosas distintas:
ArchivoPara qué sirvedomain.cert.pemTu certificado SSL (identidad del dominio)private.key.pemLa clave privada de ese certificadodhparam.pemParámetro matemático extra que hace el cifrado más robusto
El dhparam.pem no viene con ningún proveedor, lo generas vos una vez y ya. No reemplaza nada de lo que tienes, se suma.

Plataforma integral para la administración y gestión de tours turísticos, desarrollada con arquitectura de hexagonal y desplegada en un vps mediante contenedores Docker. El sistema proporciona un panel administrativo completo, una página pública de reservas en línea, streaming en vivo de tours, y automatización de procesos de respaldo y despliegue continuo.

---

## 1. Arquitectura del Sistema

### 1.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    USUARIOS                                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │ Admin Panel     │  │ Reservas Web    │  │ Streaming       │  │ Portfolio   │  │
│  │ admin.angel     │  │ reservas.angel  │  │ stream.angel    │  │ portafolio  │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  └──────┬──────┘  │
└───────────┼────────────────────┼────────────────────┼─────────────────┼──────────┘
            │                    │                    │                 │
            ▼                    ▼                    ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              NGINX PROXY (Puerto 80, 443, 18889)                   │
│  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│  │  • SSL/TLS Termination                                                     │  │
│  │  • Rate Limiting (API: 15r/s, Login: 2r/s, Portfolio: 20r/s)              │  │
│  │  • Load Balancing                                                           │  │
│  │  • HTTP/2 Enabled                                                           │  │
│  │  • Gzip Compression                                                         │  │
│  │  • Security Headers (HSTS, CSP, X-Frame-Options)                            │  │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
            │                    │                    │                 │
            ▼                    ▼                    ▼                 ▼
┌───────────────────┐  ┌───────────────────┐  ┌─────────────────┐  ┌───────────────┐
│ Frontend Admin    │  │ Página Web        │  │ Backend API     │  │ Portfolio     │
│ (React :3000)     │  │ Reservas (:3001)  │  │ (Go/Gin :8080)  │  │ Service (:8081)│
└─────────┬─────────┘  └─────────┬─────────┘  └────────┬────────┘  └───────┬───────┘
          │                       │                    │                   │
          └───────────────────────┼────────────────────┘                   │
                                 │                                        │
                                 ▼                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           DOCKER NETWORK: BACKEND-NETWORK                          │
│  ┌──────────────────────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL 15-Alpine (:5432)  │  Backup Service (Cron)                    │  │
│  │  • Healthcheck integrado       │  • Backups automáticos diarios            │  │
│  │  • Volumen persistente        │  • Retención: 7 días local + B2           │  │
│  └──────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
                          ┌────────────────────────────┐
                          │ BACKBLAZE B2 CLOUD STORAGE │
                          │ • Bucket: OceanTours       │
                          │ • Backups encriptados      │
                          │ • Retención: 7 días        │
                          └────────────────────────────┘
```

### 1.2 Flujo de Datos

El flujo de comunicación entre componentes sigue el patrón de arquitectura de tres capas. El usuario accede a través de Nginx, que actúa como punto de entrada único manejando tanto el tráfico HTTP como HTTPS. Las solicitudes destinedas al API pasan al backend Go, mientras que las solicitudes de assets estáticos son servidas directamente por los frontends React. El backend se comunica con PostgreSQL para todas las operaciones de datos persistentes, y el servicio de backup conecta con Backblaze B2 para el almacenamiento seguro de respaldos fuera del servidor.

---

## 2. Estructura del Proyecto

```
comleto/
├── backend/                     # API RESTful en Go (Gin + GORM)
│   ├── cmd/                    # Punto de entrada de la aplicación
│   │   └── main.go             # Configuración del servidor, rutas y middlewares
│   ├── internal/               # Código interno no exportable
│   │   ├── config/             # Carga de configuración desde variables de entorno
│   │   ├── controladores/      # Handlers HTTP que reciben las peticiones
│   │   ├── entidades/          # Modelos de datos (structs de GORM)
│   │   ├── jobs/               # Tareas programadas y procesos asíncronos
│   │   ├── middleware/         # Middlewares HTTP (auth, logging, CORS, rate limiting)
│   │   ├── repositorios/       # Capa de acceso a datos (patrón Repository)
│   │   ├── rutas/              # Definición y registro de todas las rutas API
│   │   ├── servicios/          # Lógica de negocio (patrón Service)
│   │   └── utils/              # Utilidades: encriptación, validación, helpers
│   ├── migrations/             # Scripts SQL de creación de tablas
│   │   └── crear_tablas.sql    # Schema completo de la base de datos
│   ├── tests/                 # Suite completa de pruebas
│   │   ├── controladores/     # Tests de controladores con mocks HTTP
│   │   ├── repositorios/      # Tests de repositorios con base embebida
│   │   ├── servicios/         # Tests unitarios de lógica de negocio
│   │   └── integration/       # Tests de integración end-to-end
│   ├── Dockerfile             # Imagen de producción
│   ├── Dockerfile.dev         # Imagen para desarrollo
│   ├── docker-compose.yml     # Configuración local de desarrollo
│   ├── go.mod                 # Dependencias Go (module sistema-toursseft)
│   ├── go.sum                 # Hashes de integridad de dependencias
│   └── .env                   # Variables de entorno (NOCommitear)
│
├── frontend/                   # Panel administrativo (React 19 + TypeScript)
│   ├── src/
│   │   ├── application/       # Capa de aplicación (puertos y casos de uso)
│   │   │   ├── ports/         # Interfaces para adaptadores externos
│   │   │   └── use-cases/    # Casos de uso del negocio
│   │   ├── domain/            # Capa de dominio
│   │   │   └── models/       # Modelos y entidades del dominio
│   │   ├── infrastructure/    # Capa de infraestructura
│   │   │   ├── api/          # Cliente HTTP (Axios con interceptors)
│   │   │   └── services/     # Servicios externos (Resend, etc.)
│   │   ├── shared/           # Componentes y utilidades compartidas
│   │   │   ├── components/   # Componentes UI reutilizables
│   │   │   ├── hooks/       # Hooks personalizados de React
│   │   │   ├── utils/       # Funciones utilitarias
│   │   │   └── types/       # Definiciones de tipos TypeScript
│   │   ├── App.tsx          # Componente raíz con routing
│   │   ├── main.tsx         # Punto de entrada React
│   │   └── index.css        # Estilos globales con Tailwind
│   ├── public/              # Assets estáticos públicos
│   ├── certs/               # Certificados SSL del dominio
│   ├── Dockerfile           # Imagen de producción multi-stage
│   ├── Dockerfile.dev       # Imagen para desarrollo con hot-reload
│   ├── docker-compose.yml   # Configuración de servicios locales
│   ├── package.json         # Dependencias npm
│   ├── tsconfig.json        # Configuración TypeScript
│   ├── vite.config.ts       # Configuración Vite
│   └── .dockerignore        # Exclusiones para el build
│
├── paginawebbtour/           # Página web pública de reservas (React 18)
│   ├── src/                 # Estructura similar al frontend admin
│   ├── tests/               # Tests con Vitest (unitarios y de компонентов)
│   ├── public/             # Assets estáticos
│   ├── package.json         # Dependencias npm
│   ├── tsconfig.json        # Configuración TypeScript
│   ├── vite.config.ts       # Configuración Vite
│   ├── vitest.config.ts     # Configuración de tests Vitest
│   └── .gitignore           # Exclusiones Git
│
├── scripts/                  # Scripts de automatización
│   ├── backup-postgres-to-b2.sh  # Script principal de backup a Backblaze
│   └── .env                 # Variables de entorno para scripts
│
├── terraform/               # Infraestructura como Código (AWS)
│   ├── main.tf              # Recursos: EC2, Security Groups, WAF, CloudWatch
│   ├── variables.tf         # Variables configurables (región, IPs, etc.)
│   ├── outputs.tf           # Outputs del apply (IP pública, ARN del WAF)
│   └── .gitignore           # Exclusiones para tfstate
│
├── .github/
│   └── workflows/          # Pipelines CI/CD de GitHub Actions
│       ├── deploy.yml      # Pipeline de test y despliegue automático
│       └── database-backup.yml  # Pipeline de backup programado
│
├── certs/                   # Certificados SSL del servidor
│   ├── domain.cert.pem     # Certificado del dominio
│   ├── private.key.pem    # Clave privada
│   └── public.key.pem     # Clave pública
│
├── nginx.conf               # Configuración completa del proxy Nginx
├── docker-compose.yml      # Orquestación de todos los servicios
├── .gitignore              # Exclusiones globales del repositorio
└── README.md               # Este archivo
```

---

## 3. Stack Tecnológico

### 3.1 Backend — Go

El backend está desarrollado en **Go 1.24.1** utilizando el framework **Gin v1.11.0** para el manejo de rutas HTTP y middlewares. Se utiliza **GORM v1.31.1** como ORM para la interacción con la base de datos PostgreSQL, proporcionando un código limpio y mantenible para las operaciones CRUD. La autenticación se implementa mediante **JWT (golang-jwt v4.5.2)** con tokens de acceso y refresh, mientras que la seguridad de datos sensibles utiliza **encriptación AES-256-CBC** combinada con **HMAC-SHA256** para garantizar tanto confidencialidad como integridad de la información.

Para el envío de correos electrónicos transaccionales se integra con **Resend API v2**, permitiendo notificaciones de recuperación de contraseñas, confirmaciones de reservas y alertas del sistema. El backend incluye una suite completa de pruebas que utiliza **go-sqlmock** para mocks de base de datos, **embedded-postgres** para pruebas de integración con PostgreSQL embebido, y **testify** para aserciones y Assertions. El servidor escucha en el puerto **8080** dentro de la red Docker interna.

Las dependencias adicionales del backend incluyen **joho/godotenv** para la carga de variables de entorno, **gin-contrib/cors** para el manejo de Cross-Origin Resource Sharing, y **jackc/pgx/v5** como driver PostgreSQL de alto rendimiento.

### 3.2 Frontend — Panel Administrativo

El panel administrativo es una aplicación **React 19.1.0** con **TypeScript 5.8.3** que utiliza **Vite 6.3.5** como herramienta de build, proporcionando tiempos de compilación ultrarrápidos y hot-module-replacement durante el desarrollo. La gestión de estado global se realiza con **Redux Toolkit 2.8.2**, mientras que las consultas al servidor se manejan mediante **TanStack Query 5.76.1** con caché automático, invalidación inteligente y soporte para prefetching.

El enrutamiento de la aplicación utiliza **React Router 7.6.0** con soporte para rutas protegidas basadas en roles de usuario. Los formularios se construyen con **React Hook Form 7.56.4** combinado con **Zod 3.25.20** para validación de esquemas, proporcionando una experiencia de usuario fluida con feedback inmediato de errores. El diseño visual se implementa con **Tailwind CSS 4.1.7** utilizando su nueva arquitectura basada en CSS en lugar de PostCSS, mientras que las animaciones y transiciones usan **Framer Motion 12.12.2** con physics-based animations.

La visualización de datos incluye **Chart.js** con **react-chartjs-2** para gráficos de barras, líneas y torta, así como **Recharts** para visualizaciones más complejas. La generación de documentos utiliza **jsPDF** con **jspdf-autotable** para PDFs y **xlsx** para hojas de cálculo Excel. La internacionalización está implementada con **i18next 25.2.1** y **react-i18next**, soportando múltiples idiomas del sistema. Las notificaciones toast utilizan **React Toastify 11.0.5** para feedback visual no intrusivo.

### 3.3 Frontend — Página de Reservas

La página pública de reservas está desarrollada en **React 18.2.0** con **TypeScript 5.8.3** y **Vite 6.3.5**, compartiendo muchas tecnologías con el panel administrativo pero optimizada para visitantes públicos. Utiliza **Redux Toolkit 2.9.0** para gestión de estado, **React Router 7.9.3** para navegación, y **Tailwind CSS 3.3.3** para estilos.

Las diferencias principales incluyen el uso de **React Hot Toast 2.5.2** en lugar de Toastify, la incorporación de **React Helmet Async** para SEO, **React Datepicker** para selección de fechas de tours, y plugins especializados de Tailwind como **@tailwindcss/aspect-ratio**, **tailwindcss-animate**, **tailwind-scrollbar-hide** y **@tailwindcss/typography** para mejorar la experiencia visual. Los tests se implementan con **Vitest 3.2.3** en lugar de Jest, con **@testing-library/react** para testing de componentes.

### 3.4 Infraestructura

La infraestructura del sistema se construye sobre **Docker** y **Docker Compose** para la contenedorización de todos los servicios. El servidor web y proxy inverso utiliza **Nginx** sobre imagen **Alpine** para reducir el tamaño del contenedor. Los respaldos se almacenan en **Backblaze B2** utilizando la CLI oficial de B2 para transferencias seguras, mientras que la nube de infraestructura se despliega en **AWS EC2** con gestión de infraestructura mediante **Terraform**.

El pipeline de CI/CD se automatiza completamente con **GitHub Actions**, ejecutando tests en cada push y pull request, con despliegue automático a producción únicamente en pushes a la rama main.

---

## 4. Dominios y Servicios

El sistema gestiona múltiples dominios, cada uno apuntando a un servicio específico dentro de la arquitectura Nginx:

| Dominio | Servicio | Puerto Interno | Descripción |
|---------|----------|----------------|-------------|
| `admin.angelproyect.com` | Frontend Admin | 3000 | Panel de administración con gestión completa de tours, reservas, clientes y reportes |
| `reservas.angelproyect.com` | Página Web Reservas | 3001 | Sitio público para reserva de tours con selección de fecha, tipo de pasaje y pago |
| `stream.angelproyect.com` | Streaming HLS | 18889 | Streaming en vivo de tours mediante protocolo HLS para visualización de experiencias en tiempo real |
| `portafolio.angelproyect.com` | Portafolio Estático | 8081 | Sitio web estático con galería de imágenes y videos de tours anteriores |

Cada dominio está configurado con certificados SSL propios, redirección automática de HTTP a HTTPS, y headers de seguridad específicos para el tipo de contenido que sirve.

---

## 5. Base de Datos

### 5.1 Modelo de Datos

El sistema utiliza **PostgreSQL 15-Alpine** como motor de base de datos relacional, optimized para entornos contenedores con un tamaño de imagen reducido. La estructura de datos sigue un modelo jerárquico donde cada sede puede gestionar múltiples tipos de tours, cada tour tiene múltiples horarios y cada horario puede generar instancias de tour diarias.

```
sede (Sedes de la empresa)
├── usuario (Usuarios del sistema)
│   └── usuario_idioma (Idiomas que habla cada usuario)
├── idioma (Idiomas disponibles en el sistema)
├── embarcacion (Embarcaciones disponibles para tours)
├── tipo_tour (Tipos de tour ofrecidos)
│   ├── galeria_tour (Galería de imágenes por tour)
│   └── horario_tour (Horarios programados disponibles)
└── horario_chofer (Horarios asignados a chóferes)
    └── canal_venta (Canales de venta: web, mostrador, agencia)
        └── instancia_tour (Instancias programadas de tours)
            ├── reserva (Reservas realizadas por clientes)
            │   └── pago (Pagos registrados)
            │       └── comprobante_pago (Comprobantes de pago)
            ├── cliente (Clientes registrados en el sistema)
            │   └── recuperacion_contrasena (Tokens de recuperación)
            └── tipo_pasaje (Tipos de pasaje: adulto, niño, tercero)
                └── paquete_pasajes (Paquetes promocionales de pasajes)
```

### 5.2 Tablas Principales

A continuación se presenta la descripción detallada de cada tabla del modelo de datos:

| Tabla | Descripción | Clave Foránea |
|-------|-------------|---------------|
| `sede` | Sedes u oficinas físicas donde opera el negocio | — |
| `usuario` | Usuarios del sistema con roles: ADMIN, VENDEDOR, CHOFER | sede_id |
| `usuario_idioma` | Relación muchos-a-muchos entre usuarios e idiomas | usuario_id, idioma_id |
| `idioma` | Idiomas disponibles para tours y Atención al cliente | — |
| `embarcacion` | Embarcaciones (botes, yates) disponibles para tours | sede_id |
| `tipo_tour` | Tipos de tour ofrecidos (city tour, Aventura, etc.) | sede_id |
| `galeria_tour` | Imágenes de galería asociadas a cada tour | tipo_tour_id |
| `horario_tour` | Horarios de salida disponibles por tour | tipo_tour_id |
| `horario_chofer` | Asignación de chóferes a horarios específicos | horario_tour_id, usuario_id (chofer) |
| `canal_venta` | Canales de venta (web, mostrador, agencia, OTA) | horario_chofer_id |
| `instancia_tour` | Instancia específica de un tour (fecha+horario) | canal_venta_id |
| `reserva` | Reserva realizada por un cliente | instancia_tour_id, cliente_id |
| `pago` | Pago asociado a una reserva | reserva_id |
| `comprobante_pago` | Comprobantes de pago (imágenes, PDFs) | pago_id |
| `cliente` | Cliente final que realiza reservas | — |
| `recuperacion_contrasena` | Tokens de recuperación de contraseña | cliente_id |
| `tipo_pasaje` | Tipos de pasaje (adulto, niño, adulto mayor) | instancia_tour_id |
| `paquete_pasajes` | Paquetes promocionales de varios pasajes | tipo_pasaje_id |
| `metodo_pago` | Métodos de pago aceptados (efectivo, tarjeta, transferencia) | — |
| `tour_programado` | Tours programados para fechas específicas | instancia_tour_id |

---

## 6. Endpoints de la API

### 6.1 Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/login` | Login de usuario interno (admin/vendedor/chofer) | No |
| POST | `/api/v1/clientes/login` | Login de cliente registrado | No |
| POST | `/api/v1/clientes/registro` | Registro de nuevo cliente | No |
| POST | `/api/v1/clientes/refresh` | Refrescar token de acceso | Token refresh |
| POST | `/api/v1/auth/recuperar-contrasena` | Solicitar recuperación de contraseña | No |
| POST | `/api/v1/auth/restablecer-contrasena` | Restablecer contraseña con token | No |

### 6.2 Tours y Reservas

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/v1/tours` | Listar todos los tipos de tour disponibles | No |
| GET | `/api/v1/tours/:id/horarios` | Obtener horarios de un tour específico | No |
| GET | `/api/v1/tours/:id/galeria` | Obtener galería de imágenes del tour | No |
| GET | `/api/v1/reservas` | Listar todas las reservas | Token JWT |
| POST | `/api/v1/reservas` | Crear una nueva reserva | Token (cliente) |
| PUT | `/api/v1/reservas/:id` | Actualizar una reserva existente | Token JWT |
| DELETE | `/api/v1/reservas/:id` | Cancelar una reserva | Token JWT |
| GET | `/api/v1/reservas/cliente/:id` | Obtener reservas de un cliente específico | Token JWT |
| GET | `/api/v1/instancias` | Listar instancias de tour disponibles | No |
| GET | `/api/v1/instancias/:id` | Obtener instancia específica con disponibilidad | No |

### 6.3 Clientes

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/v1/clientes` | Listar todos los clientes | Token JWT |
| POST | `/api/v1/clientes` | Crear un nuevo cliente | Token JWT |
| GET | `/api/v1/clientes/:id` | Obtener cliente por ID | Token JWT |
| PUT | `/api/v1/clientes/:id` | Actualizar datos del cliente | Token JWT |
| DELETE | `/api/v1/clientes/:id` | Eliminar cliente | Token JWT |

### 6.4 Pagos

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/v1/pagos` | Listar todos los pagos | Token JWT |
| POST | `/api/v1/pagos` | Registrar un nuevo pago | Token JWT |
| GET | `/api/v1/pagos/:id/comprobante` | Generar comprobante en PDF | Token JWT |
| PUT | `/api/v1/pagos/:id` | Actualizar estado del pago | Token JWT |

### 6.5 Administración

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/v1/usuarios` | Listar usuarios del sistema | Token JWT (Admin) |
| POST | `/api/v1/usuarios` | Crear nuevo usuario | Token JWT (Admin) |
| PUT | `/api/v1/usuarios/:id` | Actualizar usuario | Token JWT (Admin) |
| GET | `/api/v1/reportes/reservas` | Generar reporte de reservas | Token JWT |
| GET | `/api/v1/reportes/ingresos` | Generar reporte de ingresos | Token JWT |
| GET | `/api/v1/reportes/export/excel` | Exportar datos a Excel | Token JWT |

---

## 7. Pipeline de CI/CD

### 7.1 Pipeline de Despliegue (deploy.yml)

El pipeline de despliegue se ejecuta automáticamente en cada push a la rama main y en cada pull request hacia main. El flujo completo se divide en dos stages: ejecución de tests y despliegue a producción.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GITHUB ACTIONS WORKFLOW                            │
│  Trigger: push to main / pull_request to main                              │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │    STAGE 1: TESTS           │
                    │  (Ejecuta en PR y Push)     │
                    └─────────────┬───────────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
     ┌─────────────┐    ┌─────────────────┐   ┌─────────────────┐
     │ Setup Go    │    │ Setup Node.js  │   │ Install Deps    │
     │ 1.23        │    │ 20             │   │ Frontend        │
     └──────┬──────┘    └────────┬────────┘   └────────┬────────┘
            │                    │                    │
            ▼                    ▼                    ▼
     ┌─────────────┐    ┌─────────────────┐          │
     │ Go Tests    │    │ Frontend Tests │          │
     │ ./tests/    │    │ (if exists)    │          │
     └──────┬──────┘    └────────┬────────┘          │
            │                    │                    │
            └────────┬───────────┴────────────────────┘
                     ▼
           ┌─────────────────────┐
           │  MERGE TO MAIN?     │
           └─────────┬───────────┘
                     │
                     ▼ (SI)
           ┌─────────────────────┐
           │  STAGE 2: DEPLOY    │
           │  (Solo en push)     │
           └─────────────┬───────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   ┌────────────┐ ┌───────────┐ ┌───────────────┐
   │SSH Config  │ │ rsync     │ │ Docker        │
   │SSH Key     │ │ Files     │ │ compose up    │
   └────────────┘ └───────────┘ └───────────────┘
```

**Secrets requeridos para el pipeline:**

| Secret | Descripción |
|--------|-------------|
| `SSH_PRIVATE_KEY` | Clave privada SSH para acceso al servidor de producción |
| `SERVER_IP` | Dirección IP pública del servidor AWS EC2 |
| `SERVER_USER` | Usuario SSH para la conexión (ej: ubuntu, ec2-user) |

### 7.2 Pipeline de Respaldo (database-backup.yml)

El pipeline de respaldo se ejecuta de forma programada mediante cron y también puede activarse manualmente mediante workflow_dispatch. El horario configurado es a las 06:18 UTC (01:18 AM hora de Perú).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATABASE BACKUP WORKFLOW                                │
│  Trigger: schedule (cron: 18 6 * * *) + workflow_dispatch                 │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │  Configurar SSH             │
                    │  (Key + known_hosts)        │
                    └─────────────┬───────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │  Ejecutar script en        │
                    │  contenedor Docker         │
                    └─────────────┬───────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │  Verificar log de backup   │
                    │  (últimas 20 líneas)       │
                    └─────────────────────────────┘
```

---

## 8. Sistema de Backups

### 8.1 Configuración del Servicio de Backup

El sistema de backups se ejecuta dentro de un contenedor Docker dedicado que corre continuamente mediante un cron job configurado internamente. Este servicio utiliza la imagen oficial de Python 3.10-Alpine con las herramientas necesarias para PostgreSQL y Backblaze B2.

**Programación de backups:**
- **Backup automático diario**: 01:00 AM (hora América/Lima)
- **Backups de prueba**: Cada hora a los minutos 15 y 45

**Configuración del contenedor backup (docker-compose.yml):**
```yaml
backup:
  image: python:3.10-alpine
  container_name: db-backup
  volumes:
    - ./scripts:/scripts
    - ./backups:/backups
    - /var/run/docker.sock:/var/run/docker.sock
  environment:
    - POSTGRES_CONTAINER=sistema-tours-db
    - POSTGRES_USER=postgres
    - POSTGRES_PASSWORD=postgres123
    - POSTGRES_DB=sistema_tours
    - B2_KEY_ID=c331dab6a0c1
    - B2_APP_KEY=0052d6ba43deba114f2a4f83dda099d5f3d4a01f07
    - B2_BUCKET=OceanTours
    - TZ=America/Lima
```

### 8.2 Script de Backup (backup-postgres-to-b2.sh)

El script de backup realiza las siguientes operaciones en secuencia:

1. **Dump de PostgreSQL**: Genera un archivo SQL con formato plano utilizando `pg_dump` con opciones de creación, limpieza e inserciones individuales para máxima compatibilidad en la restauración.

2. **Compresión**: El archivo SQL se comprime automáticamente con gzip para reducir el tamaño de transferencia y almacenamiento.

3. **Subida a B2**: El backup comprimido se sube al bucket de Backblaze B2 con nombre descriptivo que incluye fecha y hora.

4. **Limpieza local**: Los archivos de backup locales con más de 7 días se eliminan automáticamente para conserve espacio en disco.

5. **Limpieza en B2**: Se mantienen solo los 7 backups más recientes en B2, eliminando los más antiguos automáticamente.

**Comandos de uso manual:**
```bash
# Ejecutar backup manualmente desde el contenedor
docker exec db-backup /scripts/backup-postgres-to-b2.sh

# Ver logs de backup
docker exec db-backup tail -n 20 /backups/backup_log.txt

# Listar backups locales
ls -la backups/

# Restaurar un backup
gunzip < backups/sistema_tours_2025-01-15_030000.sql.gz | \
docker exec -i sistema-tours-db psql -U postgres -d sistema_tours
```

---

## 9. Infraestructura como Código (Terraform)

### 9.1 Recursos Desplegados

El proyecto incluye configuración completa de Terraform en el directorio `terraform/` que despliega los siguientes recursos en AWS:

**Instancia EC2:**
- Tipo: Configurable mediante variable `instance_type`
- AMI: Ubuntu Server configurable
- Volume: 20 GB gp3 root
- Key Pair: SSH para acceso administrativo
- Security Group: Con reglas para HTTP (80), HTTPS (443) y SSH (22)

**Security Group (aws_security_group):**
- Regla de entrada HTTP (0.0.0.0/0) puerto 80
- Regla de entrada HTTPS (0.0.0.0/0) puerto 443
- Regla de entrada SSH (IPs restringidas configurables) puerto 22
- Regla de salida permite todo el tráfico

**WAF Web ACL (aws_wafv2_web_acl):**
- AWSManagedRulesSQLiRuleSet: Bloqueo de inyecciones SQL
- AWSManagedRulesCommonRuleSet: Protección contra ataques comunes
- RateLimitRule: Límite de 2000 solicitudes por IP en 5 minutos

**CloudWatch Alarm:**
- Monitoreo de solicitudes bloqueadas por el WAF
- Alerta cuando se superan 100 solicitudes bloqueadas en 5 minutos

### 9.2 Variables de Terraform

```hcl
# variables.tf
variable "aws_region" {
  description = "Región de AWS"
  type        = string
  default     = "us-east-1"
}

variable "allowed_ssh_ips" {
  description = "IPs permitidas para SSH"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # Cambiar en producción
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t3.medium"
}

variable "ami_id" {
  description = "ID de la AMI de Ubuntu"
  type        = string
  default     = "ami-0c55b159cbfafe1f0"  # Ubuntu 22.04 LTS
}

variable "key_name" {
  description = "Nombre del key pair SSH"
  type        = string
}

variable "environment" {
  description = "Ambiente de despliegue"
  type        = string
  default     = "production"
}
```

---

## 10. Configuración de Nginx

### 10.1 Configuración General

El archivo `nginx.conf` contiene una configuración completa y optimizada que incluye:

**Configuración de eventos:**
- 2048 worker connections
- Uso de epoll para Linux
- multi_accept habilitado

**Configuración HTTP general:**
- Charset UTF-8
- Server tokens off (seguridad)
- Client max body size: 25MB
- Gzip compression habilitada para múltiples tipos MIME

**Rate Limiting por zona:**
| Zona | Límite | Uso |
|------|--------|-----|
| `api` | 15r/s | Endpoints generales del API |
| `login` | 2r/s | Endpoints de autenticación |
| `crackguard` | 5r/s | Sistema crackguard |
| `portfolio` | 20r/s | Sitio de portafolio |

**Headers de seguridad:**
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: geolocation=(), microphone=(), camera=()
- Strict-Transport-Security: max-age=63072000 (2 años)

**Upstream servers:**
```nginx
upstream backend_servers {
    server backend:8080 max_fails=3 fail_timeout=30s;
    keepalive 64;
}

upstream frontend_servers {
    server frontend-container:80 max_fails=3 fail_timeout=30s;
    keepalive 64;
}

upstream paginawebbtour_servers {
    server paginawebbtour-container:80 max_fails=3 fail_timeout=30s;
    keepalive 64;
}

upstream portfolio_servers {
    server 172.17.0.1:8081 max_fails=3 fail_timeout=30s;
    keepalive 32;
}
```

---

## 11. Seguridad

### 11.1 Medidas de Seguridad Implementadas

**Cifrado de datos sensibles:**
- AES-256-CBC para encriptación de datos sensibles en la base de datos
- HMAC-SHA256 para verificación de integridad de datos encriptados
- Las claves de encriptación se gestionan mediante variables de entorno

**Autenticación y autorización:**
- JWT con tokens de acceso de corta duración y refresh tokens de larga duración
- Las contraseñas se hashean con bcrypt con factor de costo 12
- Roles de usuario definidos: ADMIN, VENDEDOR, CHOFER
- Middleware de verificación de JWT en todas las rutas protegidas

**Protección a nivel de Nginx:**
- Rate limiting por IP en todos los endpoints
- Limit de conexiones concurrentes por IP (50 conexiones)
- Headers de seguridad HTTP estrictos
- Redirección automática de HTTP a HTTPS
- SSL/TLS 1.2+ únicamente con cipher suites modernas

**Protección a nivel de aplicación:**
- Validación de entrada con Zod en todos los endpoints
- Sanitización de inputs para prevenir XSS
- Prepared statements en todas las consultas a la base de datos (GORM)

**WAF (Web Application Firewall):**
- Reglas de AWS para protección contra SQL Injection
- Reglas contra ataques comunes (OWASP Top 10)
- Rate limiting a nivel de WAF (2000 req/5min por IP)
- Alertas en CloudWatch para actividad sospechosa

### 11.2 Variables de Seguridad

El sistema requiere las siguientes variables de entorno sensibles, que deben configurarse correctamente en producción:

```env
# Backend (.env)
JWT_SECRET=angel_proyecto_tours_2025_jwt_secret_muy_largo_y_seguro
ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6  # 32 caracteres
DB_PASSWORD=postgres123
RESEND_API_KEY=tu-api-key-de-resend
```

---

## 12. Scripts de Carga de Prueba

El directorio `testcarga/` contiene scripts Python para pruebas de carga y estrés del sistema:

| Script | Descripción | Uso |
|--------|-------------|-----|
| `cargaclientes.py` | Carga masiva de clientes de prueba para tests de rendimiento | `python cargaclientes.py [cantidad]` |
| `cargausuario.py` | Carga masiva de usuarios de prueba con diferentes roles | `python cargausuario.py [cantidad]` |
| `cargainstancia.py` | Genera instancias de tour para fechas próximas | `python cargainstancia.py [días_adelante]` |
| `stress_tipos_pasaje.py` | Test de estrés para operaciones con tipos de pasaje | `python stress_tipos_pasaje.py [iteraciones]` |

**Requisitos de los scripts:**
```bash
pip install requests faker
```

---

## 13. Desarrollo Local

### 13.1 Requisitos Previos

- Docker y Docker Compose instalados
- Go 1.24+ (para desarrollo del backend sin contenedores)
- Node.js 20+ (para desarrollo de frontends sin contenedores)
- PostgreSQL 15+ (opcional, solo si se desarrolla sin Docker)

### 13.2 Ejecución con Docker Compose

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/comleto.git
cd comleto

# Iniciar todos los servicios
docker-compose up -d

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f nginx

# Detener todos los servicios
docker-compose down
```

### 13.3 Desarrollo sin Docker

**Backend:**
```bash
cd backend
go mod download
go run cmd/main.go
# Servidor disponible en http://localhost:8080
```

**Frontend Admin:**
```bash
cd frontend
npm install
npm run dev
# Servidor disponible en http://localhost:3000
```

**Página de Reservas:**
```bash
cd paginawebbtour
npm install
npm run dev
# Servidor disponible en http://localhost:3001
```

### 13.4 Configuración de Variables de Entorno

**Backend (backend/.env):**
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

**Frontend (frontend/.env):**
```env
VITE_API_URL=http://localhost:8080/api/v1
```

---

## 14. Testing

### 14.1 Tests del Backend

```bash
cd backend
go test ./tests/... -v
```

**Estructura de tests:**
- `tests/controladores/`: Tests de handlers HTTP con mocks
- `tests/repositorios/`: Tests de acceso a datos con SQLite embebido
- `tests/servicios/`: Tests de lógica de negocio
- `tests/integration/`: Tests de integración completos

### 14.2 Tests del Frontend Admin

```bash
cd frontend
npm test
```

### 14.3 Tests del Frontend de Reservas

```bash
cd paginawebbtour
npm test              # Ejecutar tests una vez
npm run test:watch   # Modo watch
npm run test:coverage # Con cobertura
```

---

## 15. Comandos Útiles

```bash
# Reconstruir un servicio específico
docker-compose up -d --build backend

# Ver logs de un servicio específico
docker-compose logs -f backend

# Reiniciar un servicio
docker-compose restart backend

# Detener todos los servicios
docker-compose down

# Ver uso de recursos de los contenedores
docker stats

# Acceder a la base de datos PostgreSQL
docker exec -it sistema-tours-db psql -U postgres -d sistema_tours

# Restaurar un backup manualmente
gunzip < backups/sistema_tours_2025-01-15_030000.sql.gz | \
docker exec -i sistema-tours-db psql -U postgres -d sistema_tours

# Ver contenedores en ejecución
docker ps

# Ver redes Docker
docker network ls

# Inspecionar volumen de datos de PostgreSQL
docker volume inspect comleto_postgres_data
```

---

## 16. Contribuciones

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear una rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Realizar los cambios y agregar tests si es necesario
4. Commit de los cambios (`git commit -am 'Agregar nueva funcionalidad'`)
5. Push a la rama (`git push origin feature/nueva-funcionalidad`)
6. Crear un Pull Request para revisión

---

## 17. Licencia

ISC — Consultar el archivo LICENSE para más detalles sobre los términos de uso del software.