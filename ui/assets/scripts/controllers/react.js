const { Controller } = require('stimulus');
const ReactDOM = require('react-dom');

module.exports = class ReactController extends Controller {
  static values = { component: String };
  static components = {
    ApiKeys: require('../components/ApiKeys'),
    TryApi: require('../components/TryApi'),
  };

  connect() {
    ReactDOM.render(
      this.constructor.components[this.componentValue],
      this.element,
    );
  }
};
