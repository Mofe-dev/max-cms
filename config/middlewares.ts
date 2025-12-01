export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          // CRÍTICO: Añadir el dominio de R2 aquí (incluyendo el ID de tu cuenta)
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://market-assets.strapi.io',
            'https://02a7fbbf035bd49e589f5daebf915d18.r2.cloudflarestorage.com',
            'https://assets.maxchorkie.me'
            
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'https://market-assets.strapi.io',
            'https://02a7fbbf035bd49e589f5daebf915d18.r2.cloudflarestorage.com',
            'https://assets.maxchorkie.me'
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];
