#!/bin/bash

# Script para realizar backups de PostgreSQL y subirlos a Backblaze B2
# Retiene backups por 7 días

# Configuración
#!/bin/bash

# Cargar variables de entorno desde .env (si existe)
ENV_PATH="$(dirname "$0")/.env"
if [ -f "$ENV_PATH" ]; then
  set -o allexport
  source "$ENV_PATH"
  set +o allexport
else
  echo "⚠️ No se encontró archivo .env en $ENV_PATH. Variables deben estar definidas manualmente."
fi

# Resto del script...
DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backups"
BACKUP_FILE="$BACKUP_DIR/sistema_tours_$DATE.sql.gz"
LOG_FILE="$BACKUP_DIR/backup_log.txt"

# Asegurar que el directorio de backups existe
mkdir -p $BACKUP_DIR
touch $LOG_FILE

# Función para logging
log_message() {
  echo "$(date +"%Y-%m-%d %H:%M:%S"): $1" | tee -a $LOG_FILE
}

log_message "Iniciando proceso de respaldo..."

# Verificar variables de entorno
if [ -z "$POSTGRES_CONTAINER" ] || [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_DB" ]; then
  log_message "ADVERTENCIA: Variables de entorno para PostgreSQL no configuradas, usando valores predeterminados"
  POSTGRES_CONTAINER="sistema-tours-db"
  POSTGRES_USER="postgres"
  POSTGRES_DB="sistema_tours"
fi

if [ -z "$B2_KEY_ID" ] || [ -z "$B2_APP_KEY" ] || [ -z "$B2_BUCKET" ]; then
  log_message "ERROR: Variables de entorno para Backblaze B2 no configuradas"
  exit 1
fi

# Ejecutar pg_dump dentro del contenedor de PostgreSQL
log_message "Ejecutando pg_dump desde el contenedor $POSTGRES_CONTAINER..."
docker exec $POSTGRES_CONTAINER pg_dump -U $POSTGRES_USER $POSTGRES_DB | gzip > $BACKUP_FILE

# Verificar si el backup fue exitoso
if [ $? -eq 0 ]; then
  BACKUP_SIZE=$(du -h $BACKUP_FILE | cut -f1)
  log_message "Backup exitoso: $BACKUP_FILE (Tamaño: $BACKUP_SIZE)"
  
  # Autorizar con B2
  log_message "Autorizando con Backblaze B2..."
  b2 authorize-account $B2_KEY_ID $B2_APP_KEY
  
  # Subir el archivo
  log_message "Subiendo backup a B2..."
  B2_PATH="backups/$(basename $BACKUP_FILE)"
  b2 upload-file $B2_BUCKET $BACKUP_FILE $B2_PATH
  
  # Verificar si la subida fue exitosa
  if [ $? -eq 0 ]; then
    log_message "Backup subido correctamente a B2: $B2_PATH"
    
    # Limpieza de backups antiguos (local)
    log_message "Eliminando backups locales antiguos (más de 7 días)..."
    find $BACKUP_DIR -name "sistema_tours_*.sql.gz" -type f -mtime +7 -delete
    
    # Limpieza de backups antiguos en B2 (mantener solo 7)
    log_message "Listando backups en B2 para limpieza..."
    B2_FILES=$(b2 ls --long $B2_BUCKET backups | grep -E 'sistema_tours_[0-9]{4}-[0-9]{2}-[0-9]{2}.sql.gz' | sort -r)
    
    # Contar el número de archivos
    FILE_COUNT=$(echo "$B2_FILES" | wc -l)
    log_message "Se encontraron $FILE_COUNT backups en B2"
    
    if [ "$FILE_COUNT" -gt 7 ]; then
      # Obtener los archivos a eliminar (mantener los 7 más recientes)
      FILES_TO_DELETE=$(echo "$B2_FILES" | tail -n +8)
      
      log_message "Eliminando $(echo "$FILES_TO_DELETE" | wc -l) backups antiguos de B2..."
      echo "$FILES_TO_DELETE" | while read -r line; do
        FILE_NAME=$(echo $line | awk '{print $6}')
        if [ ! -z "$FILE_NAME" ]; then
          log_message "Eliminando $FILE_NAME de B2..."
          b2 delete-file-version "backups/$FILE_NAME"
        fi
      done
    else
      log_message "No hay necesidad de eliminar backups antiguos en B2 (solo hay $FILE_COUNT)"
    fi
  else
    log_message "ERROR: Falló la subida a B2"
  fi
else
  log_message "ERROR: Falló la creación del backup"
fi

log_message "Proceso de respaldo completado"