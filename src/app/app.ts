import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './schema';
import resolvers from './resolvers';

const app = express();
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  cacheControl: true,
  tracing: true,
  engine: false
});

apolloServer.applyMiddleware({ app });

export default app;
