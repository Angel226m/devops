FROM nginx:alpine

# Crea el directorio y genera el archivo dhparam dentro de la imagen
RUN mkdir -p /etc/nginx/certs && \
    apk add --no-cache openssl && \
    openssl dhparam -out /etc/nginx/certs/dhparam.pem 2048
