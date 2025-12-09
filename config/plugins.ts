// ./config/plugins.js (Asegúrate de que no es .ts si no lo estás compilando)

module.exports = ({ env }) => {
  
  // 1. Detectar si estamos en producción (o cualquier entorno que no sea desarrollo)
  // Nota: Railway establece NODE_ENV=production automáticamente.
  const isProduction = env('NODE_ENV') === 'production';
  
  // 2. Si NO es producción, usar el proveedor local.
  if (!isProduction) {
    return {
      upload: {
        config: {
          provider: 'local', // Usa el almacenamiento local por defecto
        },
      },
    };
  }

  // 3. Si es producción, usar el proveedor R2/S3
  return {
    upload: {
      config: {
        provider: 'aws-s3',
        providerOptions: {
          
          // CRÍTICO: El SDK de AWS busca el endpoint aquí.
          endpoint: env('R2_ENDPOINT'),
          baseUrl: env('R2_PUBLIC_URL'),

          // CORRECCIÓN CLAVE: Agrupar credenciales en 'credentials'
          credentials: { 
            accessKeyId: env('R2_ACCESS_KEY_ID'),
            secretAccessKey: env('R2_ACCESS_KEY_SECRET'),
          },
          
          params: {
            Bucket: env('R2_BUCKET'),
          },
          
          forcePathStyle: env.bool('R2_FORCE_PATH_STYLE', true),
          
          // La región es necesaria para el SDK de AWS, incluso si R2 no la usa.
          region: env('R2_REGION', 'auto'), 
        },
        actionOptions: {
          upload: {},
          transform:{
            // FORZAR FORMATO: Convertir cualquier entrada (HEIF, JPEG, PNG) a WebP
          default: [{
            // Opciones de procesamiento Sharp que se aplicarán por defecto
            format: 'webp', // SALIDA: Todos los formatos serán WebP
            // CALIDAD: Compresión al 80% (Punto óptimo)
            webp: {
              quality: 80, 
            },
          }],
            // DEFINIR ANCHOS MÁXIMOS Y FORMATOS ESPECÍFICOS
          // Esta sección es CRÍTICA para evitar subir archivos de 5000px y reducir costos.
          formats: [
            // 1. FORMATO ORIGINAL OPTIMIZADO: Máximo 2560px
            // Strapi guardará la imagen original de la subida con estas reglas:
            {
              name: 'large', // Sobreescribimos el formato 'large' o creamos uno nuevo
              // Redimensionar si es necesario (conserva la relación de aspecto)
              // La imagen se redimensiona proporcionalmente para que el lado más largo sea 2560px
              width: 2560, 
              // Convertir a WebP con calidad 80 (ya definido en 'default')
            },
            
            // 2. FORMATO MEDIUM: Para la mayoría de las visualizaciones en escritorio
            {
              name: 'medium',
              width: 750, // Ancho 750px (proporcional)
              // Convierte a WebP calidad 80
            },
            
            // 3. FORMATO THUMBNAIL: Miniaturas rápidas para listados
            {
              name: 'thumbnail',
              width: 250, // Ancho 250px
              // Convierte a WebP calidad 80
            }
            // Los formatos 'large', 'medium' y 'thumbnail' se aplicarán SÓLO si la imagen es mayor
          ],
          },
          uploadStream: {},
          delete: {},
        },
      },
    },
  };
};