const hosts = module.exports = {};
const fs = require('fs');
const onepath = require('onepath')();
const { isString } = onepath.require('~/util');

let filename = '/etc/hosts';

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

hosts.setPath = (path) => { filename = onepath(path); }

hosts.getPath = () => { return filename; }

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

hosts.unset = (ip, hostname) => {
  if (ip && isString(ip)) {
    throw new Error('TODO');
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
