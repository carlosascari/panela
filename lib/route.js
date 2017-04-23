/*!
* panela
* Copyright(c) 2017 Ascari Gutierrez Hermosillo
* MIT Licensed
*/

'use strict';

/*!
* Module dependencies.
*/

const onepath = require('onepath')();
const Endpoint = onepath.require('~/endpoint');
const { isString, slice } = onepath.require('~/util');

/**
* All supported HTTP Verbs.
* @const
* @private
* @type {Array<String>}
*/
const VERBS = ['get', 'head', 'put', 'patch', 'post', 'delete', 'options'];

/**
* Parses `arguments` object for endpoint creating methods. 
* @private
* @type {Object} Returns a new plain Object with **pathname** & **handlers** set.
*/
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

/**
* Route class.
*/
class Route {

  /**
  * Create a Route.
  * @param {String} pathname of Route instance.
  */
  constructor(pathname) {
    Object.defineProperty(this, '__ROUTE__', {
      value: { pathname, endpoints: [] }
    });
  }

  /**
  * Name of Route. Same as **pathname**.
  * @readonly
  * @type {String}
  */
  get name() { return this.__ROUTE__.pathname; }

  /**
  * Pathname of Route instance.
  * @readonly
  * @type {String}
  */
  get pathname() { return this.__ROUTE__.pathname; }

  /**
  * Add a Endpoint for all HTTP Verbs.
  * @param {String} pathname
  * @param {Function} handlers...
  * @return {Route} Returns `this` instance. **Chainable**.
  */
  all() {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, VERBS, pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }

  /**
  * Add a Endpoint for HTTP DELETE requests.
  * @param {String} pathname
  * @param {Function} handlers...
  * @return {Route} Returns `this` instance. **Chainable**.
  */
  delete() {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, ['delete'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }

  /**
  * Returns endpoints attached to this Route.
  * @return {Array<Endpoint|Middleware|Route>}
  */
  endpoints() {
    return this.__ROUTE__.endpoints;
  }

  /**
  * Add a Endpoint for HTTP GET requests.
  * @param {String} pathname
  * @param {Function} handlers...
  * @return {Route} Returns `this` instance. **Chainable**.
  */
  get() {
    const pArgs = parseEndpointArgs(...arguments);
    const pathname = `${this.pathname}${pArgs.pathname}`;
    const en = new Endpoint(pathname, ['get'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }

  /**
  * Add a Endpoint for HTTP HEAD requests.
  * @param {String} pathname
  * @param {Function} handlers...
  * @return {Route} Returns `this` instance. **Chainable**.
  */
  head() {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, ['head'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }

  /**
  * Add a Endpoint for HTTP OPTIONS requests.
  * @param {String} pathname
  * @param {Function} handlers...
  * @return {Route} Returns `this` instance. **Chainable**.
  */
  options(pathname) {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, ['options'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }

  /**
  * Add a Endpoint for HTTP PATCH requests.
  * @param {String} pathname
  * @param {Function} handlers...
  * @return {Route} Returns `this` instance. **Chainable**.
  */
  patch() {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, ['patch'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }

  /**
  * Add a Endpoint for HTTP POST requests.
  * @param {String} pathname
  * @param {Function} handlers...
  * @return {Route} Returns `this` instance. **Chainable**.
  */
  post() {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, ['post'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }

  /**
  * Add a Endpoint for HTTP PUT requests.
  * @param {String} pathname
  * @param {Function} handlers...
  * @return {Route} Returns `this` instance. **Chainable**.
  */
  put() {
    const pArgs = parseEndpointArgs(...arguments);
    const en = new Endpoint(pArgs.pathname, ['put'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }

  /**
  * Creates a new Route as a child of the this Route.
  * @param {String} pathname
  * @param {Function} callback
  * @return {Route} Returns `this` instance. **Chainable**.
  */
  route(pathname, callback) {
    const ro = new Route(`${this.pathname}${pathname}`);
    this.__ROUTE__.endpoints.push(ro);
    callback(ro);
    return this;
  }

  /**
  * Add a static folder Endpoint. All files found inside the folder will be served through nginx.
  * @param {String} pathname
  * @param {String} directory Path to folder that will be served.
  * @return {Route} Returns `this` instance. **Chainable**.
  */
  static(pathname, directory) {
    const pArgs = parseEndpointArgs(...arguments);
    const fullPathname = `${this.pathname}${pArgs.pathname}`;
    // TODO: move static endpoint var somewhere else....
    const en = new Endpoint(fullPathname, ['static'], pArgs.handlers);
    this.__ROUTE__.endpoints.push(en);
    return this;
  }

  /**
  * Add a Middleware
  * @param {String} pathname
  * @param {Function} handler
  * @return {Route} Returns `this` instance. **Chainable**.
  */
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
}

module.exports = Route;