export class Environment {
  apollo: {
    endpoint: string,
    engine: {
      apiKey: string;
    },
    introspection: boolean,
    playground: boolean
  };
  name: string;
  port: number;
}
