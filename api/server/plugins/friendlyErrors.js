module.exports = {
  name: __filename,
  register: async server => {
    server.ext('onPreResponse', (request, h) => {
      const { response } = request;

      if (!response.isBoom) {
        return h.continue;
      }

      const error = response;
      request.log('error', error);

      const data = {
        error: `${error.output.statusCode} ${error.output.payload.error}`,
        message: error.message,
        documentation_url: 'https://www.unfurl.page/documentation',
      };

      if (server.info.address === '0.0.0.0') {
        data.stack = error.stack.split('\n');
      }

      const customResponse = h.response(data);

      customResponse.code(error.output.statusCode);
      Object.entries(error.output.headers).forEach(([key, value]) => {
        customResponse.header(key, value);
      });

      return customResponse;
    });
  },
};
