const mongoose = require('mongoose');

const { filterSearchableStrings } = require('../../application/helpers/models.helper');
const { idGenerator, diacriticsUtils } = require('../../infrastructure');
const { prophylaxisSchema } = require('./prophylaxis.model');
const { BAND_STATUSES } = require('../enums');

const { Schema } = mongoose;

const bandSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    code: { type: String, required: true },
    status: { type: String, enum: Object.values(BAND_STATUSES), default: BAND_STATUSES.PENDING },
    title: { type: String },
    startedAt: { type: Date },
    broodingEndedAt: { type: Date },
    cancelledAt: { type: Date },
    endedAt: { type: Date },
    mainBuildingArea: { type: Number, default: 0 },
    chickensStartCount: { type: Number, default: 0 },
    chickensDeathsCount: { type: Number, default: 0 },
    chickensStartAge: { type: Number, default: 0 },
    chickensCurrentAge: { type: Number, default: 0 },
    chickensDeathRate: { type: Number, default: 0 },
    comment: { type: String },
    searchableStrings: { type: [{ type: String, index: true }], default: [] },
    prohylaxis: { type: prophylaxisSchema },
    farm: { type: Schema.Types.ObjectId, ref: 'Farm' },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
bandSchema.pre('save', function () {
  this.searchableStrings = filterSearchableStrings([diacriticsUtils.sanitize(this.code), diacriticsUtils.sanitize(this.title)]);
});
bandSchema.methods.refresh = function () {
  return this.model('Band').findById(this.id);
};

module.exports = mongoose.models.Band || mongoose.model('Band', bandSchema);
