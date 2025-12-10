# Usa una imagen base de Node que sea compatible
FROM node:20-slim

# Instalación de librerías de procesamiento (libvips) y el decodificador de HEIF/HEIC
# Esto es lo que le falta a tu servidor para LEER el archivo HEIF.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    libvips-dev \
    # 🚨 LIBRERÍA CRÍTICA: Añadir el soporte para HEIF/HEIC
    libheif-dev && \
    rm -rf /var/lib/apt/lists/*
    
# ... (El resto de tu Dockerfile, como WORKDIR, COPY, RUN yarn install, EXPOSE, CMD)