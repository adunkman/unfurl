const ApiKey = require('../../models/ApiKey');
const UserScope = require('../../models/UserScope');

module.exports = {
  method: 'GET',
  path: '/keys',
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
        assign: 'keys',
        method: async request => {
          const { credentials } = request.auth;

          if (UserScope.isAdmin(credentials)) {
            return ApiKey.all();
          } else {
            // TODO: allow querying for all user keys, instead of just keys
            // attached to the user’s primary email.
            return ApiKey.where({ email: credentials.user.emails[0] });
          }
        },
      },
    ],
  },
  handler: async request => {
    return request.pre.keys;
  },
};
