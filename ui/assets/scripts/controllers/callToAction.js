const { Controller } = require('stimulus');
const User = require('../models/User')();

module.exports = class CallToActionController extends Controller {
  async connect() {
    const hasUser = await User.isAuthenticated();

    if (hasUser) {
      this.element.innerText = 'Your account';
      this.element.href = this.element.dataset.accountHref;
    }
  }
};
