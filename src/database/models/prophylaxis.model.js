const mongoose = require('mongoose');

const { idGenerator } = require('../../infrastructure');
const { prophylaxisRecordSchema } = require('../schemas');

const { Schema } = mongoose;

const prophylaxisSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    records: { type: [{ type: prophylaxisRecordSchema }], default: [] },
    farm: { type: Schema.Types.ObjectId, ref: 'Farm' },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
prophylaxisSchema.methods.refresh = function () {
  return this.model('Prophylaxis').findById(this.id);
};

module.exports = mongoose.models.Prophylaxis || mongoose.model('Prophylaxis', prophylaxisSchema);
module.exports.prophylaxisSchema = prophylaxisSchema;
