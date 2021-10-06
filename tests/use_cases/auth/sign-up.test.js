const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const signUpUseCase = require('../../../src/use_cases/auth/sign-up.usecase')(dependencies);
const { SignUpFormFactory, AccountFactory, FarmMemberFactory, FarmFactory, SettingsFactory } = require('../../../src/database/factories');
const { BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Sign up', function () {
  beforeEach(function () {
    this.signUpFormData = SignUpFormFactory.generateSignUpFormData();
  });

  it('should fail without the farm name', async function () {
    delete this.signUpFormData.name;

    await expect(signUpUseCase.execute(this.signUpFormData)).to.be.eventually.rejectedWith(BadRequestError, /name/i);
  });

  it('should fail without the farm member lastname', async function () {
    delete this.signUpFormData.lastName;

    await expect(signUpUseCase.execute(this.signUpFormData)).to.be.eventually.rejectedWith(BadRequestError, /lastname/i);
  });

  it('should fail without the farm member firstname', async function () {
    delete this.signUpFormData.firstName;

    await expect(signUpUseCase.execute(this.signUpFormData)).to.be.eventually.rejectedWith(BadRequestError, /firstname/i);
  });

  it('should fail without the farm member phone', async function () {
    delete this.signUpFormData.phone;

    await expect(signUpUseCase.execute(this.signUpFormData)).to.be.eventually.rejectedWith(BadRequestError, /phone/i);
  });

  it('should fail without the account email', async function () {
    delete this.signUpFormData.email;

    await expect(signUpUseCase.execute(this.signUpFormData)).to.be.eventually.rejectedWith(BadRequestError, /email/i);
  });

  it('should fail without the account password', async function () {
    delete this.signUpFormData.password;

    await expect(signUpUseCase.execute(this.signUpFormData)).to.be.eventually.rejectedWith(BadRequestError, /password/i);
  });

  it('should fail without the account role', async function () {
    delete this.signUpFormData.role;

    expect(signUpUseCase.execute(this.signUpFormData)).to.be.eventually.rejectedWith(BadRequestError, /role/i);
  });

  it('should fail if there is already an account related to the provided email', async function () {
    await AccountFactory.createAccount({ email: this.signUpFormData.email });

    await expect(signUpUseCase.execute(this.signUpFormData)).to.be.eventually.rejectedWith(BadRequestError, /email/i);
  });

  it('should fail if there is already a farm member related to the provided phone', async function () {
    await FarmMemberFactory.createFarmMember({ phone: this.signUpFormData.phone });

    await expect(signUpUseCase.execute(this.signUpFormData)).to.be.eventually.rejectedWith(BadRequestError, /phone/i);
  });

  it('should succeed an sign in the newly registred account', async function () {
    const response = await expect(signUpUseCase.execute(this.signUpFormData)).to.be.fulfilled;
    expect(response).to.haveOwnProperty('account');
    expect(response).to.haveOwnProperty('farmMember');
    expect(response).to.haveOwnProperty('token');
  });

  it('should create a new farm member and associate it to an existing farm', async function () {
    const settings = await SettingsFactory.createSettings();
    const farm = await FarmFactory.createFarm({ settings });

    const response = await expect(signUpUseCase.execute({ ...this.signUpFormData, farmId: farm.id })).to.be.fulfilled;
    expect(response).to.haveOwnProperty('account');
    expect(response).to.haveOwnProperty('farmMember');
    expect(response).to.haveOwnProperty('token');
    expect(response.farmMember.farm.id).to.be.eql(farm.id);
  });
});
