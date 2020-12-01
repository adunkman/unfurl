const Boom = require('@hapi/boom');
const UserScope = require('../../models/UserScope');
const { httpClient } = require('../../util/httpClient');

module.exports = {
  method: 'GET',
  path: '/sessions/new',
  options: {
    auth: {
      strategy: 'github',
      mode: 'try',
    },
    pre: [
      {
        assign: 'emails',
        method: async request => {
          if (!request.auth.isAuthenticated) {
            throw Boom.unauthorized(request.auth.error);
          }

          const client = httpClient(request.log.bind(request));
          const { payload } = await client.get(
            'https://api.github.com/user/emails',
            {
              headers: {
                accept: 'application/vnd.github.v3+json',
                authorization: `token ${request.auth.credentials.token}`,
                'user-agent': 'https://github.com/adunkman/unfurl',
              },
              json: true,
            },
          );

          return payload
            .sort((a, b) => (a.primary ? -1 : b.primary ? 1 : 0))
            .map(o => o.email);
        },
      },
    ],
  },
  handler: async (request, h) => {
    if (!request.auth.isAuthenticated) {
      throw Boom.unauthorized(request.auth.error);
    }

    const user = {
      emails: request.pre.emails,
      name: request.auth.credentials.profile.displayName,
    };

    const session = {
      user,
      scope: UserScope.scopesForUser(user),
    };

    request.cookieAuth.set(session);

    return session;
  },
};
