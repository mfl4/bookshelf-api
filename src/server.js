/* eslint-disable no-undef */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes/bookRoutes');

const createServer = () => {
  return Hapi.server({
    port: process.env.PORT || 9000,
    host: process.env.HOST || 'localhost',
    routes: { cors: { origin: ['*'] } },
  });
};

const init = async () => {
  const server = createServer();

  server.route(routes);

  try {
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

init();