import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './schema';
import resolvers from './resolvers';
import environment from '../environments';

const app = express();
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  cacheControl: true,
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
  tracing: true,
  engine: false
});

apolloServer.applyMiddleware({ app });

export default app;
