const faker = require('faker');

function generateSignInFormData() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

module.exports = { generateSignInFormData };
