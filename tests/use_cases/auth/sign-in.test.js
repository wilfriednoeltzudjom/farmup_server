const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const signInUseCase = require('../../../src/use_cases/auth/sign-in.usecase')(dependencies);
const { SignInFormFactory, AccountFactory, FarmMemberFactory, FarmFactory, SettingsFactory } = require('../../../src/database/factories');
const { BadRequestError, ResourceNotFoundError } = require('../../../src/application/helpers/errors');
const { ACCOUNT_ROLES } = require('../../../src/database/enums');

describe('UseCase - Sign in', () => {
  beforeEach(function () {
    this.signInFormData = SignInFormFactory.generateSignInFormData();
  });

  it('should fail without the email', async function () {
    delete this.signInFormData.email;

    await expect(signInUseCase.execute(this.signInFormData)).to.be.eventually.rejectedWith(BadRequestError, /email/i);
  });

  it('should fail without the password', async function () {
    delete this.signInFormData.password;

    await expect(signInUseCase.execute(this.signInFormData)).to.be.eventually.rejectedWith(BadRequestError, /password/i);
  });

  it('should fail if the provided email is not related to an existing account', async function () {
    await expect(signInUseCase.execute(this.signInFormData)).to.be.eventually.rejectedWith(ResourceNotFoundError, /email/i);
  });

  it('should fail if the provided password is incorrect', async function () {
    await AccountFactory.createAccount({ email: this.signInFormData.email });

    await expect(signInUseCase.execute(this.signInFormData)).to.be.eventually.rejectedWith(BadRequestError, /password/i);
  });

  it('should sign in an administrator account', async function () {
    await AccountFactory.createAccount({ role: ACCOUNT_ROLES.ADMINISTRATOR, ...this.signInFormData });

    const response = await expect(signInUseCase.execute(this.signInFormData)).to.be.fulfilled;
    expect(response).to.haveOwnProperty('account');
    expect(response).to.haveOwnProperty('token');
    expect(response).to.haveOwnProperty('session');
  });

  it('should sign in a farm account', async function () {
    const account = await AccountFactory.createAccount({ role: ACCOUNT_ROLES.FARM_MANAGER, ...this.signInFormData });
    const settings = await SettingsFactory.createSettings();
    const farm = await FarmFactory.createFarm({ settings });
    await FarmMemberFactory.createFarmMember({ account, farm });

    const response = await expect(signInUseCase.execute(this.signInFormData)).to.be.fulfilled;
    expect(response).to.haveOwnProperty('account');
    expect(response).to.haveOwnProperty('farmMember');
    expect(response).to.haveOwnProperty('token');
    expect(response).to.haveOwnProperty('session');
  });
});
