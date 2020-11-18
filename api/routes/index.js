module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: false,
  },
  handler: ({ server }) => {
    return {
      documentation_url: 'https://www.unfurl.page/documentation',
      page_url: `${server.info.uri}/pages`,
    };
  },
};
