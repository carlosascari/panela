/*!
* panela
* Copyright(c) 2017 Ascari Gutierrez Hermosillo
* MIT Licensed
*/

/**
* Nginx Configuration
*
* Toolset for creating `nginx.conf` files.
* @module nginxc
*/

/*!
* Module dependencies.
*/

const fs = require('fs');
const onepath = require('onepath')();
const { isString } = onepath.require('~/util');

/**
* Character used when indenting.
* @private
* @const
* @type {String}
*/
const INDENT_CHARACTER = ' ';

/**
* Number of `INDENT_CHARACTER` characters per depth level.
* @private
* @const
* @type {String}
*/
const INDENT_MULTIPLIER = 2;

/**
* @private
* @method depthToWhitespace
* @param {Number} [d=0] Clause depth.
* @return {String}
*/
const depthToWhitespace = (d = 0) => new Array(d * INDENT_MULTIPLIER).fill(INDENT_CHARACTER).join('');

/**
* Directive class.
* @private
*/
class Directive {

  /**
  * Create a Directive.
  * @param {String} name Name of Directive.
  * @param {String} value Value of Directive.
  */
  constructor(name, value) {
    Object.defineProperty(this, '__DIRECTIVE__', {
      value: { name, value }
    });
  }

  /**
  * Name of Directive.
  * @readonly
  * @type {String}
  */
  get name() { return this.__DIRECTIVE__.name; }

  /**
  * Value of Directive.
  * @readonly
  * @type {String}
  */
  get value() { return this.__DIRECTIVE__.value; }

  /**
  * To nginx config formatted string.
  * @readonly
  * @type {String}
  */
  toString() { return `${this.name} ${this.value};`; }
}

/**
* Clause class.
* @private
*/
class Clause {

  /**
  * Create a Clause.
  * @param {String} name Name of Clause.
  * @param {Number} [depth=0] Nesting depth of Clause. 0 is for a root Clause.
  */
  constructor(name, depth=0) {
    Object.defineProperty(this, '__CLAUSE__', {
      value: { name, depth, entries: [] }
    });
  }

  /**
  * Name of Clause.
  * @readonly
  * @type {String}
  */
  get name() { return this.__CLAUSE__.name; }

  /**
  * Nested depth of Clause.
  * @readonly
  * @type {Number}
  */
  get depth() { return this.__CLAUSE__.depth; }

  /**
  * Appends a new Clause as a child of this Clause.
  * @param {String} name Name of new Clause
  * @param {Function} callback
  * @return {Clause} Returns `this` instance. **Chainable**.
  */
  clause(name, callback) {
    const clause = new Clause(name, this.depth + 1);
    callback(clause);
    this.__CLAUSE__.entries.push(clause);
    return this;
  }

  /**
  * Appends a new Directive.
  * @param {String} name Name of Directive.
  * @param {String} value Value of Directive.
  * @return {Clause} Returns `this` instance. **Chainable**.
  */
  directive(name, value) {
    this.__CLAUSE__.entries.push(new Directive(name, value));
    return this;
  }

  /**
  * Appends a new Location directive.
  * @param {String} path Pathname of Location.
  * @param {Function} callback
  * @return {Clause} Returns `this` instance. **Chainable**.
  */
  location(path, callback) {
    const clause = new Location(path, this.depth + 1);
    callback(clause);
    this.__CLAUSE__.entries.push(clause);
    return this;
  }

  /**
  * Alias for **clause** method.
  * @param {String} name Name of new Clause
  * @param {Function} callback
  * @return {Clause} Returns `this` instance. **Chainable**.
  */
  cl(name, callback) { return this.clause(name, callback); }

  /**
  * Alias for **directive** method.
  * @param {String} name Name of new Clause
  * @param {Function} callback
  * @return {Clause} Returns `this` instance. **Chainable**.
  */
  dir(name, value) { return this.directive(name, value); }

  /**
  * Alias for **location** method.
  * @param {String} name Name of new Clause
  * @param {Function} callback
  * @return {Clause} Returns `this` instance. **Chainable**.
  */
  loc(path, callback) { return this.location(path, callback); }

  /**
  * To nginx config formatted string.
  * @readonly
  * @type {String}
  */
  toString() {
    const result = [];
    const ws = depthToWhitespace(this.depth);
    const entries = this.__CLAUSE__.entries;
    const spacer = this.depth <= 1 ? '\n' : '';
    entries.forEach(entry => {
      if (entry instanceof Directive) {
        result.push(`${ws}${entry.toString()}`);
      } else if (entry instanceof Clause) {
        result.push(`${spacer}${ws}${ entry.name } {\n${ entry.toString() }\n${ws}}`);
      } else if (entry instanceof Location) {
        result.push(`${spacer}${ws}${ entry.name } {\n${ entry.toString() }\n${ws}}`);
      } else {
        throw new Error('Fatal.');
      }
    });
    return result.join('\n');
  }
}

/**
* Location class.
* @private
* @extends {Clause}
*/
class Location extends Clause {

  /**
  * Create a Location.
  * @param {String} path Pathname of Location.
  * @param {Number} [depth=0] Nesting depth of Clause. 0 is for a root Clause.
  */
  constructor(path, depth=0) {
    super(`location ${ path }`, depth);
    Object.defineProperty(this, '__LOCATION__', {
      value: { path }
    });
    delete this.location; // Disallow creating location clauses.
  }

  /**
  * To nginx config formatted string.
  * @readonly
  * @type {String}
  */
  toString() {
    const result = [];
    const ws = depthToWhitespace(this.depth);
    const entries = this.__CLAUSE__.entries;
    entries.forEach(entry => {
      if (entry instanceof Directive) {
        result.push(`${ws}${entry.toString()}`);
      } else if (entry instanceof Clause) {
        result.push(`${ws}${ entry.name } {\n${ entry.toString() }\n${ws}}`);
      } else if (entry instanceof Location) {
        result.push(`${ws}${ entry.name } {\n${ entry.toString() }\n${ws}}`);
      } else {
        throw new Error('Fatal.');
      }
    });
    return result.join('\n');
  }
}

/**
* NginxConfig class.
* @extends {Clause}
*/
class NginxConfig extends Clause {

  /**
  * Create a NginxConfig.
  * @param {String} filename
  * @param {Number} [depth=0] Nesting depth of Clause. 0 is for a root Clause.
  */
  constructor(filename) {
    super('root');
    Object.defineProperty(this, '__NGINX_CONFIG__', {
      value: { filename }
    });
  }
}

module.exports = NginxConfig;



// TESTING

// const nc = new NginxConfig();

// nc
// .dir('user', 'ascari')
// .dir('worker_processes', '4')
// .dir('pid', '/run/nginx.pid')
// .clause('events', cl => {
//   cl.directive('worker_connections', 768)
// })
// .clause('http', cl => {
//   cl
//   .directive('sendfile', 'on')
//   .directive('tcp_nopush', 'on')
//   .directive('tcp_nodelay', 'on')
//   .directive('keepalive_timeout', 65)
//   .directive('types_hash_max_size', 2048)
//   .directive('include', '/etc/nginx/mime.types')
//   .directive('default_type', 'application/octet-stream')
//   .directive('access_log', '/var/log/nginx/access.log')
//   .directive('error_log', '/var/log/nginx/error.log')
//   .directive('gzip', 'on')
//   .directive('gzip_disable', 'msie6')
//   .clause('server', cl => {
//     cl
//     .directive('listen', '80')
//     .directive('server_name', 'akasico.com')
//     .directive('client_max_body_size', '50M')
//     .directive('root', '/home/ascari/Desktop/ALL_THE_THINGS/Github/akásico/dist')
//     .location('/', cl => {
//       cl
//       .directive('index', 'index.html')
//       .directive('error_page', '400 402 403 404 /404.html')
//       .directive('error_page', '500 502 504 /500.html')
//       .directive('error_page', '503 /503.html')
//       .directive('rewrite', '/dashboard /index.html break')
//       .location('/search', cl => {
//         cl.directive('try_files', '/Search.html =404');
//       })

//       .location('/search', cl => cl.directive('try_files', '/Search.html =404'))
      
//       .location('/attributes', cl => cl.directive('try_files', '/Attributes.html =404'))
//       .location('/attributes/create', cl => cl.directive('try_files', '/AttributeCreate.html =404'))
//       .location('/attributes/edit', cl => cl.directive('try_files', '/AttributeEdit.html =404'))
//       .location('/attributes/view', cl => cl.directive('try_files', '/Attribute.html =404'))

//       .location('/persons', cl => cl.directive('try_files', '/Persons.html =404'))
//       .location('/persons/create', cl => cl.directive('try_files', '/PersonCreate.html =404'))
//       .location('/persons/edit', cl => cl.directive('try_files', '/PersonEdit.html =404'))
//       .location('/persons/view', cl => cl.directive('try_files', '/Person.html =404'))

//       .location('/persons', cl => cl.directive('try_files', '/Persons.html =404'))
//       .location('/persons/create', cl => cl.directive('try_files', '/PersonCreate.html =404'))
//       .location('/persons/edit', cl => cl.directive('try_files', '/PersonEdit.html =404'))
//       .location('/persons/view', cl => cl.directive('try_files', '/Person.html =404'))

//       // location /persons { try_files /Persons.html =404; }
//       // location /persons/create { try_files /PersonCreate.html =404; }
//       // location /persons/edit { try_files /PersonEdit.html =404; }
//       // location /persons/view { try_files /Person.html =404; }

//       // location /objects { try_files /Objects.html =404; }
//       // location /objects/create { try_files /ObjectCreate.html =404; }
//       // location /objects/edit { try_files /ObjectEdit.html =404; }
//       // location /objects/view { try_files /Object.html =404; }

//       // location /places { try_files /Places.html =404; }
//       // location /places/create { try_files /PlaceCreate.html =404; }
//       // location /places/edit { try_files /PlaceEdit.html =404; }
//       // location /places/view { try_files /Place.html =404; }

//       // location /attachments { try_files /Attachments.html =404; }
//       // location /attachments/create { try_files /AttachmentCreate.html =404; }
//       // location /attachments/edit { try_files /AttachmentEdit.html =404; }
//       // location /attachments/view { try_files /Attachment.html =404; }

//       // location /moments { try_files /Moments.html =404; }
//       // location /moments/create { try_files /MomentCreate.html =404; }
//       // location /moments/edit { try_files /MomentEdit.html =404; }
//       // location /moments/view { try_files /Moment.html =404; }

//       // location /ties { try_files /Ties.html =404; }
//       // location /ties/create { try_files /TieCreate.html =404; }
//       // location /ties/edit { try_files /TieEdit.html =404; }
//       // location /ties/view { try_files /Tie.html =404; }

//     });
//   })
//   .clause('server', cl => {

//   })
//   .clause('server', cl => {

//   });
// });


// console.log(nc.toString())
