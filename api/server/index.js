const Hapi = require('@hapi/hapi');

exports.init = async (
  { host = 'example.com', uiUrl, port, logLevel = 'fatal' } = {},
  services = {},
) => {
  const server = Hapi.server({
    host,
    port,
    tls: process.env.NODE_ENV === 'production',
    app: { uiUrl },
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

  await server.register([
    {
      plugin: require('./plugins/logging'),
      options: { logLevel },
    },
    {
      plugin: require('./plugins/services'),
      options: services,
    },
    require('./plugins/authKey'),
    require('./plugins/friendlyErrors'),
  ]);

  server.route(require('../routes/index'));
  server.route(require('../routes/keys/destroy'));
  server.route(require('../routes/keys/index'));
  server.route(require('../routes/keys/new'));
  server.route(require('../routes/pages/show'));

  await server.initialize();

  return server;
};
