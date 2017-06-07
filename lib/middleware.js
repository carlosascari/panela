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
* Middleware class.
*/
class Middleware {

  /**
  * Create a Middleware.
  * @param {String} pathname Pathname of Middleware instance.
  * @param {Function} handler Middleware function.
  */
  constructor(pathname, handler) {
    Object.defineProperty(this, '__MIDDLEWARE__', {
      value: { pathname, handler }
    });
  }

  /**
  * Name of Middleware. Same as **pathname**.
  * @readonly
  * @type {String}
  */  
  get name() { this.__MIDDLEWARE__.pathname; }

  /**
  * Pathname of Middleware instance.
  * @readonly
  * @type {String}
  */
  get pathname() { this.__MIDDLEWARE__.pathname; }

  /**
  * Function of Middleware instance.
  * @readonly
  * @type {Function}
  */
  get pathnamehandler() { this.__MIDDLEWARE__.handler; }
}