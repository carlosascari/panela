/*!
* panela
* Copyright(c) 2017 Ascari Gutierrez Hermosillo
* MIT Licensed
*/

/*!
* Module dependencies.
*/

const onepath = require('onepath')();
const Core = onepath.require('~/core');
const { isString, isFunction, slice } = onepath.require('~/util');

/**
* Endpoint class.
*/
class Endpoint extends Core {

  /**
  * Create a Endpoint.
  * @param {String} pathname Pathname of Endpoint instance.
  * @param {Array<String>} verbs HTTP verbs this Endpoint will serve.
  * @param {Array<Function>} handlers Functions to execute as middlewares, the last function is not a middleware and must set a response.
  */
  constructor(pathname, verbs, handlers) {
    super('__ENDPOINT__', () => {
      return {
        value: { pathname, verbs, handlers }
      };
    });

    // Object.defineProperty(this, '__ENDPOINT__', {
    //   value: { pathname, verbs, handlers }
    // });
    if (handlers.length === 1 && isString(handlers[0])) {
      if (verbs[0] === 'static') {
        this.__ENDPOINT__.static = true;
      }
      this.__ENDPOINT__.nginx = true;
      this.__ENDPOINT__.nginxFilePath = handlers[0];
    } else if (handlers.length === 1 && isFunction(handlers[0])) {
      this.__ENDPOINT__.nginx = false;
      this.__ENDPOINT__.nginxFilePath = '';
    } else {
      throw new Error('NOT IMPLEMENTED: Multiple callbacks in endpoint')
    }
  }

  /**
  * Wether this Endpoint will be served by express.
  * @readonly
  * @type {Boolean}
  */
  get express() { return !this.__ENDPOINT__.nginx; }

  /**
  * Path to static file to serve through nginx.
  * @readonly
  * @type {String}
  */
  get filePath() { return this.__ENDPOINT__.nginxFilePath; }

  /**
  * Functions to execute as middlewares, the last function is not a middleware and must set a response.
  * @readonly
  * @type {Array<Function>}
  */
  get handlers() { return this.__ENDPOINT__.handlers; }

  /**
  * Name of Endpoint. Same as **pathname**.
  * @readonly
  * @type {String}
  */
  get name() { return this.__ENDPOINT__.pathname; }

  /**
  * Wether this Endpoint will be served by nginx.
  * @readonly
  * @type {Boolean}
  */
  get nginx() { return this.__ENDPOINT__.nginx; }

  /**
  * Pathname of Endpoint instance.
  * @readonly
  * @type {String}
  */
  get pathname() { return this.__ENDPOINT__.pathname; }

  /**
  * Wether this Endpoint will will serve a static folder through nginx.
  * @readonly
  * @type {Boolean}
  */
  get static() { return this.__ENDPOINT__.static; }

  /**
  * HTTP verbs this Endpoint will serve.
  * @readonly
  * @type {Array<String>}
  */
  get verbs() { return this.__ENDPOINT__.verbs; }

  /**
  * Attaches endpoint path and handlers to express app.
  * @param {ExpressApp} expressInstance
  */
  attachToExpressInstance(expressInstance) {
    const {handlers, pathname, verbs} = this;
    verbs.forEach(verb => {
      const args = handlers.slice();
      args.unshift(pathname);
      expressInstance[verb].apply(expressInstance, args);
    })
  }
}

module.exports = Endpoint;