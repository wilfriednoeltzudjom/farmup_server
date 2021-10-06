const mongoose = require('mongoose');

const { idGenerator } = require('../../infrastructure');
const { SESSION_STATUSES } = require('../enums');

const { Schema } = mongoose;

const sessionSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    status: { type: String, enum: Object.values(SESSION_STATUSES), default: SESSION_STATUSES.RUNNING },
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
sessionSchema.methods.refresh = function () {
  return this.model('Session').findById(this.id);
};

module.exports = mongoose.models.Session || mongoose.model('Session', sessionSchema);
