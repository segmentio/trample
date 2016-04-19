'use strict';

function isObject(o) {
  if ('object' === typeof o && !(o instanceof Array)) {
    return true;
  }

  return false;
}

/**
 * ```js
 * trample({}, { flattenArray: true });
 * ```
 */
function trample(props, options) {
  if (!options) options = {};

  let obj = {};

  // options.flattenArray
  function getRoot(localKey, topProps) {
    for (let key in topProps) {
      if (topProps.hasOwnProperty(key)) {
        const newKey = (!localKey) ? key : localKey + '.' + key;
        const value = topProps[key];

        if (isObject(value)) {
          getRoot(newKey, value);
        } else if (options.flattenArray && value instanceof Array) {
          value.map((prop, i) => {
            const arrayKey = newKey + '.' + i;

            if (isObject(prop)) {
              getRoot(arrayKey, prop);
            } else {
              obj[arrayKey] = prop;
            }
          });
        } else {
          obj[newKey] = value;
        }
      }
    }
  }

  getRoot(null, props);

  return obj;
}

module.exports = trample;
