const mongoose = require('mongoose');

const { idGenerator } = require('../../infrastructure');
const { ASSET_TYPES } = require('../enums');

const { Schema } = mongoose;

module.exports = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    type: { type: String, enum: Object.values(ASSET_TYPES), required: true },
    fileName: { type: String },
    fileType: { type: String },
    fileId: { type: String, required: true },
    fileDownloadUrl: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
