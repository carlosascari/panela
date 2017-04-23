const u = module.exports = {};

u.isObject = o => o && typeof o === 'object' && o.toString && o.toString() === '[object Object]';
u.isArray = o => Array.isArray(o);
u.isEmpty = o => !!Object.keys(o);
u.isString = o => typeof o === 'string';
u.slice = (a, x, y, z) => Array.prototype.slice.call(a, x, y, z);
u.isFunction = (o) => typeof o === 'function';
u.isNumber = (o) => typeof o === 'number';
