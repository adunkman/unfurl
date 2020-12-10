self.process = { env: require('@params') };

const { Application } = require('stimulus');

const application = Application.start();

application.register('callToAction', require('./controllers/callToAction'));
application.register('clipboard', require('./controllers/clipboard'));
application.register('logout', require('./controllers/logout'));
application.register('menu', require('./controllers/menu'));
application.register('preview', require('./controllers/preview'));
application.register('react', require('./controllers/react'));
application.register(
  'requireAuthentication',
  require('./controllers/requireAuthentication'),
);
