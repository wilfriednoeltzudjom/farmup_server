const { BadRequestError } = require('../../application/helpers/errors');
const { BAND_STATUSES } = require('../../database/enums');
const { Band, Day, Expense, Sale } = require('../../database/models');
const { findBandById } = require('./helpers/band.helper');

module.exports = function buildDeleteBand() {
  async function execute({ bandId } = {}) {
    const band = await findBandById(bandId);
    ensureBandIsDeletable(band);
    const { deletedCount } = await Band.deleteOne({ _id: bandId });
    if (deletedCount !== 1) throw new BadRequestError(`Error while deleting band: ${bandId}`);
    await deleteAllDays(band);
    await deleteAllExpenses(band);
    await deleteAllSales(band);

    return band;
  }

  function ensureBandIsDeletable(band) {
    if (![BAND_STATUSES.PENDING, BAND_STATUSES.CANCELLED].includes(band.status)) throw new BadRequestError(`You can only delete a pending or a cancelled band. Your band status is ${band.status}`);
  }

  function deleteAllDays(band) {
    return Day.deleteMany({ band });
  }

  function deleteAllExpenses(band) {
    return Expense.deleteMany({ band });
  }

  function deleteAllSales(band) {
    return Sale.deleteMany({ band });
  }

  return { execute };
};
