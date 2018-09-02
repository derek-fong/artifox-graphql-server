import { Environment } from './environment.model';

const defaultPort = 4000;
const environment: Environment = {
  apollo: {
    cors: {
      origin: process.env.APOLLO_CORS_ORIGIN.replace(/\s/g, '').split(',')
    },
    engine: {
      apiKey: process.env.APOLLO_ENGINE_API_KEY
    },
    introspection: process.env.APOLLO_INTROSPECTION === 'true',
    playground: process.env.APOLLO_PLAYGROUND === 'true'
  },
  auth: {
    clientId: process.env.AUTH_CLIENT_ID,
    domain: process.env.AUTH_DOMAIN,
    jwksUri: process.env.AUTH_JWKS_URI,
    namespace: process.env.AUTH_NAMESPACE
  },
  databases: {
    mongo: {
      uri: process.env.DB_MONGO_URI
    }
  },
  name: process.env.NODE_ENV,
  port: (process.env.PORT) ? parseInt(process.env.PORT, 10) : defaultPort
};

export default environment;
