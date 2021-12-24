const { Expense } = require('../../database/models');
const { findBandById } = require('../bands/helpers/band.helper');

module.exports = function buildCreateExpenseUseCase() {
  async function execute({ bandId } = {}) {
    const band = await findBandById(bandId);

    return Expense.find({ band }).sort({ createdAt: -1 }).populate('supplier');
  }

  return { execute };
};
