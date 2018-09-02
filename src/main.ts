import { Express } from 'express';
import { ApolloEngine } from 'apollo-engine';
import { ApolloServer, IResolvers } from 'apollo-server-express';
import { DocumentNode } from 'graphql';
import { createServer, Server as HttpServer } from 'http';
import { verify, VerifyOptions } from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';
import {
  connect as mongooseConnect,
  ConnectionOptions as MongooseConnectionOption,
  disconnect as mongooseDisconnect,
  Mongoose
} from 'mongoose';

import app from './app';
import environment from './environments';
import resolvers from './app/resolvers';
import typeDefs from './app/schema';
import { Environment } from './environments/environment.model';
import { AuthService } from './app/auth/auth.service';

/**
 * Bootstrap application.
 * @param {Express} expressApp - Express app.
 * @param {Environment} env - Environment configuration.
 */
async function bootstrapAsync(expressApp: Express, env: Environment): Promise<void> {
  try {
    // Connect to MongoDB.
    await connectMongoDbAsync(
      env.databases.mongo.uri,
      { config: { autoIndex: (env.name === 'development') } }
    );

    // Create HTTP server.
    const httpServer = createHttpServer(
      expressApp,
      resolvers,
      typeDefs,
      env.apollo.introspection,
      env.apollo.playground,
      env.apollo.cors.origin
    );

    // Start Apollo Engine.
    const apolloEngine = await startApolloEngineAsync(httpServer, env.port, env.apollo.engine.apiKey);

    // Hot module replacement.
    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(async () => {
        await apolloEngine.stop();
        await mongooseDisconnect();
        httpServer.close();
      });
    }
  } catch (error) {
    console.error(error);
  }
}

bootstrapAsync(app, environment);

/**
 * Connection to MongoDB.
 * @param {string} uri - MongoDB URI.
 * @param {MongooseConnectionOption} option - Mongoose connection option.
 * @returns {Promise<Mongoose>} - Promise, which resolves with a mongoose instance.
 */
async function connectMongoDbAsync(uri: string, option: MongooseConnectionOption): Promise<Mongoose> {
  const mongoose = await mongooseConnect(uri, option);
  console.log(`Connected to MongoDB: ${uri}. `);
  mongoose.connection.on('error', () => console.error(`Connection to MongoDB "${uri}" failed. `));

  return mongoose;
}

/**
 * Create apollo server.
 * @param {IResolvers} resolvers - Resolvers.
 * @param {DocumentNode} typeDefs - Type definitions.
 * @param {boolean} introspection - Set to `true` if introspection is enabled; `false` otherwise.
 * @param {boolean} playground - Set to `true` if playground is enabled; `false` otherwise.
 * @returns {ApolloServer} - Apollo Server.
 */
function createApolloServer(
  resolvers: IResolvers,
  typeDefs: DocumentNode,
  introspection: boolean,
  playground: boolean
): ApolloServer {
  return new ApolloServer({
    introspection,
    playground,
    resolvers,
    typeDefs,
    cacheControl: true,
    context: async ({ req, connection }: { req: { user: any }, connection: { context } }) => {
      let context = null;

      if (connection && Object.prototype.hasOwnProperty.call(connection, 'context') && connection.context) {
        context = connection.context;
      } else {
        context = (req && Object.prototype.hasOwnProperty.call(req, 'user') && req.user) ?
          { user: req.user } : null;
      }

      return context;
    },
    engine: false,
    subscriptions: {
      onConnect: async (connectionParams: { authToken }) => {
        const context: any = { };

        if (
          connectionParams &&
          Object.prototype.hasOwnProperty.call(connectionParams, 'authToken') &&
          connectionParams.authToken
        ) {
          context.user = await verifyJwtAsync(
            connectionParams.authToken,
            AuthService.jwtVerifyOptions,
            AuthService.jwksRsaOptions
          );
        }

        return context;
      }
    },
    tracing: true
  });
}

/**
 * Create HTTP server.
 * @param {Express} expressApp - Express app.
 * @param {IResolvers} resolvers - Resolvers.
 * @param {DocumentNode} typeDefs - Type definitions.
 * @param {boolean} introspection - Set to `true` if introspection is enabled; `false` otherwise.
 * @param {boolean} playground - Set to `true` if playground is enabled; `false` otherwise.
 * @param {any} origin - CORS origin.
 */
function createHttpServer(
  expressApp: Express,
  resolvers: IResolvers,
  typeDefs: DocumentNode,
  introspection: boolean,
  playground: boolean,
  origin: any
): HttpServer {
  const apolloServer = createApolloServer(
    resolvers,
    typeDefs,
    introspection,
    playground
  );

  apolloServer.applyMiddleware({
    app: expressApp,
    cors: { origin }
  });

  const httpServer = createServer(expressApp);
  apolloServer.installSubscriptionHandlers(httpServer);

  return httpServer;
}

/**
 * Start Apollo Engine.
 * @param {HttpServer} httpServer - HTTP server.
 * @param {number} port - Port number.
 * @param {string} apiKey - Apollo Engine API key.
 * @returns {Promise<ApolloEngine>} - Promise, which resolves with Apollo Engine.
 */
async function startApolloEngineAsync(httpServer: HttpServer, port: number, apiKey: string): Promise<ApolloEngine> {
  const apolloEngine = new ApolloEngine({ apiKey });

  await apolloEngine.listen({ httpServer, port });
  console.log(`GraphQL server listening on port: ${port}. `);

  return apolloEngine;
}

/**
 * Verify JSON Web Token.
 * @param {string} jwt - JSON Web Token.
 * @param {VerifyOptions} jwtVerifyOptions - JSON Web Token verify options.
 * @param {jwksRsa.Options} jwksRsaOptions - JSON Web Key Set RSA options.
 * @returns {Promise<any>} - Promise, which resolves with decoded token payload; Rejects with error otherwise.
 */
function verifyJwtAsync(jwt: string, jwtVerifyOptions: VerifyOptions, jwksRsaOptions: jwksRsa.Options): Promise<any> {
  return new Promise(
    (resolve, reject) => {
      verify(
        jwt,
        ((header, callback) => {
          const jwksClient = jwksRsa(jwksRsaOptions);

          jwksClient.getSigningKey(header.kid, (err, key) => {
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
          });
        }) as any,
        jwtVerifyOptions,
        (err: Error, decoded: any) => {
          if (err) { reject(err); }
          else { resolve(decoded); }
        }
      );
    }
  );
}
