module.exports = {
  method: 'DELETE',
  path: '/sessions',
  options: {
    auth: {
      strategy: 'cookie',
      mode: 'try',
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
