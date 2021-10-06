const { FarmMember } = require('../../database/models');
const { findAccountById, isFarmAccount } = require('./helpers/account.helper');

module.exports = function buildGetProfile() {
  async function execute({ id }) {
    const account = await findAccountById(id);
    const profile = { account };
    if (isFarmAccount(account)) {
      profile.farmMember = await FarmMember.findOne({ account }).populate({
        path: 'farm',
        populate: 'settings',
      });
    }

    return profile;
  }

  return { execute };
};
