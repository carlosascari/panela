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
const { defineProperty } = Object;
const { isFunction } = onepath.require('~/util');

/**
* Builder class.
*/
class Builder {

  /**
  * Create a Builder.
  * @param {String} name Name of Builder instance.
  * @param {Object} [options] Builder options.
  */
  constructor(name, options) {
    defineProperty(this, '__BUILD__', {
      value: { name, options, steps: [] }
    });
    if (options.verbose) {
      this.log = console.log.bind(console);
    } else {
      this.log = Function.prototype;
    }
  }

  /**
  * Name of Builder.
  * @readonly
  * @type {String}
  */
  get name() { return this.__BUILD__.name; }

  /**
  * Options passed to Builder when creating instance.
  * @readonly
  * @type {Object}
  */
  get options() { return this.__BUILD__.options; }

  /**
  * Build steps.
  * @readonly
  * @type {Array<Function>}
  */
  get steps() { return this.__BUILD__.steps }

  /**
  * Build; execute steps in order until completion.
  * @throws {Error} When steps where not added.
  * @return {Promise}
  */
  build() {
    if (this.steps.length === 0) {
      throw new Error('There are no steps to process.');
    } else {
      this.log(`Building "${ this.name }"`);
      return Promise.all(
        this.steps.map((handler, index) => {
          return new Promise((ok, bad) => {
            this.log(`Building - Step ${ index + 1 } of ${ this.steps.length }`);
            handler(error => {
              if (error) {
                bad(error);
              } else {
                ok();
              }
            });
          });
        })
      );
    }
  }

  /**
  * Adds a new step.
  * @throws {Error} When handler is not a {Function}.
  * @param {Function} handler Handler function to execute during build.
  * @return {Builder} `this` is returned. **Chainable**.
  */
  step(handler) {
    if (isFunction(handler)) {
      this.__BUILD__.steps.push(handler);
    } else {
      throw new Error('A handler is missing. Must be a Function.');
    }
    return this;
  }
}

module.exports = Builder;