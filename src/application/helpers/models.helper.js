const { isNotEmptyString } = require('./types.helper');

function filterSearchableStrings(searchableValues = []) {
  return searchableValues.filter(isNotEmptyString);
}

module.exports = { filterSearchableStrings };
