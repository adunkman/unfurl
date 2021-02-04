const { Controller } = require('stimulus');

module.exports = class PreviewController extends Controller {
  static targets = ['url', 'key', 'output'];

  async update(event) {
    event.preventDefault();
    const { action, data } = this.serialize(event.target);
    const { error, response, body } = await this.tryFetch(`${action}?${data}`);

    this.outputTarget.textContent = JSON.stringify({ error, response, body });
  }

  async tryFetch(url) {
    try {
      const response = await fetch(url);
      const body = await response.json();
      return { response, body };
    } catch (error) {
      return { error };
    }
  }

  serialize(form) {
    const inputs = Array.from(form);
    const params = inputs
      .map(i => [i.name, i.value])
      .filter(([k, v]) => k && v);

    return {
      action: form.action,
      data: new URLSearchParams(Object.fromEntries(params)).toString(),
    };
  }
};
