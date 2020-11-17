const Joi = require('joi');
const ApiKey = require('../../models/ApiKey');

module.exports = {
  method: 'POST',
  path: '/keys',
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().email(),
      }),
    },
    pre: [
      {
        method: async request => {
          return ApiKey.create({ email: request.payload.email });
        },
        assign: 'key',
      },
    ],
  },
  handler: async request => {
    return request.pre.key;
  },
};
