const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const dotenv = require('dotenv');
const { typeDefs } = require('./graphql/schema');
const { resolvers } = require('./graphql/resolvers');
const { buildContext } = require('./graphql/context');

dotenv.config();

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

  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}${server.graphqlPath}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

