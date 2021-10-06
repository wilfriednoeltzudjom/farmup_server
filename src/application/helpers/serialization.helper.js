const { dataUtils } = require('../../infrastructure');
const { isNonEmptyObject } = require('./types.helper');

function serializeResponse(response = {}) {
  const updatedResponse = removeUnneededPropertiesFromResponse(response);
  if (doesResponseIncludeNonEmptyObjects(updatedResponse)) {
    Object.keys(updatedResponse).forEach((property) => {
      if (isNonEmptyObject(updatedResponse[property])) {
        updatedResponse[property] = serializeResponse(updatedResponse[property]);
      }
    });
  }

  return updatedResponse;
}

function removeUnneededPropertiesFromResponse(response) {
  const clonedResponse = dataUtils.cloneDeep(JSON.parse(JSON.stringify(response)));
  delete clonedResponse._id;
  delete clonedResponse.password;
  delete clonedResponse.__v;
  delete clonedResponse.searchableStrings;

  return clonedResponse;
}

function doesResponseIncludeNonEmptyObjects(response) {
  return Object.keys(response).some((property) => isNonEmptyObject(response[property]));
}

module.exports = { serializeResponse };
