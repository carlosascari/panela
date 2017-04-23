const onepath = require('onepath')();
const { isString, slice } = onepath.require('~/util');

class Endpoint {
  constructor(pathname, verbs, handlers) {
    Object.defineProperty(this, '__ENDPOINT__', {
      value: { pathname, verbs, handlers }
    });
    if (handlers.length === 1 && isString(handlers[0])) {
      if (verbs[0] === 'static') {
        this.__ENDPOINT__.static = true;
      }
      this.__ENDPOINT__.nginx = true;
      this.__ENDPOINT__.nginxFilePath = handlers[0];
    }
  }
  get name() { return this.__ENDPOINT__.pathname; }
  get pathname() { return this.__ENDPOINT__.pathname; }
  get verbs() { return this.__ENDPOINT__.verbs; }
  get handlers() { return this.__ENDPOINT__.handlers; }
  get static() { return this.__ENDPOINT__.static; }
  get nginx() { return this.__ENDPOINT__.nginx; }
  get filePath() { return this.__ENDPOINT__.nginxFilePath; }
}

module.exports = Endpoint;