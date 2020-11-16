const Joi = require('joi');

module.exports = {
  method: 'DELETE',
  path: '/keys/{key}',
  options: {
    pre: [
      {
        method: async request => {
          const { keystore } = request.server.app;
          return keystore.delete({ key: request.params.key });
        },
        assign: 'key',
      },
    ],
  },
  handler: async request => {
    return request.pre.key;
  },
};
