module.exports = class Example {
  static urls = ['https://www.dunkman.me'];

  static get randomUrl() {
    return this.urls[Math.floor(Math.random() * this.urls.length)];
  }
};
