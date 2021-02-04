module.exports = {
  method: 'DELETE',
  path: '/sessions',
  options: {
    auth: {
      strategy: 'cookie',
      mode: 'try',
    },
    cors: {
      origin: ['*://localhost:*', '*://0.0.0.0:*', '*://127.0.0.1:*'],
      credentials: true,
    },
    pre: [
      (request, h) => {
        request.cookieAuth.clear();
        return h.continue;
      },
    ],
  },
  handler: async (request, h) => {
    return {
      message: request.auth.isAuthenticated
        ? 'You are now logged out.'
        : 'You have no active session.',
    };
  },
};
