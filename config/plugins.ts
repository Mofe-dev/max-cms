// ./config/plugins.js
module.exports = ({ env }) => ({
  // Se configura el plugin de 'upload'
  upload: {
    config: {
      // Usamos el proveedor de AWS S3 (compatible con Cloudflare R2)
      provider: 'aws-s3',
      providerOptions: {
        // [1] Credenciales del Token de R2 (tomadas de las variables de Railway)
        accessKeyId: env('R2_ACCESS_KEY_ID'),
        secretAccessKey: env('R2_ACCESS_KEY_SECRET'),
        
        // [2] Parámetros específicos de R2
        // El Endpoint debe ser la URL base de tu cuenta R2
        endpoint: env('R2_ENDPOINT'), 
        
        // [3] Nombre del Bucket y configuraciones del SDK
        params: {
          Bucket: env('R2_BUCKET'), // Nombre del bucket R2
        },
        
        // [4] Clave crítica: R2 requiere esta configuración
        // Le indica al SDK que use el estilo de URL compatible con R2/S3 genérico
        forcePathStyle: env.bool('R2_FORCE_PATH_STYLE', true),
        
        // [5] Región: Aunque R2 no usa regiones en el sentido tradicional,
        // el plugin S3 lo requiere. Usaremos un valor genérico.
        // Si no se define, el plugin puede fallar.
        region: env('R2_REGION', 'auto'), 
      },
      // Otras configuraciones del plugin de subida
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});