const { factory } = require('fakingoose');

const { FarmMember } = require('../../models');

module.exports = function buildFarmMemberFactory({ defaultOptions }) {
  function generateFarmMember(data = {}, options = {}) {
    return Object.assign(factory(FarmMember, { ...defaultOptions, ...options }).generate(), data);
  }

  async function createFarmMember(data = {}, options = {}) {
    const farmMember = new FarmMember(generateFarmMember(data, options));

    return farmMember.save();
  }

  return { generateFarmMember, createFarmMember };
};
