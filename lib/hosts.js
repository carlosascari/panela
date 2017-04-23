/*!
* panela
* Copyright(c) 2017 Ascari Gutierrez Hermosillo
* MIT Licensed
*/

/**
* Hosts file modification
*
* Singleton for editing /etc/hosts files.
* @module hosts
*/

const hosts = module.exports = {};

/*!
* Module dependencies.
*/

const fs = require('fs');
const onepath = require('onepath')();
const { isString } = onepath.require('~/util');

/**
* Path to **hosts** file.
* @private
* @type {String}
*/
let filename = '/etc/hosts';

/**
* Loads & parses the `hosts` files.
* @private
* @method load
*/
const load = () => {
  const file = fs.readFileSync(filename, 'utf8')
  const lines = file.split('\n');
  const entries = lines.map(x => {
    if (x.trim()) {
      if (x.trim()[0] === '#') {
        return { comment: x };
      } else {
        const index = x.indexOf(' ');
        const ip = x.substr(0, index);
        const hostname = x.substr(index + 1).trim();
        return { ip, hostname };
      }
    } else {
      return { whitespace: x };
    }
  });
  return entries;
}

/**
* Saves entries in memory to `hosts` file.
* @private
* @method save
* @param {Array<Object>} entries
*/
const save = (entries) => {
  const mappedEntries = entries.map(entry => {
    if (isString(entry.comment)) {
      return `# ${entry.comment}`;
    } else if (isString(entry.whitespace)) {
      return `${entry.whitespace}`;
    } else if (isString(entry.ip)) {
      return `${entry.ip} ${entry.hostname}`;
    }
  });
  fs.writeFileSync(filename, `${mappedEntries.join('\n')}\n`);
}

/**
* Sets path to **hosts** file.
* @method setPath
* @param {String} path Path to `hosts` file.
*/
hosts.setPath = (path) => { filename = onepath(path); }

/**
* Returns path to **hosts** file.
* @method getPath
* @return {String} Path to `hosts` file.
*/
hosts.getPath = () => { return filename; }

/**
* Adds a new entry to the hosts file **in-memory**, if id does not already exist.
* @thows {Error} When ip is undefined or not a String.
* @thows {Error} When hostname is undefined or not a String.
* @method set
* @param {String} ip
* @param {String} hostname
*/
hosts.set = (ip, hostname) => {
  if (ip && isString(ip)) {
    if (hostname && isString(hostname)) {
      const entries = load();
      for (let i = 0, l = entries.length; i < l; i++) {
        const entry = entries[i];
        if (entry.ip === ip && entry.hostname === hostname) {
          return;
        }
      }
      entries.push({ ip, hostname });
      save(entries);
    } else {
      throw new Error('Missing hostname. Must be a String.');
    }
  } else {
    throw new Error('Missing ip. Must be a String.');
  }
}

/**
* Removes an existing entry in the hosts file **in-memory**.
* @thows {Error} NOT_IMPLEMENTED
* @thows {Error} When ip is undefined or not a String.
* @method unset
* @param {String} ip
* @param {String} hostname
* @todo NOT_IMPLEMENTED
*/
hosts.unset = (ip, hostname) => {
  if (ip && isString(ip)) {
    throw new Error('NOT_IMPLEMENTED');
    if (hostname) {
      if (hostname instanceof RegExp) {

      } else {

      }
    } else {
      // remove all with ip???
    }
  } else {
    throw new Error('Missing ip. Must be a String.');
  }
}

/**
* Removes an existing entry in the hosts file **in-memory**.
* @method get
* @param {String} [ip] IP address of entry to return entry.
* @param {RegExp|String} [pattern] RegExp pattern to match hostname to return entry.
* @return {Array<Object>}
*/
hosts.get = (ip, pattern) => {
  if (ip && isString(ip)) {
    if (pattern && pattern instanceof RegExp) {
      return load().filter(x => x.ip === ip && pattern.exec(x.hostname));
    } else {
      return load().filter(x => x.ip === ip);
    }
  } else {
    return load().map(x => x.ip);
  }
}
