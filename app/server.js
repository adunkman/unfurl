const Hapi = require('@hapi/hapi');

const init = async (host, port) => {
  const server = Hapi.server({
    host,
    port,
    routes: {
      validate: {
        failAction: (request, h, err) => {
          throw err;
        }
      }
    }
  });

  server.route(require('./expand/get'));

  server.register({
    plugin: require('hapi-pino'),
    options: {
      prettyPrint: process.env.NODE_ENV !== 'production',
      redact: ['req.headers.authorization']
    }
  });

  return server;
};


module.exports = { init };
