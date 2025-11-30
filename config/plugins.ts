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
          uploadStream: {},
          delete: {},
        },
      },
    },
  };
};