#!/bin/bash

# Script para realizar backups de PostgreSQL y subirlos a Backblaze B2
# Retiene backups por 7 días

# Configuración
DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backups"
BACKUP_FILE="$BACKUP_DIR/sistema_tours_$DATE.sql.gz"
LOG_FILE="$BACKUP_DIR/backup_log.txt"

# Credenciales Backblaze B2 (se recomienda usar variables de entorno)
B2_KEY_ID=${B2_KEY_ID:-"c331dab6a0c1"}
B2_APP_KEY=${B2_APP_KEY:-"0052d6ba43deba114f2a4f83dda099d5f3d4a01f07"}
B2_BUCKET=${B2_BUCKET:-"backup_ocean_tours"}

# Asegurar que el directorio de backups existe
mkdir -p $BACKUP_DIR

echo "$(date): Iniciando respaldo de base de datos..." | tee -a $LOG_FILE

# Ejecutar pg_dump dentro del contenedor de PostgreSQL
echo "$(date): Ejecutando pg_dump..." | tee -a $LOG_FILE
docker exec sistema-tours-db pg_dump -U postgres sistema_tours | gzip > $BACKUP_FILE

# Verificar si el backup fue exitoso
if [ $? -eq 0 ]; then
  echo "$(date): Backup exitoso: $BACKUP_FILE" | tee -a $LOG_FILE
  
  # Instalar b2 si no está instalado
  if ! command -v b2 &> /dev/null; then
    echo "$(date): Instalando b2 CLI..." | tee -a $LOG_FILE
    pip install --quiet b2
  fi
  
  # Autorizar con B2
  echo "$(date): Autorizando con Backblaze B2..." | tee -a $LOG_FILE
  b2 authorize-account $B2_KEY_ID $B2_APP_KEY
  
  # Subir el archivo
  echo "$(date): Subiendo backup a B2..." | tee -a $LOG_FILE
  b2 upload-file $B2_BUCKET $BACKUP_FILE "backups/$(basename $BACKUP_FILE)"
  
  # Verificar si la subida fue exitosa
  if [ $? -eq 0 ]; then
    echo "$(date): Backup subido correctamente a B2" | tee -a $LOG_FILE
    
    # Limpieza de backups antiguos (local)
    echo "$(date): Eliminando backups locales antiguos..." | tee -a $LOG_FILE
    find $BACKUP_DIR -name "sistema_tours_*.sql.gz" -type f -mtime +7 -delete
    
    # Limpieza de backups antiguos en B2
    echo "$(date): Listando backups en B2 para limpieza..." | tee -a $LOG_FILE
    OLD_BACKUPS=$(b2 ls --long $B2_BUCKET backups | grep -E 'sistema_tours_[0-9]{4}-[0-9]{2}-[0-9]{2}.sql.gz' | sort -r | tail -n +8)
    
    if [ ! -z "$OLD_BACKUPS" ]; then
      echo "$(date): Eliminando backups antiguos de B2..." | tee -a $LOG_FILE
      echo "$OLD_BACKUPS" | while read -r line; do
        FILE_NAME=$(echo $line | awk '{print $6}')
        if [ ! -z "$FILE_NAME" ]; then
          echo "$(date): Eliminando $FILE_NAME de B2..." | tee -a $LOG_FILE
          b2 delete-file-version backups/$FILE_NAME
        fi
      done
    fi
    
  else
    echo "$(date): ERROR: Falló la subida a B2" | tee -a $LOG_FILE
  fi
else
  echo "$(date): ERROR: Falló la creación del backup" | tee -a $LOG_FILE
fi

echo "$(date): Proceso de respaldo completado" | tee -a $LOG_FILE