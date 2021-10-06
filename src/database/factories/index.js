const dependencies = require('../../infrastructure');

const SignUpFormFactory = require('./forms/sign-up-form.factory');
const SignInFormFactory = require('./forms/sign-in-form.factory');
const buildAccountFactory = require('./models/account.factory');
const buildSessionFactory = require('./models/session.factory');
const buildFarmMemberFactory = require('./models/farm-member.factory');
const buildFarmFactory = require('./models/farm.factory');
const buildSettingsFactory = require('./models/settings.factory');

const defaultOptions = {
  _id: { skip: true },
  __v: { skip: true },
  uuid: { skip: true },
  createdAt: { skip: true },
  updatedAt: { skip: true },
};

module.exports = {
  SignUpFormFactory,
  SignInFormFactory,
  AccountFactory: buildAccountFactory({ defaultOptions, ...dependencies }),
  SessionFactory: buildSessionFactory({ defaultOptions }),
  FarmMemberFactory: buildFarmMemberFactory({ defaultOptions }),
  FarmFactory: buildFarmFactory({ defaultOptions }),
  SettingsFactory: buildSettingsFactory({ defaultOptions }),
};
