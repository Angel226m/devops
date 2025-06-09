# Etapa de construcción
FROM node:20-alpine AS builder

# Configuración UTF-8
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

WORKDIR /app

# Copiar archivos de configuración primero
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Crear directamente una página de mantenimiento con UTF-8 correctamente configurado
RUN mkdir -p /app/dist && \
    echo '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Sistema de Reservas</title></head><body><h1>Sistema en mantenimiento</h1><p>Vuelva a intentarlo más tarde.</p></body></html>' > /app/dist/index.html

# Etapa de producción
FROM nginx:alpine

# Configuración UTF-8
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Copiar los archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Configurar nginx para servir contenido UTF-8
RUN sed -i '1s/^/charset utf-8;\n/' /etc/nginx/conf.d/default.conf

# Crear directorio para certificados
RUN mkdir -p /etc/nginx/certs

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]