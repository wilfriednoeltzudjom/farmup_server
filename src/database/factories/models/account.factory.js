const { factory } = require('fakingoose');

const { Account } = require('../../models');

module.exports = function buildAccountFactory({ defaultOptions, hashUtils }) {
  function generateAccount(data = {}, options = {}) {
    return Object.assign(factory(Account, { ...defaultOptions, ...options }).generate(), data);
  }

  async function createAccount(data = {}, options = {}) {
    const accountData = generateAccount(data, options);
    const encryptedPassword = await hashUtils.createHash(accountData.password);
    const account = new Account({ ...accountData, password: encryptedPassword });

    return account.save();
  }

  return { generateAccount, createAccount };
};
