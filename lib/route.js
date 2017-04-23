const onepath = require('onepath')();
const Endpoint = onepath.require('~/endpoint');
const { isString, slice } = onepath.require('~/util');

const VERBS = ['get', 'head', 'put', 'patch', 'post', 'delete', 'options'];

const parseEndpointArgs = function() {
  let pathname = '*';
  let handlers = null;
  if (arguments.length) {
    if (isString(arguments[0])) {
      pathname = arguments[0];
      handlers = slice(arguments, 1);
    } else {
      handlers = slice(arguments);
    }
    return { pathname, handlers };
  } else {
    throw new Error('Missing arguments.');
  }
}

class Route {
  constructor(pathname, basename='') {
    Object.defineProperty(this, '__ROUTE__', {
      value: { pathname, endpoints: [], basename }
    });
  }
  get name() { return this.__ROUTE__.pathname; }
  get pathname() { return this.__ROUTE__.pathname; }
  endpoints() {
    return this.__ROUTE__.endpoints;
  }
  use(pathname, handler) {
    if (arguments.length === 0) {
      throw new Error('A handler or a pathname and a handler must be provided.');
    } else {
      if (arguments.length === 1) {
        pathname = '*';
        handler = pathname;
      }
      const mi = new Middleware(pathname, handler);
      this.__ROUTE__.endpoints.push(mi);
    }
    return this;
  }
  all() {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, VERBS, pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }
  get() {
    const pArgs = parseEndpointArgs(...arguments);
    const pathname = `${this.pathname}${pArgs.pathname}`;
    const en = new Endpoint(pathname, ['get'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }
  head() {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, ['head'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }
  put() {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, ['put'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }
  patch() {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, ['patch'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }
  post() {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, ['post'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }
  delete() {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, ['delete'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }
  options(pathname) {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, ['options'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }
  route(pathname, callback) {
    const ro = new Route(`${this.pathname}${pathname}`);
    this.__ROUTE__.endpoints.push(ro);
    callback(ro);
    return this;
  }
  static(pathname, directory, options) {
    const pArgs = parseEndpointArgs(...arguments);
    const fullPathname = `${this.pathname}${pArgs.pathname}`;
    // TODO: move static endpoint var somewhere else....
    const en = new Endpoint(fullPathname, ['static'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }
}

module.exports = Route;