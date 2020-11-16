module.exports = {
  name: __filename,
  register: async server => {
    server.ext('onPreResponse', ({ response }, h) => {
      if (!response.isBoom) {
        return h.continue;
      }

      const error = response;
      const customResponse = h.response({
        error: `${error.output.statusCode} ${error.output.payload.error}`,
        message: error.message,
        documentation_url: 'https://www.unfurl.page/documentation',
      });

      customResponse.code(error.output.statusCode);
      Object.entries(error.output.headers).forEach(([key, value]) => {
        customResponse.header(key, value);
      });

      return customResponse;
    });
  },
};
