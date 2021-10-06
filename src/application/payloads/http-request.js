module.exports = class HttpRequest {
  #body;
  #params;
  #query;
  #file;
  #user;
  #session;

  constructor({ body, params, query, file, user, session }) {
    this.#body = body;
    this.#params = params;
    this.#query = query;
    this.#file = file;
    this.#user = user;
    this.#session = session;
  }

  get body() {
    return this.#body;
  }

  get params() {
    return this.#params;
  }

  get query() {
    return this.#query;
  }

  get file() {
    return this.#file;
  }

  get user() {
    return this.#user;
  }

  get session() {
    return this.#session;
  }

  static fromExpress(expressRequest) {
    return new HttpRequest(expressRequest);
  }
};
