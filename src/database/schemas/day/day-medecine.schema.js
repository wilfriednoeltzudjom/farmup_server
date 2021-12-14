const mongoose = require('mongoose');

const { idGenerator } = require('../../../infrastructure');

const { Schema } = mongoose;

module.exports = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    name: { type: String },
    quantity: { type: Number },
    unit: { type: String },
    administrationMode: { type: String },
    comment: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
