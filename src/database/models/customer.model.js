const mongoose = require('mongoose');

const { filterSearchableStrings } = require('../../application/helpers/models.helper');
const { capitalize, toUpperCase, toLowerCase } = require('../../application/helpers/text.helper');
const { isValidValue } = require('../../application/helpers/types.helper');
const { idGenerator, diacriticsUtils } = require('../../infrastructure');
const { CUSTOMER_TYPES } = require('../enums');
const { addressSchema } = require('../schemas');

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    code: { type: String, required: true },
    type: { type: String, enum: Object.values(CUSTOMER_TYPES), required: true },
    name: { type: String, required: isNameRequired, set: toUpperCase },
    lastName: { type: String, required: isLastNameRequired, set: capitalize },
    firstName: { type: String, capitalize },
    email: { type: String, set: toLowerCase },
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
customerSchema.virtual('fullName').get(function () {
  return [this.lastName, this.firstName].filter(isValidValue).join(' ').trim();
});

function isNameRequired() {
  return this.type === CUSTOMER_TYPES.COMPANY;
}

function isLastNameRequired() {
  return this.type === CUSTOMER_TYPES.INDIVIDUAL;
}

module.exports = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
