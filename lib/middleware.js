const onepath = require('onepath')();
const Endpoint = onepath.require('~/endpoint');
const { isString, slice } = onepath.require('~/util');


class Middleware {
  constructor(pathname, handler) {
    Object.defineProperty(this, '__MIDDLEWARE__', {
      value: { pathname, handler }
    });
  }
  get name() { this.__MIDDLEWARE__.pathname; }
  get pathname() { this.__MIDDLEWARE__.pathname; }
  get pathnamehandler() { this.__MIDDLEWARE__.handler; }
}