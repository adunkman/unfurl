const Boom = require('@hapi/boom');
const ApiKey = require('../../models/ApiKey');

module.exports = {
  name: __filename,
  register: async (server, options) => {
    await server.register(require('hapi-auth-bearer-token'));

    server.auth.strategy('key', 'bearer-access-token', {
      accessTokenName: 'key',
      allowQueryToken: true,
      tokenType: 'Key',
      validate: async (request, token, h) => {
        const key = await ApiKey.find({ key: token });

        return {
          isValid: !!key,
          credentials: key,
        };
      },
      unauthorized: message => {
        switch (message) {
          case null:
            return Boom.unauthorized(
              "An API key is required, either as a header ('Authorization: Key [your-api-key]') or as a querystring parameter ('?key=[your-api-key]').",
            );
          case 'Bad token':
            return Boom.unauthorized(`The API key specified is not valid.`);
          default:
            return Boom.unauthorized(message);
        }
      },
    });

    server.auth.default('key');
  },
};
