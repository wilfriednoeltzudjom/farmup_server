const mongoose = require('mongoose');

const { filterSearchableStrings } = require('../../application/helpers/models.helper');
const { capitalize, toUpperCase, toLowerCase } = require('../../application/helpers/text.helper');
const { isValidValue } = require('../../application/helpers/types.helper');
const { idGenerator, diacriticsUtils } = require('../../infrastructure');
const { SUPPLIER_TYPES } = require('../enums');
const { addressSchema } = require('../schemas');

const { Schema } = mongoose;

const supplierSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    code: { type: String, required: true },
    type: { type: String, enum: Object.values(SUPPLIER_TYPES), required: true },
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
supplierSchema.pre('save', function () {
  this.searchableStrings = filterSearchableStrings([
    diacriticsUtils.sanitize(this.name),
    diacriticsUtils.sanitize(this.lastName),
    diacriticsUtils.sanitize(this.firstName),
    diacriticsUtils.sanitize(this.email),
  ]);
});
supplierSchema.methods.refresh = function () {
  return this.model('Supplier').findById(this.id);
};
supplierSchema.virtual('fullName').get(function () {
  return [this.lastName, this.firstName].filter(isValidValue).join(' ').trim();
});

function isNameRequired() {
  return this.type === SUPPLIER_TYPES.COMPANY;
}

function isLastNameRequired() {
  return this.type === SUPPLIER_TYPES.INDIVIDUAL;
}

module.exports = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
