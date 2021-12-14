const mongoose = require('mongoose');

const { BadRequestError } = require('../../application/helpers/errors');
const { ACCOUNT_ROLES, LANGUAGES } = require('../../database/enums');
const { Account, Farm, FarmMember, Settings } = require('../../database/models');
const categories = require('../../database/data/categories');
const { findFarmById } = require('../farms/helpers/farm.helper');

const buildSignInUseCase = require('./sign-in.usecase');

module.exports = function buildSignUpUseCase(dependencies) {
  const signInUseCase = buildSignInUseCase(dependencies);
  const { dataValidator, hashUtils } = dependencies;

  async function execute({ farmId, ...data } = {}) {
    validateData(data);
    await ensureEmailIsAvailable(data);
    await ensurePhoneIsAvailable(data);

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const account = await createAccount(data);
        if (account.role === ACCOUNT_ROLES.FARM_MANAGER) {
          const farm = await (farmId ? findFarmById(farmId) : createFarm(data));
          await createFarmMember(farm, account, data);
        }
      });
    } finally {
      await session.endSession();
    }

    return signInUseCase.execute(data);
  }

  function validateData({ name, lastName, firstName, phone, email, password, role }) {
    dataValidator.validateStringAsRequired(name, 'Name');
    dataValidator.validateStringAsRequired(lastName, 'Lastname');
    dataValidator.validateStringAsRequired(firstName, 'Firstname');
    dataValidator.validateStringAsRequired(phone, 'Phone');
    dataValidator.validateStringAsRequired(email, 'Email');
    dataValidator.validateStringAsRequired(password, 'Password');
    dataValidator.validateEnumAsRequired(ACCOUNT_ROLES, role, 'Role');
  }

  async function ensureEmailIsAvailable({ email }) {
    const matchingAccountsCount = await Account.countDocuments({ email });
    if (matchingAccountsCount > 0) throw new BadRequestError(JSON.stringify({ email: `Adresse email <${email}> déjà utilisée` }));
  }

  async function ensurePhoneIsAvailable({ phone }) {
    const matchingFarmMembersCount = await FarmMember.countDocuments({ phone });
    if (matchingFarmMembersCount > 0) throw new BadRequestError(JSON.stringify({ phone: `Téléphone <${phone}> déjà utilisé` }));
  }

  async function createAccount({ email, password, role }) {
    const encryptedPassword = await hashUtils.createHash(password);
    const account = new Account({ email, password: encryptedPassword, role });

    return account.save();
  }

  async function createFarm({ name, email, phone }) {
    const settings = await createFarmSettings();
    const farm = new Farm({ name, email, phone, settings });

    return farm.save();
  }

  async function createFarmSettings({ language = LANGUAGES.FR } = {}) {
    const settings = new Settings({ language });
    Object.keys(categories).forEach((category) => {
      settings[category] = formatCategoryItems(categories[category][language]);
    });

    return settings.save();
  }

  function formatCategoryItems(items = []) {
    return items.map((item) => ({ name: item }));
  }

  async function createFarmMember(farm, account, { lastName, firstName, phone }) {
    const farmMember = new FarmMember({ lastName, firstName, phone, account, farm });

    return farmMember.save();
  }

  return { execute };
};
