const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const dotenv = require('dotenv');
const { typeDefs } = require('./graphql/schema');
const { resolvers } = require('./graphql/resolvers');
const { buildContext } = require('./graphql/context');
const { pool } = require('./db/pool');

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required');
  process.exit(1);
}

async function start() {
  const app = express();
  const port = process.env.PORT || 4000;

  app.use(cors());
  app.get('/health', (_req, res) => res.json({ ok: true }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => buildContext(req),
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const httpServer = app.listen(port, () => {
    console.log(`API running on http://localhost:${port}${server.graphqlPath}`);
  });

  const shutdown = async (signal) => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    httpServer.close(async () => {
      await pool.end();
      console.log('Server closed, DB pool drained.');
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

