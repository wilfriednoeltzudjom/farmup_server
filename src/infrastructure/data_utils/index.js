const LodashDataUtils = require('./lodash');

module.exports = new LodashDataUtils();
module.exports.getRandomEnumValue = function (enumeration) {
  const values = Object.values(enumeration);

  return values[Math.floor(Math.random() * values.length)];
};
module.exports.getRandomArrayValue = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};
