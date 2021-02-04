const { Controller } = require('stimulus');

module.exports = class ClipboardController extends Controller {
  static values = { text: String };

  copy() {
    if (this.copyWithExecCommand(this.textValue)) {
      this.showSuccess();
    }
  }

  copyWithExecCommand(text) {
    const textarea = document.createElement('textarea');
    textarea.style.opacity = 0;
    textarea.style.position = 'absolute';
    textarea.value = text;
    this.element.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const didSucceed = document.execCommand('copy');
    textarea.remove();
    return didSucceed;
  }

  showSuccess() {
    this.previousText = this.previousText || this.element.innerText;
    this.element.innerText = 'Copied!';
    clearTimeout(this.resetTextTimeout);
    this.resetTextTimeout = setTimeout(() => {
      this.element.innerText = this.previousText;
    }, 700);
  }
};
