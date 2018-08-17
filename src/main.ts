import { ApolloEngine } from 'apollo-engine';
import { Express } from 'express';

import app from './app'
import environment from './environments';

async function bootstrapAsync(expressApp: Express, port: number): Promise<void> {
  try {
    const engine = new ApolloEngine({ apiKey: environment.apollo.engine.apiKey });

    await engine.listen({ expressApp, port });
    console.log(`GraphQL server listening on port: ${port}. `);

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => engine.stop());
    }

  } catch (error) {
    console.error(error);
  }
}

bootstrapAsync(app, environment.port);
