const Boom = require('@hapi/boom');
const ApiKey = require('../../models/ApiKey');
const UserScope = require('../../models/UserScope');

module.exports = {
  method: 'DELETE',
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
        method: async (request, h) => {
          const key = ApiKey.find({ key: request.params.key });

          const isAdmin = UserScope.isAdmin(request.auth.credentials);
          const isOwnKey = request.auth.credentials.user.emails.includes(
            key.email,
          );

          if (!isAdmin && !isOwnKey) {
            throw Boom.forbidden(
              `You are not allowed to modify other API keys. If you intend to delete a key, authenticate using that key to perform this request.`,
            );
          }

          return h.continue;
        },
      },
      {
        assign: 'key',
        method: async request => {
          return ApiKey.delete({ key: request.params.key });
        },
      },
    ],
  },
  handler: async request => {
    return request.pre.key;
  },
};
