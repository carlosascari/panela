const onepath = require('onepath')();
const knex = require('knex');
const util = onepath.require('~/util');

class Engine {
  constructor(name, options) {
    Object.defineProperty(this, '__ENGINE__', {
      value: { name, options }
    });
  }
  get name() { return this.__ENGINE__.name; }
  get options() { return this.__ENGINE__.options; }
}

module.exports = Engine;