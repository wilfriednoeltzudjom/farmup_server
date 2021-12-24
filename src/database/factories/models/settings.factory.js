const { factory } = require('fakingoose');

const { Settings } = require('../../models');

module.exports = function buildSettingsFactory({ defaultOptions }) {
  function generateSettings(data = {}, options = {}) {
    return Object.assign(factory(Settings, { ...defaultOptions, ...options }).generate(), data);
  }

  async function createSettings(data = {}, options = {}) {
    const settings = new Settings(generateSettings(data, options));

    return settings.save();
  }

  return { generateSettings, createSettings };
};
