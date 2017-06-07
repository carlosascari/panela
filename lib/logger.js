/*!
* panela
* Copyright(c) 2017 Ascari Gutierrez Hermosillo
* MIT Licensed
*/

'use strict';

/**
* Logging & Debugging Utility
* @module logger
*/

const l = module.exports = {};

/*!
* Module dependencies.
*/
const chalk = require('chalk');
const {
  bold, dim, hidden, inverse, italic, reset, strikethrough, underline,
  black, red, green, yellow, blue, magenta, cyan, white, gray, 
  bgBlack, bgRed, bgGreen, bhYellow, bgBlue, bhMagenta, bgCyan, bgWhite,
} = chalk;

/**
* Same as `console.log`
* @method log
*/
l.log = console.log.bind(console);

/**
* Exposes chalk module.
* @type Object
*/
l.chalk = chalk;
