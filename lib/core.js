/*!
* panela
* Copyright(c) 2017 Ascari Gutierrez Hermosillo
* MIT Licensed
*/

'use strict';

/*
* Core is a base class for all Panela instances.
* Its purpose is to limit memory consumption by
* managing inhereting instances.
*
* coreRelease()
* coreReset()
* coreCopy()
*/

/*!
* Module dependencies.
*/

const onepath = require('onepath')();
const logger = onepath.require('~/logger');
const { isFunction, isArray, isObject } = onepath.require('~/util');
const { defineProperty, keys } = Object;
const {
  bold, dim, hidden, inverse, italic, reset, strikethrough, underline,
  black, red, green, yellow, blue, magenta, cyan, white, gray, 
  bgBlack, bgRed, bgGreen, bhYellow, bgBlue, bhMagenta, bgCyan, bgWhite,
} = logger.chalk;

const FREED_CORES = {};
const HOT_CORES = {};

const getFreedCore = (coreName) => {
  const cores = FREED_CORES[coreName];
  if (cores) {
    if (cores.length) {
      return cores.pop();
    } else {
      return null;
    }
  } else {
    FREED_CORES[coreName] = [];
  }
}

const emptyCore = (core) => {
  keys(core).forEach(coreKey => {
    const value = core[coreKey];
    if (value !== null && value === undefined) {
      const type = typeof value;
      if (type === 'number') {
        core[coreKey] = 0;
      } else if (type === 'string') {
        core[coreKey] = '';
      } else if (type === 'object') {
        if (isArray(type)) {
          core[coreKey].length = 0;
        } else if (isObject(type)) {
          emptyCore(core[coreKey]);
        } else {
          core[coreKey] = null;
        }
      } else if (type === 'function') {
        core[coreKey].bind(this);
      }
    }
  });
};

/**
* Core class.
*/
class Core {

  /**
  * Create a Core, or re-use a previously freed Core instance.
  */
  constructor(coreName, coreGenerator) {
    const freedCore = getFreedCore(coreName);
    logger.log(white.bold('Requesting new Core: '), coreName);
    logger.log(white.bold('Freed Core: '), freedCore);
    if (freedCore) {
      emptyCore(freedCore);
      defineProperty(this, coreName, freedCore);
    } else {
      defineProperty(this, coreName, coreGenerator());
    }
    defineProperty(this, 'coreName', { value: coreName });
  }
  free() {
    FREED_CORES[this.coreName].push(this[this.coreName]);
  }
}

module.exports = Core;