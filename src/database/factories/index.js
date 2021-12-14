const dependencies = require('../../infrastructure');

const SignUpFormFactory = require('./forms/sign-up-form.factory');
const SignInFormFactory = require('./forms/sign-in-form.factory');

const buildAccountFactory = require('./models/account.factory');
const buildSessionFactory = require('./models/session.factory');
const buildFarmMemberFactory = require('./models/farm-member.factory');
const buildFarmFactory = require('./models/farm.factory');
const buildSettingsFactory = require('./models/settings.factory');
const buildProphylaxisFactory = require('./models/prophylaxis.factory');
const buildBandFactory = require('./models/band.factory');
const buildExpenseFactory = require('./models/expense.factory');
const buildSaleFactory = require('./models/sale.factory');
const buildDayFactory = require('./models/day.factory');
const buildSupplierFactory = require('./models/supplier.factory');
const buildCustomerFactory = require('./models/customer.factory');

const buildDayAlimentationFactory = require('./schemas/day-alimentation.factory');
const buildDayMedecineFactory = require('./schemas/day-medecine.factory');
const buildDayDeathFactory = require('./schemas/day-death.factory');

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
  ProphylaxisFactory: buildProphylaxisFactory({ defaultOptions }),
  BandFactory: buildBandFactory({ defaultOptions }),
  ExpenseFactory: buildExpenseFactory({ defaultOptions }),
  SaleFactory: buildSaleFactory({ defaultOptions }),
  DayFactory: buildDayFactory({ defaultOptions }),
  SupplierFactory: buildSupplierFactory({ defaultOptions }),
  CustomerFactory: buildCustomerFactory({ defaultOptions }),
  DayAlimentationFactory: buildDayAlimentationFactory({ defaultOptions }),
  DayMedecineFactory: buildDayMedecineFactory({ defaultOptions }),
  DayDeathFactory: buildDayDeathFactory({ defaultOptions }),
};
