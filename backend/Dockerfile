# Usar Go 1.23 (1.24 aún no existe)
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache gcc musl-dev git ca-certificates tzdata wget

# Copiar go.mod y go.sum primero para mejor cache
COPY go.mod go.sum ./
RUN go mod download && go mod verify

# Copiar todo el código fuente
COPY . .

# Compilar la aplicación con optimizaciones
RUN CGO_ENABLED=1 GOOS=linux go build \
    -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o main ./cmd/main.go

# Etapa de producción
FROM alpine:latest

# Instalar certificados CA, zona horaria y wget para healthcheck
RUN apk --no-cache add ca-certificates tzdata wget

WORKDIR /app

# Crear usuario no-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Copiar el binario compilado
COPY --from=builder /app/main ./
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copiar migraciones si existen
COPY --from=builder /app/migrations ./migrations

# Cambiar ownership y permisos
RUN chown appuser:appgroup /app/main && \
    chmod +x /app/main && \
    chown -R appuser:appgroup /app

# Cambiar a usuario no-root
USER appuser

# Exponer puerto
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Comando para ejecutar
CMD ["./main"]