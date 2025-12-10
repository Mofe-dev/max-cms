const sharp = require('sharp'); // Sharp ya está instalado en entornos de Strapi

module.exports = (plugin) => {
  const originalUploadController = plugin.controllers.upload.upload;

  plugin.controllers.upload.upload = async (ctx) => {
    const { files } = ctx.request;

    if (!files || files.length === 0) {
      return originalUploadController(ctx);
    }

    // Iterar sobre cada archivo subido
    for (const file of files) {
      // 🚨 Solo procesar imágenes
      if (file.mime.startsWith('image')) {
        
        let sharpInstance = sharp(file.buffer);

        // Obtener metadatos para tomar decisiones
        const metadata = await sharpInstance.metadata();

        // 1. Redimensionamiento Máximo (2560px)
        // Solo redimensionar si el ancho es mayor a 2560px
        if (metadata.width > 2560) {
            sharpInstance = sharpInstance.resize(2560, null, {
                withoutEnlargement: true // Crucial: nunca aumentar resolución
            });
        }
        
        // 2. Conversión a WebP con Calidad 80
        const optimizedBuffer = await sharpInstance
          .webp({ quality: 80 }) 
          .toBuffer();

        // 3. Sobreescribir el archivo en Strapi antes de que lo suba a R2
        file.buffer = optimizedBuffer;
        file.mime = 'image/webp'; // Forzar el tipo MIME
        file.ext = '.webp';
        file.size = optimizedBuffer.length / 1000; // Recalcular el tamaño
      }
    }

    // Continuar con el flujo original de subida de Strapi a R2
    return originalUploadController(ctx);
  };
  return plugin;
};