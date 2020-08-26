const server = require('./server');
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const host = process.env.HOST || 'localhost';

(async () => {
  const app = await server.init(host, port);
  app.start();
})();
