module.exports = {
  method: 'GET',
  path: '/',
  handler: ({ server }) => {
    return {
      documentation_url: 'https://www.unfurl.page/documentation',
      page_url: `${server.info.uri}/page`,
    };
  },
};
