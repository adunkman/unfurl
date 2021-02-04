const Joi = require('joi');
const Boom = require('@hapi/boom');
const ApiKey = require('../../models/ApiKey');
const UserScope = require('../../models/UserScope');

module.exports = {
  method: 'PUT',
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
    validate: {
      payload: Joi.object({
        api_key: Joi.string(),
        api_version: Joi.number().integer(),
        created_at: Joi.string().isoDate(),
        owner_email: Joi.string().email(),
      }),
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
      {
        method: async (request, h) => {
          const { key } = request.pre;
          const { owner_email } = request.payload;
          const user_emails = request.auth.credentials.user.emails;

          if (owner_email) {
            if (!user_emails.includes(owner_email)) {
              throw Boom.badRequest(
                `${owner_email} is not one of your authorized email addresses (${user_emails.join(
                  ', ',
                )}).`,
              );
            }

            key.email = owner_email;
          }

          await key.save();

          return h.continue;
        },
      },
    ],
  },
  handler: async request => {
    return request.pre.key;
  },
};
