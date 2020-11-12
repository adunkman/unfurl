const server = require('./server');
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const host = process.env.HOST || 'localhost';
const logLevel = process.env.LOG_LEVEL || 'debug';

(async () => {
  const api = await server.init({ host, port, logLevel });
  api.start();
})();
