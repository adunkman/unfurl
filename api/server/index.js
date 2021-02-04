const Hapi = require('@hapi/hapi');

exports.init = async ({
  host = 'api.example.com',
  port,
  logLevel = 'fatal',
  isProduction = false,
  uiUrl = 'http://ui.example.com',
  dynamoDBEndpoint,
  adminEmailsCsv,
  useTestAuthentication,
  githubClientId,
  githubClientSecret,
  cookieEncryptionSecret,
} = {}) => {
  const server = Hapi.server({
    host,
    port,
    tls: isProduction,
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
      options: { logLevel, isProduction },
    },
    {
      plugin: require('./plugins/services'),
      options: { dynamoDBEndpoint, adminEmailsCsv },
    },
    {
      plugin: require('./plugins/authKey'),
      options: { useTestAuthentication },
    },
    {
      plugin: require('./plugins/authUser'),
      options: {
        isProduction,
        githubClientId,
        githubClientSecret,
        cookieEncryptionSecret,
      },
    },
    require('./plugins/friendlyErrors'),
  ]);

  server.route(require('../routes/index'));

  server.route(require('../routes/keys/destroy'));
  server.route(require('../routes/keys/edit'));
  server.route(require('../routes/keys/index'));
  server.route(require('../routes/keys/new'));
  server.route(require('../routes/keys/show'));

  server.route(require('../routes/pages/show'));

  server.route(require('../routes/sessions/new'));
  server.route(require('../routes/sessions/index'));
  server.route(require('../routes/sessions/destroy'));

  await server.initialize();

  return server;
};
