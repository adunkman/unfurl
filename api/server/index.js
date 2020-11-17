const Hapi = require('@hapi/hapi');
const { promisify } = require('util');
const glob = promisify(require('glob'));

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
      plugin: require('./plugins/persistence'),
      options: { dynamoDBEndpoint },
    },
    require('./plugins/authentication'),
    require('./plugins/friendlyErrors'),
  ]);

  const routes = await glob('../routes/**/!(*.test).js', { cwd: __dirname });

  server.route(routes.map(require));

  await server.initialize();

  return server;
};
