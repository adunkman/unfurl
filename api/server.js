const Hapi = require('@hapi/hapi');

exports.init = async ({
  host = 'example.com',
  port,
  logLevel = 'fatal',
} = {}) => {
  const server = Hapi.server({
    host,
    port,
    tls: process.env.NODE_ENV === 'production',
    routes: {
      json: { space: 2 },
      validate: {
        failAction: (_request, _h, err) => err,
      },
    },
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true,
    },
  });

  server.route(require('./routes/get'));
  server.route(require('./routes/page/get'));

  server.register({
    plugin: require('hapi-pino'),
    options: {
      prettyPrint: process.env.NODE_ENV !== 'production',
      redact: ['req.headers.authorization'],
      level: logLevel,
    },
  });

  return server;
};
