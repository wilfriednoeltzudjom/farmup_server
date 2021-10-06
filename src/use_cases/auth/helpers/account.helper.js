const { ResourceNotFoundError } = require('../../../application/helpers/errors');
const { ACCOUNT_ROLES } = require('../../../database/enums');
const { Account } = require('../../../database/models');

async function findAccountById(accountId) {
  const account = await Account.findById(accountId);
  if (!account) throw new ResourceNotFoundError(`No account found for id: ${accountId}`);

  return account;
}

function isFarmAccount(account) {
  return [ACCOUNT_ROLES.FARM_MANAGER, ACCOUNT_ROLES.FARM_MEMBER].includes(account.role);
}

module.exports = { findAccountById, isFarmAccount };
