const mongoose = require('mongoose');

const { idGenerator } = require('../../infrastructure');
const { assetSchema } = require('../schemas');

const { Schema } = mongoose;

const saleSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    date: { type: Date, default: Date.now },
    quantity: { type: Number, default: 0 },
    unitPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    comment: { type: String },
    assets: { type: [{ type: assetSchema }], default: [] },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    band: { type: Schema.Types.ObjectId, ref: 'Band', required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
saleSchema.methods.refresh = function () {
  return this.model('Sale').findById(this.id);
};

module.exports = mongoose.models.Sale || mongoose.model('Sale', saleSchema);
