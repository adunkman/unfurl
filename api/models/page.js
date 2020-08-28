const { JSDOM } = require('jsdom');

module.exports = class Page {
  constructor(html) {
    this.document = new JSDOM(html).window.document;
  }

  getMetaData(prefix) {
    const tags = [...this.document.querySelectorAll(`meta`)];

    return Object.fromEntries(tags.map(tag => [
      tag.getAttribute('name') || tag.getAttribute('property') || '',
      tag.getAttribute('content')
    ]).filter(([key]) => key.startsWith(prefix)));
  }

  toJSON() {
    return Object.assign({}, ...'og: twitter: description'.split(' ').map(p => {
      return this.getMetaData(p);
    }))
  }
};
