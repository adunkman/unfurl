const { Controller } = require('stimulus');

module.exports = class MenuController extends Controller {
  static targets = ['container', 'overlay'];

  open() {
    this.containerTarget.classList.add('is-visible');
    this.overlayTarget.classList.add('is-visible');
  }

  close() {
    this.containerTarget.classList.remove('is-visible');
    this.overlayTarget.classList.remove('is-visible');
  }

  closeIfEscape({ code }) {
    if (code === 'Escape') {
      this.close();
    }
  }
};
