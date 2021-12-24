const { factory } = require('fakingoose');

const { Session } = require('../../models');

module.exports = function buildSessionFactory({ defaultOptions }) {
  function generateSession(data = {}, options = {}) {
    return Object.assign(factory(Session, { ...defaultOptions, ...options }).generate(), data);
  }

  async function createSession(data = {}, options = {}) {
    const session = new Session(generateSession(data, options));

    return session.save();
  }

  return { generateSession, createSession };
};
