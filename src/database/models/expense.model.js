const mongoose = require('mongoose');

const { filterSearchableStrings } = require('../../application/helpers/models.helper');
const { idGenerator, diacriticsUtils } = require('../../infrastructure');
const { assetSchema } = require('../schemas');

const { Schema } = mongoose;

const expenseSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    code: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    category: { type: String, required: true },
    title: { type: String },
    comment: { type: String },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, default: 0 },
    searchableStrings: { type: [{ type: String, index: true }], default: [] },
    assets: { type: [{ type: assetSchema }], default: [] },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    band: { type: Schema.Types.ObjectId, ref: 'Band', required: true },
    farm: { type: Schema.Types.ObjectId, ref: 'Farm' },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
expenseSchema.pre('save', function () {
  this.searchableStrings = filterSearchableStrings([diacriticsUtils.sanitize(this.category), diacriticsUtils.sanitize(this.title)]);
  this.totalPrice = this.unitPrice * this.quantity;
});
expenseSchema.methods.refresh = function () {
  return this.model('Expense').findById(this.id);
};

module.exports = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
