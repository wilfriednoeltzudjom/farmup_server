const mongoose = require('mongoose');

const { filterSearchableStrings } = require('../../application/helpers/models.helper');
const { idGenerator, diacriticsUtils } = require('../../infrastructure');

const { Schema } = mongoose;

const farmMemberSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    phone: { type: String },
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    farm: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
    searchableStrings: { type: [{ type: String, index: true }], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
farmMemberSchema.pre('save', function () {
  this.searchableStrings = filterSearchableStrings([diacriticsUtils.sanitize(this.lastName), diacriticsUtils.sanitize(this.firstName), diacriticsUtils.sanitize(this.phone)]);
});
farmMemberSchema.methods.refresh = function () {
  return this.model('FarmMember').findById(this.id);
};

module.exports = mongoose.models.FarmMember || mongoose.model('FarmMember', farmMemberSchema);
