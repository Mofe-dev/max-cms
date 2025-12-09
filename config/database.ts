const { parse } = require('pg-connection-string'); // Necesitas instalarlo

module.exports = ({ env }) => {
  
  // 1. CRÍTICO: Detectar si Railway inyectó la URL de conexión (Producción)
  const dbUrl = env('DATABASE_URL');

  // 2. Si existe DATABASE_URL, configurar PostgreSQL
  if (dbUrl) {
    const config = parse(dbUrl); // Parsear la URL de conexión

    return {
      connection: {
        client: 'postgres',
        connection: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          // CRÍTICO: Forzar SSL para Railway
          ssl: {
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
          },
          schema: env('DATABASE_SCHEMA', 'public'),
        },
        pool: {
          min: env.int('DATABASE_POOL_MIN', 2),
          max: env.int('DATABASE_POOL_MAX', 10),
        },
      },
    };
  }

 
  return {
    connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'max'),
      user: env('DATABASE_USERNAME', 'felrichdev'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
      },
      schema: env('DATABASE_SCHEMA', 'public'),
    },
    debug: false,
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2),
      max: env.int('DATABASE_POOL_MAX', 10),
    },
  },
  };
};