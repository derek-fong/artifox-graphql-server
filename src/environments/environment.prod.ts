import { Environment } from './environment.model';

const defaultPort = 4000;
const environment: Environment = {
  apollo: {
    endpoint: process.env.APOLLO_ENDPOINT,
    engine: {
      apiKey: process.env.APOLLO_ENGINE_API_KEY
    },
    introspection: process.env.APOLLO_INTROSPECTION === 'true'
  },
  name: process.env.NODE_ENV,
  port: (process.env.PORT) ? parseInt(process.env.PORT) : defaultPort
};

export default environment;
