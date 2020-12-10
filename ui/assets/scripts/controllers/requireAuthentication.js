const { Controller } = require('stimulus');
const User = require('../models/User')();

module.exports = class RequireAuthenticationController extends Controller {
  static targets = ['currentPath'];

  connect() {
    if (this.hasCurrentPathTarget) {
      this.currentPathTarget.href = this.currentPathTarget.href.replace(
        '[currentPath]',
        location.pathname,
      );
    }

    this.assertAuthentication();
  }

  async assertAuthentication() {
    const hasUser = await User.isAuthenticated();

    if (!hasUser) {
      this.element.classList.remove('is-hidden');
    }
  }
};
