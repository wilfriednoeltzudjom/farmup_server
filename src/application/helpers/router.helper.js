function isGetRequest(httpRequest) {
  return isRequestMethod('get', httpRequest);
}

function isRequestMethod(method, httpRequest) {
  return httpRequest.method.toLowerCase().trim() === method;
}

module.exports = { isGetRequest };
