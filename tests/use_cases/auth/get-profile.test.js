const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const getProfileUseCase = require('../../../src/use_cases/auth/get-profile.usecase')(dependencies);
const { AccountFactory, FarmMemberFactory, FarmFactory, SettingsFactory } = require('../../../src/database/factories');
const { ResourceNotFoundError } = require('../../../src/application/helpers/errors');
const { ACCOUNT_ROLES } = require('../../../src/database/enums');

describe('UseCase - Get profile', () => {
  it('should fail if there is no existing account related to the provided id', async function () {
    const account = AccountFactory.generateAccount({}, { _id: { skip: false } });

    await expect(getProfileUseCase.execute({ id: account.id })).to.be.eventually.rejectedWith(ResourceNotFoundError);
  });

  it('should get an administrator profile', async function () {
    const account = await AccountFactory.createAccount({ role: ACCOUNT_ROLES.ADMINISTRATOR });

    const profile = await expect(getProfileUseCase.execute({ id: account.id })).to.be.fulfilled;
    expect(profile).to.haveOwnProperty('account');
  });

  it('should get a farm member profile', async function () {
    const account = await AccountFactory.createAccount({ role: ACCOUNT_ROLES.FARM_MEMBER, ...this.signInFormData });
    const settings = await SettingsFactory.createSettings();
    const farm = await FarmFactory.createFarm({ settings });
    await FarmMemberFactory.createFarmMember({ account, farm });

    const profile = await expect(getProfileUseCase.execute({ id: account.id })).to.be.fulfilled;
    expect(profile).to.haveOwnProperty('account');
    expect(profile).to.haveOwnProperty('farmMember');
  });
});
