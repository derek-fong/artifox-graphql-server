export class Environment {
  apollo: {
    cors: {
      origin: string[];
    };
    engine: {
      apiKey: string;
    };
    introspection: boolean;
    playground: boolean;
  };
  auth: {
    clientId: string;
    domain: string;
    jwksUri: string;
    namespace: string;
  };
  databases: {
    mongo: {
      uri: string;
    };
  };
  name: string;
  port: number;
}
