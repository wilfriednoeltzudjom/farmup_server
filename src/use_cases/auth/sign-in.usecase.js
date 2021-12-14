const { ResourceNotFoundError, BadRequestError } = require('../../application/helpers/errors');
const { Account, FarmMember, Session } = require('../../database/models');
const { isFarmAccount } = require('./helpers/account.helper');

module.exports = function buildSignInUseCase(dependencies) {
  const { dataValidator, hashUtils, tokenUtils } = dependencies;

  async function execute(data = {}) {
    validateData(data);

    const { email, password } = data;
    const account = await findAccountByEmail(email);
    await ensurePasswordIsCorrect(account, password);

    return createSignInResponse(account);
  }

  function validateData({ email, password }) {
    dataValidator.validateStringAsRequired(email, 'Email');
    dataValidator.validateStringAsRequired(password, 'Password');
  }

  async function findAccountByEmail(email) {
    const account = await Account.findOne({ email });
    if (!account) throw new ResourceNotFoundError(JSON.stringify({ email: `Adresse email <${email}> non enregistrée` }));

    return account;
  }

  async function ensurePasswordIsCorrect(account, password) {
    const correctPassword = await hashUtils.isEqualToHash({ hash: account.password, value: password });
    if (!correctPassword) throw new BadRequestError(JSON.stringify({ password: `Mot de passe incorrect` }));
  }

  async function createSignInResponse(account) {
    const session = await createSession(account);
    const signInResponse = { account, session };
    const tokenPayload = { id: account.id, role: account.role };
    if (isFarmAccount(account)) {
      const farmMember = await FarmMember.findOne({ account }).populate({
        path: 'farm',
        populate: 'settings',
      });
      signInResponse.farmMember = farmMember;
      tokenPayload.language = farmMember.farm.settings.language;
    }
    signInResponse.token = tokenUtils.generateToken(tokenPayload);

    return signInResponse;
  }

  async function createSession(account) {
    const session = new Session({ account });

    return session.save();
  }

  return { execute };
};
