module.exports = {
  method: 'GET',
  path: '/keys',
  options: {
    pre: [
      {
        method: async request => {
          const { keystore } = request.server.app;
          return keystore.all();
        },
        assign: 'keys',
      },
    ],
  },
  handler: async request => {
    return request.pre.keys;
  },
};
