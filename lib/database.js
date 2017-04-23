const onepath = require('onepath')();
const knex = require('knex');
const util = onepath.require('~/util');

/**
* Database connection class.
*/
class Database {
  constructor(name, options) {
    Object.defineProperty(this, '__DATABASE__', {
      value: { name, options,  knexClient: knex(options) }
    });
  }
  get name() { return this.__DATABASE__.name; }
  get options() { return this.__DATABASE__.options; }
  get knex() { return knex; }
  get knexClient() { return this.__DATABASE__.knexClient; }

  destroy() { this.knexClient.destroy(); }
  
  // Migrators to the latest configuration.
  latest() { return this.ensureFolders().then(() => this.knexClient.migrate.latest.apply(this.knexClient.migrate, arguments)); }

  // Rollback the last "batch" of migrations that were run.
  rollback() { return this.knexClient.migrate.latest.apply(this.knexClient.rollback, arguments); }

  status() { return this.knexClient.migrate.latest.apply(this.knexClient.status, arguments); }

  // Retrieves and returns the current migration version we're on, as a promise.
  // If no migrations have been run yet, return "none".
  currentVersion() { return this.knexClient.migrate.latest.apply(this.knexClient.currentVersion, arguments); }

  forceFreeMigrationsLock() { return this.knexClient.migrate.latest.apply(this.knexClient.forceFreeMigrationsLock, arguments); }
  
  // Ensure seed and migration folders defined in config,ss exist
  ensureFolders() { return this.knexClient.migrate._ensureFolder().then(() => this.knexClient.seed._ensureFolder()); }

  // Runs all seed files for the given knex environment.
  runAllSeeds(config) { return this.ensureFolders().then(() => this.knexClient.seed.run.apply(this.knexClient.seed, arguments)); }
}

module.exports = Database;