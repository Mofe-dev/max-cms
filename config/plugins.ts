// Archivo: ./config/plugins.js

module.exports = ({ env }) => {
  const isProduction = env('NODE_ENV') === 'production';
  
  // Si NO es producción, usar proveedor local
  if (!isProduction) {
    return {
      upload: {
        config: {
          provider: 'local',
        },
      },
    };
  }

  // Si es producción, usar R2/S3
  return {
    upload: {
      config: {
        // 1. CONFIGURACIÓN DEL PROVEEDOR (R2)
        provider: 'aws-s3',
        providerOptions: {
          endpoint: env('R2_ENDPOINT'),
          baseUrl: env('R2_PUBLIC_URL'),
          credentials: { 
            accessKeyId: env('R2_ACCESS_KEY_ID'),
            secretAccessKey: env('R2_ACCESS_KEY_SECRET'),
          },
          params: {
            Bucket: env('R2_BUCKET'),
          },
          forcePathStyle: env.bool('R2_FORCE_PATH_STYLE', true),
          region: env('R2_REGION', 'auto'), 
        },
        
        // 2. CONFIGURACIÓN DE OPTIMIZACIÓN DE SHARP (DENTRO DE 'config')
        
        // Limitar tamaño de subida a 10MB
        sizeLimit: 10000000, 
        
        // Habilitar la generación de formatos responsive
        responsiveDimensions: true, 
        
        // Ajuste fino: Desactivar corrección de orientación automática
        autoOrientation: false, 
        
        // 🚨 CONFIGURACIÓN CRÍTICA: Definir la compresión y el formato para TODOS
        // Esto se logra usando 'sharpOptions' o 'actionOptions' (depende de tu versión de Strapi),
        // pero la forma más compatible es forzarlo en el post-procesamiento.
        
        // Para versiones más nuevas de Strapi (>4.x), la configuración se hace en 'breakpoints'
        breakpoints: {
          // LARGE: La imagen 'original' optimizada
          large: {
            width: 2560,
            // 🚨 AÑADIDO: Opciones para forzar WebP y Calidad 80 para este formato
            format: 'webp',
            quality: 80,
          },
          // MEDIUM:
          medium: {
            width: 750,
            format: 'webp',
            quality: 80,
          },
          // SMALL:
          small: {
            width: 500,
            format: 'webp',
            quality: 80,
          },
          // THUMBNAIL:
          thumbnail: {
            width: 200,
            format: 'webp',
            quality: 80,
          },
        },
      },
    },
  };
};