import { Environment } from './environment.model';

const defaultPort = 4000;
const environment: Environment = {
  apollo: {
    engine: {
      apiKey: process.env.APOLLO_ENGINE_API_KEY
    },
    introspection: true
  },
  name: process.env.NODE_ENV,
  port: (process.env.PORT) ? parseInt(process.env.PORT) : defaultPort
};

export default environment;
