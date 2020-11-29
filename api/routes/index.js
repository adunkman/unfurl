module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: false,
  },
  handler: ({ server }) => {
    return {
      documentation_url: `${server.settings.app.uiUrl}/documentation`,
      pages_url: `${server.info.uri}/pages`,
    };
  },
};
