const mongoose = require('mongoose');

const { filterSearchableStrings } = require('../../application/helpers/models.helper');
const { idGenerator, diacriticsUtils } = require('../../infrastructure');
const { CUSTOMER_TYPES } = require('../enums');
const { addressSchema } = require('../schemas');

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    type: { type: String, enum: Object.values(CUSTOMER_TYPES), required: true },
    name: { type: String },
    lastName: { type: String },
    firstName: { type: String },
    email: { type: String },
    phone: { type: String },
    addressText: { type: String },
    address: { type: addressSchema },
    searchableStrings: { type: [{ type: String, index: true }], default: [] },
    farm: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
customerSchema.pre('save', function () {
  this.searchableStrings = filterSearchableStrings([
    diacriticsUtils.sanitize(this.name),
    diacriticsUtils.sanitize(this.lastName),
    diacriticsUtils.sanitize(this.firstName),
    diacriticsUtils.sanitize(this.email),
  ]);
});
customerSchema.methods.refresh = function () {
  return this.model('Customer').findById(this.id);
};

module.exports = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
