const { Application } = require('stimulus');

const application = Application.start();

application.register('preview', require('./controllers/preview'));
