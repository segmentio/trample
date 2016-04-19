'use strict';

function isObject(o) {
  if ('object' === typeof o && !(o instanceof Array)) {
    return true;
  }

  return false;
}

exports = module.exports = trample;
exports.flattenUntilArrayLeaf = flattenUntilArrayLeaf;

function flattenUntilArrayLeaf(key, args, obj) {
  if (!obj) obj = {};

  let isLeaf = false;

  for (let i = 0; i < args.input.length; i++) {
    const prop = args.input[i];
    const arrayKey = (!key) ? i : (key + '.' + i);

    if (isObject(prop)) {
      isLeaf = false;
      merge(obj, getRoot(arrayKey, prop, args.options));
    } else if (prop instanceof Array && args.options.flattenArray) {
      isLeaf = false;
      let arr = flattenUntilArrayLeaf(arrayKey, {
        input: prop,
        options: args.options
      }, obj);

    } else if (!args.options.flattenArray && prop instanceof Array) {
      isLeaf = false;
      let guard = false;

      for (let k = 0; k < prop.length; k++) {
        let kval = prop[k];

        if (isObject(kval) || kval instanceof Array) {
          guard = false;
          merge(obj, flattenUntilArrayLeaf(arrayKey, {
            input: prop,
            options: args.options
          }, obj));
          break;
        } else {
          guard = true;
        }
      }

      if (guard) {
        obj[arrayKey] = prop;
      }
    } else {
      isLeaf = true;
      obj[arrayKey] = prop;
    }
  }

  if (isLeaf && !args.options.flattenArray) {
    return args.input;
  }

  return obj;
}

/**
 * ```js
 * trample({}, { flattenArray: true });
 * ```
 */
function trample(props, options) {
  if (!options) options = {};
  let obj = {};

  merge(obj, getRoot(null, props, options));

  return obj;
}

function merge(one, two) {
  for (let key in two) {
    let value = two[key];
    one[key] = value;
  }
}

function getRoot(localKey, props, options) {
  let obj = {};

  for (let key in props) {
    if (props.hasOwnProperty(key)) {
      const newKey = (localKey === null) ? key : localKey + '.' + key;
      const value = props[key];

      if (isObject(value)) {
        merge(obj, getRoot(newKey, value, options));
      } else if (value instanceof Array) {
        let arr = flattenUntilArrayLeaf(newKey, {
          input: value,
          options: options
        });

        if (arr instanceof Array) {
          obj[newKey] = arr;
        } else {
          merge(obj, arr);
        }

      } else {
        obj[newKey] = value;
      }
    }
  }

  return obj;
}

