const Joi = require('joi');
const ApiKey = require('../../models/ApiKey');

module.exports = {
  method: 'POST',
  path: '/keys',
  options: {
    auth: {
      strategy: 'cookie',
      access: {
        entity: 'user',
      },
    },
    validate: {
      payload: Joi.object({
        email: Joi.string().email(),
      }),
    },
    pre: [
      {
        assign: 'key',
        method: async request => {
          return ApiKey.create({ email: request.payload.email });
        },
      },
    ],
  },
  handler: async request => {
    return {
      key: request.pre.key,
    };
  },
};
