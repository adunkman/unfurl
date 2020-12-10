const { Controller } = require('stimulus');
const User = require('../models/User')();

module.exports = class LogoutController extends Controller {
  static values = { returnTo: String };

  connect() {
    this.logout();
  }

  async logout() {
    await User.logout();
    window.location.href = this.returnToValue;
  }
};
