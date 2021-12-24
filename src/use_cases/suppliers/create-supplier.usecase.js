const { Supplier } = require('../../database/models');
const { findFarmById } = require('../farms/helpers/farm.helper');
const { ensureSupplierHasName, ensureSupplierPhoneIsNotAlreadyTaken, ensureSupplierEmailIsNotAlreadyTaken } = require('./helpers/supplier.helper');

module.exports = function buildCreateSupplierUseCase(dependencies) {
  const { dataValidator } = dependencies;

  async function execute({ farmId, ...data } = {}) {
    validateData(data);

    const farm = await findFarmById(farmId);
    const supplier = new Supplier({ ...data, farm });
    ensureSupplierHasName(supplier);
    await setCode(supplier, farm);
    await ensureSupplierPhoneIsNotAlreadyTaken(supplier);
    await ensureSupplierEmailIsNotAlreadyTaken(supplier);

    return supplier.save();
  }

  function validateData({ type, name, lastName, firstName, email, phone, addressText }) {
    dataValidator.validateStringAsRequired(type, 'Supplier type');
    dataValidator.validateString(name, 'Supplier name');
    dataValidator.validateString(lastName, 'Supplier lastName');
    dataValidator.validateString(firstName, 'Supplier firstName');
    dataValidator.validateString(email, 'Supplier email');
    dataValidator.validateString(phone, 'Supplier phone');
    dataValidator.validateString(addressText, 'Supplier addressText');
  }

  async function setCode(supplier, farm) {
    const suppliers = await Supplier.find({ farm }).sort({ createdAt: -1 }).limit(1);
    let nextSupplierPosition = 0;
    if (suppliers.length > 0) {
      nextSupplierPosition = Number(suppliers[0].code.slice(2));
    }
    supplier.code = 'SU'.concat(String(nextSupplierPosition + 1).padStart(5, '0'));
  }

  return { execute };
};
