/*!
* panela
* Copyright(c) 2017 Ascari Gutierrez Hermosillo
* MIT Licensed
*/

'use strict';

/**
* Utilities
* @module util
*/

const u = module.exports = {};

/**
* Test if **sample** is a Array.
* @method isArray
* @param {*} sample Any value to be tested.
* @return {Boolean}
*/
u.isArray = sample => Array.isArray(sample);

/**
* Test if **sample** is an Object without keys.
* @method isEmpty
* @param {*} sample Any value to be tested.
* @return {Boolean}
*/
u.isEmpty = sample => !!Object.keys(sample).length;

/**
* Test if **sample** is a Function.
* @method isFunction
* @param {*} sample Any value to be tested.
* @return {Boolean}
*/
u.isFunction = sample => typeof sample === 'function';

/**
* Test if **sample** is a Number.
* @method isFunction
* @param {*} sample Any value to be tested.
* @return {Boolean}
*/
u.isNumber = sample => typeof sample === 'number';

/**
* Test if **sample** is a plain Object.
* @method isObject
* @param {*} sample Any value to be tested.
* @return {Boolean}
*/
u.isObject = sample => sample && typeof sample === 'object' && sample.toString && sample.toString() === '[object Object]';


/**
* Test if **sample** is a primitive type.
* @method isPrimitive
* @param {*} sample Any value to be tested.
* @return {Boolean}
*/
u.isPrimitive = sample => sample === null || sample === undefined || u.isNumber(sample) || u.isString(sample) || typeof sample === 'boolean';

/**
* Test if **sample** is a String.
* @method isString
* @param {*} sample Any value to be tested.
* @return {Boolean}
*/
u.isString = sample => typeof sample === 'string';

/**
* Call slice on a Array or `arguments` object.
* @method slice
* @param {Array|arguments} args
* @return {Array}
*/
u.slice = (args, x, y, z) => Array.prototype.slice.call(args, x, y, z);
