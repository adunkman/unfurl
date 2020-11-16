module.exports = {
  name: __filename,
  register: async (server, options) => {
    await server.register({
      plugin: require('hapi-pino'),
      options: {
        prettyPrint: process.env.NODE_ENV !== 'production',
        redact: ['req.headers.authorization'],
        level: options.logLevel,
      },
    });
  },
};
