const faker = require('faker');
const { ACCOUNT_ROLES } = require('../../enums');

function generateSignUpFormData() {
  return {
    name: faker.company.companyName(),
    lastName: faker.name.lastName(),
    firstName: faker.name.firstName(),
    phone: faker.phone.phoneNumber('+237#########'),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: ACCOUNT_ROLES.FARM_MANAGER,
  };
}

module.exports = { generateSignUpFormData };
