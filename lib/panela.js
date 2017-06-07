/*!
* panela
* Copyright(c) 2017 Ascari Gutierrez Hermosillo
* MIT Licensed
*/

'use strict';

/*!
* Module dependencies.
*/

const fs = require('fs');
const express = require('express');
const onepath = require('onepath')();
const Builder = onepath.require('~/builder');
const Core = onepath.require('~/core');
const Database = onepath.require('~/database');
const Engine = onepath.require('~/engine');
const Host = onepath.require('~/host');
const Route = onepath.require('~/route');
const hosts = onepath.require('~/hosts');
const logger = onepath.require('~/logger');
const NginxConfig = onepath.require('~/nginxc');
const { isObject, isString, isFunction } = onepath.require('~/util');
const {
  bold, dim, hidden, inverse, italic, reset, strikethrough, underline,
  black, red, green, yellow, blue, magenta, cyan, white, gray, 
  bgBlack, bgRed, bgGreen, bhYellow, bgBlue, bhMagenta, bgCyan, bgWhite,
} = logger.chalk;

/**
* Create a panela application.
* @return {Panela}
*/
function createApplication() {
  return new Panela();
}

/**
* Panela application class.
* @extends Core
*/
class Panela extends Core {

  /**
  * Create a Panela application.
  */
  constructor() {
    super('__PANELA__', () => {
      return {
        value: {
          builders: [],
          databases: [],
          engines: [],
          hosts: [],
          expressInstance: null,
        }
      };
    });
  }

  _createExpressApp({port}) {
    if (this.__PANELA__.expressInstance) return;
    this.__PANELA__.expressInstance = express();
  }

  _getExpressInstance() {
    return this.__PANELA__.expressInstance;
  }

  /**
  * Creates a new [Builder](Builder.html).
  * @throws {Error} When name is undefined or not a {String}.
  * @param {String} name Name of Builder instance.
  * @param {Object} [builderConfig] Builder options.
  * @return {Builder} New Builder instance.
  */
  builder(name, builderConfig) {
    if (name && isString(name)) {
      const bi = new Builder(name, builderConfig);
      this.__PANELA__.builders.push(bi);
      return bi;
    } else {
      throw new Error('Missing name. Must be a string.');
    }
  }

  /**
  * Return a [Builder](Builder.html) by its name, or an array of all Builders when **name** is omitted.
  * @param {String} [name] Name of Builder to return.
  * @return {Array<Builder>|Builder|null}
  */
  builders(name) {
    const builders = this.__PANELA__.builders;
    if (name && isString(name)) {
      for (let i = 0, l = builders.length; i < l; i++) {
        if (builders[i].name === name) {
          return builders[i];
        }
      }
      return null;
    } else {
      return builders;
    }
  }

  /**
  * Creates a new [Database](Database.html).
  * @param {String} name
  * @param {Object} [knexConfig]
  */
  database(name, knexConfig) {
    if (name && isString(name)) {
      const db = new Database(name, knexConfig);
      this.__PANELA__.databases.push(db);
      return db;
    } else {
      throw new Error('Missing name. Must be a string.');
    }
  }

  /**
  * Return a [Database](Database.html) by its name, or an array of all Databases when **name** is omitted.
  * @param {String} [name]
  * @return {Array<Database>|Database|null}
  */
  databases(name) {
    const databases = this.__PANELA__.databases;
    if (name && isString(name)) {
      for (let i = 0, l = databases.length; i < l; i++) {
        if (databases[i].name === name) {
          return databases[i];
        }
      }
      return null;
    } else {
      return this.__PANELA__.databases;
    }
  }

  /**
  * Creates a new [Engine](Engine.html).
  * @param {String} name
  * @param {Object} [knexConfig]
  */
  engine(name, engineConfig) {
    if (name && isString(name)) {
      const eng = new Engine(name, engineConfig);
      this.__PANELA__.engines.push(eng);
      return eng;
    } else {
      throw new Error('Missing name. Must be a string.');
    }
  }

  /**
  * Return a [Engine](Engine.html) by its name, or an array of all Engines when **name** is omitted.
  * @param {String} [name]
  * @return {Array<Engine>|Engine|null}
  */
  engines(name) {
    const engines = this.__PANELA__.engines;
    if (name && isString(name)) {
      for (let i = 0, l = engines.length; i < l; i++) {
        if (engines[i].name === name) {
          return engines[i];
        }
      }
      return null;
    } else {
      return this.__PANELA__.engines;
    }
  }

  /**
  * Creates a new [Host](Host.html).
  * @param {String} hostname
  * @param {Object} [hostConfig]
  */
  host(hostname, hostConfig) {
    if (hostname && isString(hostname)) {
      const ho = new Host(hostname, hostConfig);
      this.__PANELA__.hosts.push(ho);
      return ho;
    } else {
      throw new Error('Missing hostname. Must be a string.');
    }
  }

  /**
  * Return a [Host](Host.html) by its name, or an array of all Hosts when **name** is omitted.
  * @param {String} [hostname]
  * @return {Array<Host>|Host|null}
  */
  hosts(hostname) {
    const hosts = this.__PANELA__.hosts;
    if (hostname && isString(hostname)) {
      for (let i = 0, l = hosts.length; i < l; i++) {
        if (hosts[i].hostname === hostname) {
          return hosts[i];
        }
      }
      return null;
    } else {
      return this.__PANELA__.hosts;
    }
  }

  /**
  * Create application and starts server.
  * @param {Object} options
  * @return {Promise}
  */
  listen(options={}) {
    const { nginxConfPath='./panela-nginx.conf' } = options;
    logger.log(bold.white('Panela'), '\n');

    const nc = new NginxConfig();
    let httpClause = null;
    let serverClause = null;

    nc
    .dir('user', 'ascari')
    .dir('worker_processes', '4')
    .dir('pid', '/run/nginx.pid')
    .clause('events', cl => {
      cl.directive('worker_connections', 768)
    })
    .clause('http', cl => {
      httpClause = cl;
      cl
      .directive('sendfile', 'on')
      .directive('tcp_nopush', 'on')
      .directive('tcp_nodelay', 'on')
      .directive('keepalive_timeout', 65)
      .directive('types_hash_max_size', 2048)
      .directive('include', '/etc/nginx/mime.types')
      .directive('default_type', 'application/octet-stream')
      .directive('access_log', '/var/log/nginx/access.log')
      .directive('error_log', '/var/log/nginx/error.log')
      .directive('gzip', 'on')
      .directive('gzip_disable', 'msie6')
    });

    const parseEndpoint = (host, endpoint) => {
      logger.log(
        host.name,
        '\n ',
        endpoint.verbs.map(x => cyan(x)).join(' '),
        bold.green(endpoint.name),
        endpoint.handlers.length === 1 ? endpoint.handlers[0] : endpoint.handlers
      );

      if (endpoint.nginx) {
        if (endpoint.static) {
          serverClause.location(endpoint.name, cl => {
            cl.directive('index', 'index.html');
          });
        } else {
          serverClause.location(endpoint.name, cl => {
            cl
            .directive('index', 'index.html')

            // Cute.
            .directive('try_files', `/${ onepath.basename(endpoint.filePath) } =404`)
            .location('/search', cl => cl.directive('try_files', '/Search.html =404'))
          });
        }
      } else {
        // express
        const PORT = 3000;
        this._createExpressApp({port: PORT});
        serverClause.location(endpoint.name, cl => {
          cl
          .directive('proxy_pass', `http://127.0.0.1:${ PORT }`)
          .directive('proxy_http_version', '1.1')
          .directive('proxy_set_header', 'Upgrade $http_upgrade')
          .directive('proxy_set_header', `Connection 'upgrade'`)
          .directive('proxy_set_header', 'X-Forwarded-For $remote_addr')
        });
        const expressInstance = this._getExpressInstance();
        endpoint.attachToExpressInstance(expressInstance);
      }
    };

    this.hosts().forEach(host => {
      
      hosts.set('127.0.0.1', host.name);

      httpClause.clause('server', cl => {
        serverClause = cl;
        cl
        .directive('listen', host.port)
        .directive('server_name', host.name)

        // Todo: for Static, should move.
        .directive('client_max_body_size', '50M')
        if (host.root) cl.directive('root', host.root)
      });

      logger.log(bold.green(host.name));

      host.endpoints().forEach(endpoint => {
        parseEndpoint(host, endpoint);
      });

      const parseRoute = (route) => {
        route.endpoints().forEach(endpoint => {
          if (endpoint instanceof Route) {
            parseRoute(endpoint);
          } else {
            parseEndpoint(host, endpoint);
          }
        });
      };

      host.routes().forEach(route => {
        parseRoute(route);
      });
    })

    // sudo service nginx stop
    // sudo nginx -c `pwd`/panel-nginx.conf

    fs.writeFileSync(nginxConfPath, nc.toString());

    // logger.log(nc.toString())

    return new Promise((ok,  bad) => {
      const expressInstance = this._getExpressInstance();
      if (expressInstance) {
        expressInstance.listen(3000, () => {
          console.log('express app listening');
          ok();
        })
      } else {
        ok();
      }
    });
  }
}

module.exports = createApplication;