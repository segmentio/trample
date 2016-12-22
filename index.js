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

  var isLeaf = false;

  for (var i = 0; i < args.input.length; i++) {
    var prop = args.input[i];
    var arrayKey = (!key) ? i : (key + args.options.delimiter + i);

    if (isObject(prop)) {
      isLeaf = false;
      merge(obj, getRoot(arrayKey, prop, args.options));
    } else if (prop instanceof Array && args.options.flattenArray) {
      isLeaf = false;
      var arr = flattenUntilArrayLeaf(arrayKey, {
        input: prop,
        options: args.options
      }, obj);

    } else if (!args.options.flattenArray && prop instanceof Array) {
      isLeaf = false;
      var guard = false;

      for (var k = 0; k < prop.length; k++) {
        var kval = prop[k];

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
  if (!options.delimiter) options.delimiter = '.';
  var obj = {};

  merge(obj, getRoot(null, props, options));

  return obj;
}

function merge(one, two) {
  for (var key in two) {
    var value = two[key];
    one[key] = value;
  }
}

function getRoot(localKey, props, options) {
  var obj = {};

  for (var key in props) {
    if (props.hasOwnProperty(key)) {
      var newKey = (localKey === null) ? key : localKey + options.delimiter + key;
      var value = props[key];

      if (isObject(value)) {
        merge(obj, getRoot(newKey, value, options));
      } else if (value instanceof Array) {
        var arr = flattenUntilArrayLeaf(newKey, {
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
