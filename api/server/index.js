const Hapi = require('@hapi/hapi');

exports.init = async ({
  host = 'example.com',
  port,
  logLevel = 'fatal',
  dynamoDBEndpoint,
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

  await server.register([
    {
      plugin: require('./plugins/logging'),
      options: { logLevel },
    },
    {
      plugin: require('./plugins/keystore'),
      options: { dynamoDBEndpoint },
    },
    require('./plugins/authentication'),
    require('./plugins/friendlyErrors'),
  ]);

  server.route(require('../routes/index'));
  server.route(require('../routes/pages/show'));
  server.route(require('../routes/keys/destroy'));
  server.route(require('../routes/keys/index'));
  server.route(require('../routes/keys/new'));

  await server.initialize();

  return server;
};
