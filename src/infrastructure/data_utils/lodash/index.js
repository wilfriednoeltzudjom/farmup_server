const _ = require('lodash');

const DataUtils = require('../interface');

module.exports = class LoadashDataUtils extends DataUtils {
  cloneDeep(value) {
    return _.cloneDeep(value);
  }
};
