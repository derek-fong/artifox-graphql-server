export class Environment {
  apollo: {
    endpoint: string,
    engine: {
      apiKey: string;
    },
    introspection: boolean
  };
  name: string;
  port: number;
}
