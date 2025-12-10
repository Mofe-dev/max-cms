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
        
      },
    },
  };
};