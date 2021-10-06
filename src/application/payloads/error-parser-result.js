module.exports = class ErrorParserResult {
  #name;
  #message;
  #fileFullPath;
  #fileRelativePath;
  #line;
  #column;

  constructor({ name = 'Unknown', message, fileFullPath, fileRelativePath, line, column }) {
    this.#name = name;
    this.#message = message;
    this.#fileFullPath = fileFullPath;
    this.#fileRelativePath = fileRelativePath;
    this.#line = line;
    this.#column = column;
  }

  toString() {
    return `{${this.#name}} : ${this.#message} in file ${this.#fileRelativePath} at line ${this.#line} at column ${this.#column}`;
  }
};
