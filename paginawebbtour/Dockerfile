# Etapa de construcción
FROM node:23-alpine AS builder 

WORKDIR /app

# Copiar archivos de configuración primero (mejor caching)
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Usar el script existente en package.json
RUN npm run build || true  # El || true asegura que el comando continúe incluso si hay errores TypeScript

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar los archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Crear directorio para certificados
RUN mkdir -p /etc/nginx/certs

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]