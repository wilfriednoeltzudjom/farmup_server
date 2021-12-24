const { factory } = require('fakingoose');

const { assetSchema } = require('../../schemas');

module.exports = function buildAssetFactory({ defaultOptions }) {
  function generateAsset(data = {}, options = {}) {
    return Object.assign(factory(assetSchema, { ...defaultOptions, ...options }).generate(), data);
  }

  return { generateAsset };
};
