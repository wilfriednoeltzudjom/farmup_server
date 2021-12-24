const { BadRequestError } = require('../../../../application/helpers/errors');
const { isGetRequest } = require('../../../../application/helpers/router.helper');
const bandMessages = require('../../../../application/messages/band.messages');
const { findBandById, areBandSubDocumentsNonEditable } = require('../../../../use_cases/bands/helpers/band.helper');

module.exports = async function (req, _, next) {
  if (isGetRequest(req)) {
    next();
    return;
  }

  try {
    const { bandId } = req.params;
    const band = await findBandById(bandId);
    if (areBandSubDocumentsNonEditable(band)) throw new BadRequestError(bandMessages.BAND_NON_EDITABLE.FR);
    next();
  } catch (error) {
    next(error);
  }
};
