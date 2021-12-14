const mongoose = require('mongoose');

const { filterSearchableStrings } = require('../../application/helpers/models.helper');
const { idGenerator, diacriticsUtils } = require('../../infrastructure');
const { assetSchema } = require('../schemas');

const { Schema } = mongoose;

const expenseSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    date: { type: Date, default: Date.now },
    category: { type: String },
    title: { type: String, required: true },
    comment: { type: String },
    quantity: { type: Number, default: 0 },
    unitPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    searchableStrings: { type: [{ type: String, index: true }], default: [] },
    assets: { type: [{ type: assetSchema }], default: [] },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    band: { type: Schema.Types.ObjectId, ref: 'Band', required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
expenseSchema.pre('save', function () {
  this.searchableStrings = filterSearchableStrings([diacriticsUtils.sanitize(this.category), diacriticsUtils.sanitize(this.title)]);
});
expenseSchema.methods.refresh = function () {
  return this.model('Expense').findById(this.id);
};

module.exports = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
