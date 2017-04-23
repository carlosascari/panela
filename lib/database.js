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
const util = onepath.require('~/util');

/**
* Database client class.
*/
class Database {

  /**
  * Create a Database.
  * @param {String} name Name of Database instance.
  * @param {Object} [options] Database options.
  */
  constructor(name, options) {
    Object.defineProperty(this, '__DATABASE__', {
      value: {
        knexClient: knex(options),
        name,
        options,
      }
    });
  }

  /**
  * Name of Database.
  * @readonly
  * @type {String}
  */
  get name() { return this.__DATABASE__.name; }

  /**
  * Exposes knex module.
  * @readonly
  * @type {Object}
  */
  get knex() { return knex; }

  /**
  * Exposes knex client.
  * @readonly
  * @type {Object}
  */
  get knexClient() { return this.__DATABASE__.knexClient; }

  /**
  * Options passed to Builder when creating instance.
  * @readonly
  * @type {Object}
  */
  get options() { return this.__DATABASE__.options; }

  /**
  * Retrieves and returns the current migration version, as a promise. 
  * If there aren't any migrations run yet, returns "none" as the value for the currentVersion.
  * @param {Object} [config] Knex Migration configuration.
  * @return {Promise}
  */
  currentVersion(config) { return this.knexClient.migrate.latest(config); }

  /**
  * Terminate connection pool.
  * @param {Function} [callback]
  * @return {Promise}
  */
  destroy(callback) { return this.knexClient.destroy(callback); }

  /**
  * Ensure seed and migration folders defined in config exist, by creating them if they don't.
  * @return {Promise}
  */
  ensureFolders() {
    return this.knexClient.migrate._ensureFolder().then(() => this.knexClient.seed._ensureFolder());
  }

  // @deprecated
  forceFreeMigrationsLock() {
    return this.knexClient.migrate.latest.apply(this.knexClient.forceFreeMigrationsLock, arguments);
  }

  /**
  * Runs all migrations that have not yet been run.
  * @param {Object} [config] Knex Migration configuration.
  * @return {Promise}
  */
  latest(config) {
    return this.ensureFolders().then(() => {
      return this.knexClient.migrate.latest(config);
    });
  }

  /**
  * Rolls back the latest migration group.
  * @param {Object} [config] Knex Migration configuration.
  * @return {Promise}
  */
  rollback(config) { return this.knexClient.migrate.latest(config); }

  /**
  * Runs all seed files for the current environment.
  * @param {Object} [config] Knex Migration configuration.
  * @return {Promise}
  */
  runAllSeeds(config) {
    return this.ensureFolders().then(() => this.knexClient.seed.run(config));
  }

  // @depecrated
  status() {
    return this.knexClient.migrate.latest.apply(this.knexClient.status, arguments);
  }
}

module.exports = Database;