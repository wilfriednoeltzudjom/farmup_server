function isNullish(value) {
  return [null, undefined].includes(value);
}

function isNotNull(value) {
  return value !== null && value !== undefined;
}

function isString(value) {
  return typeof value === 'string';
}

function isBoolean(value) {
  return typeof value === 'boolean';
}

function isArray(value) {
  return Array.isArray(value);
}

function isNumber(value) {
  return typeof value === 'number';
}

function isEnum(enumeration, value) {
  return Object.values(enumeration).includes(value);
}

function isObject(value) {
  return typeof value === 'object';
}

function isValidValue(value) {
  return !isNullish(value);
}

function isNotEmptyString(value) {
  return isValidValue(value) && isString(value) && value.length > 0;
}

function isNonEmptyObject(value) {
  return isValidValue(value) && isObject(value) && Object.keys(value).length > 0;
}

function isJSONString(value) {
  try {
    JSON.parse(value);

    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  isNullish,
  isNotNull,
  isString,
  isBoolean,
  isArray,
  isNumber,
  isEnum,
  isValidValue,
  isNotEmptyString,
  isJSONString,
  isNonEmptyObject,
};
