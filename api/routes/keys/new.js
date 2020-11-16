const Joi = require('joi');

module.exports = {
  method: 'POST',
  path: '/keys',
  options: {
    validate: {
      payload: Joi.object({
        email: Joi.string().email(),
      }),
    },
    pre: [
      {
        method: async request => {
          const { keystore } = request.server.app;
          return keystore.create({ email: request.payload.email });
        },
        assign: 'key',
      },
    ],
  },
  handler: async request => {
    return request.pre.key;
  },
};
