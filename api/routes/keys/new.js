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
    cors: {
      origin: ['*://localhost:*', '*://0.0.0.0:*', '*://127.0.0.1:*'],
      credentials: true,
    },
    validate: {
      payload: Joi.object({
        owner_email: Joi.string().email().required(),
      }),
    },
    pre: [
      {
        assign: 'key',
        method: async request => {
          return ApiKey.create({ email: request.payload.owner_email });
        },
      },
    ],
  },
  handler: async request => {
    return request.pre.key;
  },
};
