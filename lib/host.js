const onepath = require('onepath')();
const knex = require('knex');
const NginxConfig = onepath.require('~/nginxc');
const Route = onepath.require('~/route');
const Middleware = onepath.require('~/middleware');
const { isString, slice } = onepath.require('~/util');

class Host extends Route {
  constructor(hostname, hostConfig) {
    super('');
    Object.defineProperty(this, '__HOST__', {
      value: { hostname, routes: [], hostConfig }, 
    });
  }
  get name() { return this.__HOST__.hostname; }
  get hostname() { return this.__HOST__.hostname; }

  get port() { return this.__HOST__.hostConfig.port; }
  get root() { return this.__HOST__.hostConfig.root; }

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

  route(pathname, callback) {
    const ro = new Route(pathname);
    this.__HOST__.routes.push(ro);
    callback(ro);
    return this;
  }
}

module.exports = Host;