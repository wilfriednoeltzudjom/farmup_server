const mongoose = require('mongoose');

const { idGenerator } = require('../../../infrastructure');
const assetSchema = require('../asset.schema');

const { Schema } = mongoose;

module.exports = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    title: { type: String },
    comment: { type: String },
    files: { type: [{ type: assetSchema }], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
