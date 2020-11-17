const Boom = require('@hapi/boom');
const ApiKey = require('../../models/ApiKey');

module.exports = {
  method: 'DELETE',
  path: '/keys/{key}',
  options: {
    pre: [
      {
        method: async (request, h) => {
          const isAdmin = request.auth.credentials.isAdmin();
          const isOwnKey = request.params.key === request.auth.credentials.key;

          if (!isAdmin && !isOwnKey) {
            throw Boom.forbidden(
              `You are not allowed to modify other API keys. If you intend to delete a key, authenticate using that key to perform this request.`,
            );
          }

          return h.continue;
        },
      },
      {
        method: async request => {
          return ApiKey.delete({ key: request.params.key });
        },
        assign: 'key',
      },
    ],
  },
  handler: async request => {
    return request.pre.key;
  },
};
