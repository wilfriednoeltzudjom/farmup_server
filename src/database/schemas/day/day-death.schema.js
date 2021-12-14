const mongoose = require('mongoose');

const { idGenerator } = require('../../../infrastructure');

const { Schema } = mongoose;

module.exports = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    date: { type: Date, required: true },
    count: { type: Number, required: true },
    comment: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
