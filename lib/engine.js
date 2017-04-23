/*!
* panela
* Copyright(c) 2017 Ascari Gutierrez Hermosillo
* MIT Licensed
*/

'use strict';

/*!
* Module dependencies.
*/

const knex = require('knex');
const onepath = require('onepath')();
const util = onepath.require('~/util');

/**
* Engine class.
*/
class Engine {

  /**
  * Create a Engine.
  * @param {String} name Name of Engine instance.
  * @param {Object} [options] Engine options.
  */
  constructor(name, options) {
    Object.defineProperty(this, '__ENGINE__', {
      value: { name, options }
    });
  }

  /**
  * Name of Engine.
  * @readonly
  * @type {String}
  */
  get name() { return this.__ENGINE__.name; }

  /**
  * Options passed to Engine when creating instance.
  * @readonly
  * @type {Object}
  */
  get options() { return this.__ENGINE__.options; }
}

module.exports = Engine;