const mongoose = require('mongoose');

const { filterSearchableStrings } = require('../../application/helpers/models.helper');
const { idGenerator, diacriticsUtils } = require('../../infrastructure');
const { ACCOUNT_ROLES } = require('../enums');

const { Schema } = mongoose;

const accountSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    role: { type: String, enum: Object.values(ACCOUNT_ROLES), required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: true },
    searchableStrings: { type: [{ type: String, index: true }], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
accountSchema.pre('save', function () {
  this.searchableStrings = filterSearchableStrings([diacriticsUtils.sanitize(this.email)]);
});
accountSchema.methods.refresh = function () {
  return this.model('Account').findById(this.id);
};

module.exports = mongoose.models.Account || mongoose.model('Account', accountSchema);
