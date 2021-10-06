const removeAccents = require('remove-accents');

const DiacriticsUtils = require('../interface');

module.exports = class RemoveAccentsDiacriticsUtils extends DiacriticsUtils {
  sanitize(value) {
    return removeAccents.remove(value).toLowerCase().replace(/ /g, '').trim();
  }
};
