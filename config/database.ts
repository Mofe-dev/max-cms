// Asegúrate de que este archivo está nombrado como database.js (JavaScript)
// Si usas TypeScript (database.ts), necesitarás una fase de compilación.

import path from "path";

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

  // 3. Fallback: Si no hay DATABASE_URL (Entorno Local/Desarrollo)
  // Usarás la configuración de SQLite (no persistente en Railway)
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };
};