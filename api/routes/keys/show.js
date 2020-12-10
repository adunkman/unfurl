const Boom = require('@hapi/boom');
const ApiKey = require('../../models/ApiKey');
const UserScope = require('../../models/UserScope');

module.exports = {
  method: 'GET',
  path: '/keys/{key}',
  options: {
    auth: {
      strategy: 'cookie',
      access: {
        entity: 'user',
      },
    },
    cors: {
      origin: ['*://localhost:*', '*://0.0.0.0:*', '*://127.0.0.1:*'],
      credentials: true,
    },
    pre: [
      {
        assign: 'key',
        method: async (request, h) => {
          const key = ApiKey.find({ key: request.params.key });

          const isAdmin = UserScope.isAdmin(request.auth.credentials);
          const isOwnKey = request.auth.credentials.user.emails.includes(
            key.email,
          );

          if (!isAdmin && !isOwnKey) {
            throw Boom.notFound();
          }

          return key;
        },
      },
    ],
  },
  handler: async request => {
    return request.pre.key;
  },
};
