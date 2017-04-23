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
const Middleware = onepath.require('~/middleware');
const NginxConfig = onepath.require('~/nginxc');
const Route = onepath.require('~/route');
const { isString, slice } = onepath.require('~/util');

/**
* Host class.
*/
class Host extends Route {

  /**
  * Create a Host.
  * @param {String} hostname Hostname of Host instance.
  * @param {Object} [options] Host options.
  */
  constructor(hostname, options) {
    super(''); // TODO: remove extension.
    Object.defineProperty(this, '__HOST__', {
      value: {
        hostname,
        options,
        routes: [],
      }, 
    });
  }

  /**
  * Name of Host. Same as **hostname**.
  * @readonly
  * @type {String}
  */
  get name() { return this.__HOST__.hostname; }

  /**
  * Hostname of Host instance.
  * @readonly
  * @type {String}
  */
  get hostname() { return this.__HOST__.hostname; }

  /**
  * Port where Host will be served. Used for **nginx**.
  * @readonly
  * @type {String}
  */
  get port() { return this.__HOST__.options.port; }

  /**
  * Root path of where website data is found. Used for **nginx**.
  * @readonly
  * @type {String}
  */
  get root() { return this.__HOST__.options.root; }

  /**
  * Creates a new [Route](Route.html).
  * @param {String} pathname
  * @param {Function} callback
  * @return {Host} Returns `this` instance. **Chainable**.
  */
  route(pathname, callback) {
    const ro = new Route(pathname);
    this.__HOST__.routes.push(ro);
    callback(ro);
    return this;
  }

  /**
  * Return a [Route](Route.html) by its pathname, or an array of all Routes when **pathname** is omitted.
  * @param {String} [hostname]
  * @return {Array<Route>|Route|null}
  */
  routes(pathname) {
    const routes = this.__ROUTE__.routes;
    if (pathname && isString(pathname)) {
      for (let i = 0, l = routes.length; i < l; i++) {
        if (routes[i].pathname === pathname) {
          return routes[i];
        }
      }
      return null;
    } else {
      return this.__HOST__.routes;
    }
  }
}

module.exports = Host;