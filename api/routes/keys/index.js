const ApiKey = require('../../models/ApiKey');

module.exports = {
  method: 'GET',
  path: '/keys',
  options: {
    pre: [
      {
        method: async request => {
          if (request.auth.credentials.isAdmin()) {
            return ApiKey.all();
          } else {
            return ApiKey.where({ email: request.auth.credentials.email });
          }
        },
        assign: 'keys',
      },
    ],
  },
  handler: async request => {
    return request.pre.keys;
  },
};
