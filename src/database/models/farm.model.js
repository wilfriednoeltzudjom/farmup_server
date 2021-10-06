const mongoose = require('mongoose');

const { filterSearchableStrings } = require('../../application/helpers/models.helper');
const { idGenerator, diacriticsUtils } = require('../../infrastructure');
const { addressSchema, assetSchema } = require('../schemas');

const { Schema } = mongoose;

const farmSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    broodingBuildingArea: { type: Number, default: 0 },
    mainBuildingArea: { type: Number, default: 0 },
    address: addressSchema,
    logo: assetSchema,
    settings: { type: Schema.Types.ObjectId, ref: 'Settings' },
    searchableStrings: { type: [{ type: String, index: true }], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
farmSchema.pre('save', function () {
  this.searchableStrings = filterSearchableStrings([diacriticsUtils.sanitize(this.name), diacriticsUtils.sanitize(this.email), diacriticsUtils.sanitize(this.phone)]);
});
farmSchema.methods.refresh = function () {
  return this.model('Farm').findById(this.id);
};

module.exports = mongoose.models.Farm || mongoose.model('Farm', farmSchema);
