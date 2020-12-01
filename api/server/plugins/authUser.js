const Cookie = require('@hapi/cookie');
const Bell = require('@hapi/bell');

module.exports = {
  name: 'unfurl/plugins/authUser',
  register: async (
    server,
    {
      isProduction,
      githubClientId = 'invalid_client_id',
      githubClientSecret = 'invalid_client_secret',
      cookieEncryptionSecret = 'insecure_default_cookie_encryption_secret',
    },
  ) => {
    await server.register(Cookie);
    await server.register(Bell);

    server.auth.strategy('github', 'bell', {
      provider: 'github',
      password: cookieEncryptionSecret,
      isSecure: isProduction,
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    });

    server.auth.strategy('cookie', 'cookie', {
      cookie: {
        password: cookieEncryptionSecret,
        path: '/',
        clearInvalid: true,
        isSecure: isProduction,
        ttl: 1 * 60 * 60 * 1000, // one hour
      },
      keepAlive: true,
    });
  },
};
