/*!
* panela
* Copyright(c) 2016 Ascari Gutierrez Hermosillo
* MIT Licensed
*/

'use strict';

const onepath = require('onepath')();
const knex = require('knex');
const { isFunction } = onepath.require('~/util');
const { defineProperty } = Object;


/**
* Builder class.
*/
class Builder {
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
  get name() { return this.__BUILD__.name; }
  get options() { return this.__BUILD__.options; }
  get steps() { return this.__BUILD__.steps }
  step(handler) {
    if (isFunction(handler)) {
      this.__BUILD__.steps.push(handler);
    } else {
      throw new Error('A handler is missing. Must be a Function.');
    }
    return this;
  }
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
}

module.exports = Builder;