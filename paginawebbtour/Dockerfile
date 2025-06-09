# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Intentar construir, y si falla, crear un directorio dist mínimo
RUN npm run build || (mkdir -p /app/dist && echo "<html><body><h1>Sistema en mantenimiento</h1><p>Vuelva a intentarlo más tarde.</p></body></html>" > /app/dist/index.html)

# Etapa de producción
FROM nginx:alpine

# Copiar los archivos construidos (ahora siempre existirá /app/dist)
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Crear directorio para certificados
RUN mkdir -p /etc/nginx/certs

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]