const { isString, isNotEmptyString } = require('./types.helper');

function escapeRegExp(value) {
  const source = isString(value) ? value : '';

  return source.replace(/[-[/\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function capitalize(value) {
  const source = isString(value) ? value : '';

  return source
    .split(' ')
    .map((item) => {
      return item.length > 0 ? item[0].toUpperCase().concat(item.substr(1)) : '';
    })
    .filter(isNotEmptyString)
    .join(' ');
}

function toUpperCase(value) {
  return isString(value) ? value.toUpperCase() : '';
}

function toLowerCase(value) {
  return isString(value) ? value.toLowerCase() : '';
}

module.exports = { escapeRegExp, capitalize, toUpperCase, toLowerCase };
