const removeAccents = require('remove-accents');

const DiacriticsUtils = require('../interface');

module.exports = class RemoveAccentsDiacriticsUtils extends DiacriticsUtils {
  sanitize(value) {
    return value ? removeAccents.remove(value).toLowerCase().replace(/ /g, '').trim() : value;
  }
};
