const mongoose = require('mongoose');

const { idGenerator } = require('../../infrastructure');

const { Schema } = mongoose;

module.exports = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
