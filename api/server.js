const Hapi = require('@hapi/hapi');
const Wreck = require('@hapi/wreck');

const init = async (host, port) => {
  const server = Hapi.server({
    host,
    port,
    routes: {
      json: {
        space: 2
      },
      validate: {
        failAction: (_request, _h, err) => err
      }
    }
  });

  server.route(require('./routes/get'));
  server.route(require('./routes/page/get'));

  server.register({
    plugin: require('hapi-pino'),
    options: {
      prettyPrint: process.env.NODE_ENV !== 'production',
      redact: ['req.headers.authorization']
    }
  });

  server.decorate('toolkit', 'wreck', function () {
    const wreck = Wreck.defaults({
      events: true,
      gunzip: true,
    });

    wreck.events.on('response', (err, details) => {
      if (err) {
        this.request.log('wreck', {
          request_url: details.uri.href,
          error: err
        });
      }
      else {
        this.request.log('wreck', {
          request_url: details.uri.href,
          duration_ms: Date.now() - details.start
        });
      }
    });

    return wreck;
  });

  return server;
};


module.exports = { init };
