const mongoose = require('mongoose');

const { idGenerator } = require('../../infrastructure');
const { assetSchema } = require('../schemas');

const { Schema } = mongoose;

const saleSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    code: { type: String, required: true },
    date: { type: Date, default: Date.now },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, default: 0 },
    comment: { type: String },
    assets: { type: [{ type: assetSchema }], default: [] },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    band: { type: Schema.Types.ObjectId, ref: 'Band', required: true },
    farm: { type: Schema.Types.ObjectId, ref: 'Farm' },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
saleSchema.pre('save', function () {
  this.totalPrice = this.unitPrice * this.quantity;
});
saleSchema.methods.refresh = function () {
  return this.model('Sale').findById(this.id);
};

module.exports = mongoose.models.Sale || mongoose.model('Sale', saleSchema);
