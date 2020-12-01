module.exports = {
  name: 'unfurl/plugins/logging',
  register: async (server, { logLevel, isProduction }) => {
    await server.register({
      plugin: require('hapi-pino'),
      options: {
        prettyPrint: !isProduction,
        redact: ['req.headers.authorization'],
        level: logLevel,
      },
    });
  },
};
