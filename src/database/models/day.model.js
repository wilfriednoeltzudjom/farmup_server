const mongoose = require('mongoose');

const { idGenerator } = require('../../infrastructure');
const { prophylaxisRecordSchema, dayAlimentationSchema, dayMedecineSchema, dayDeathSchema, dayObservationSchema } = require('../schemas');
const { DAY_TAGS } = require('../enums');

const { Schema } = mongoose;

const daySchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    date: { type: Date, required: true },
    chickensCount: { type: Number, default: 0 },
    chickensAge: { type: Number, default: 0 },
    chickensWeight: { type: Number, default: 0 },
    chickensMinimumWeight: { type: Number, default: 0 },
    chickensMaximumWeight: { type: Number, default: 0 },
    buildingTemperature: { type: Number, default: 0 },
    buildingHumidity: { type: Number, default: 0 },
    tags: { type: [{ type: String }], enum: Object.values(DAY_TAGS), default: [] },
    alimentations: { type: [{ type: dayAlimentationSchema }], default: [] },
    medecines: { type: [{ type: dayMedecineSchema }], default: [] },
    deaths: { type: [{ type: dayDeathSchema }], default: [] },
    observations: { type: [{ type: dayObservationSchema }], default: [] },
    prophylaxisRecord: { type: prophylaxisRecordSchema },
    band: { type: Schema.Types.ObjectId, ref: 'Band' },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
daySchema.pre('save', function () {
  let divider = 0;
  if (this.chickensMinimumWeight > 0) divider++;
  if (this.chickensMaximumWeight > 0) divider++;
  this.chickensWeight = divider > 0 ? (this.chickensMinimumWeight + this.chickensMaximumWeight) / divider : 0;
});
daySchema.methods.refresh = function () {
  return this.model('Day').findById(this.id);
};

module.exports = mongoose.models.Day || mongoose.model('Day', daySchema);
