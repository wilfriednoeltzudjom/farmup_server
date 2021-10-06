const mongoose = require('mongoose');

const { idGenerator } = require('../../infrastructure');
const { LANGUAGES } = require('../enums');
const { categorySchema } = require('../schemas');

const { Schema } = mongoose;

const settingsSchema = new Schema(
  {
    uuid: { type: String, default: idGenerator.generateUUID },
    language: { type: String, enum: Object.values(LANGUAGES), default: LANGUAGES.EN },
    alimentationCategories: { type: [{ type: categorySchema }], default: [] },
    unitsOfMeasure: { type: [{ type: categorySchema }], default: [] },
    prophylaxisRecordCategories: { type: [{ type: categorySchema }], default: [] },
    prophylaxisRecordAdministrationModes: { type: [{ type: categorySchema }], default: [] },
    expenseCategories: { type: [{ type: categorySchema }], default: [] },
    customerCategories: { type: [{ type: categorySchema }], default: [] },
    observationCategories: { type: [{ type: categorySchema }], default: [] },
    operationCategories: { type: [{ type: categorySchema }], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
settingsSchema.methods.refresh = function () {
  return this.model('Settings').findById(this.id);
};

module.exports = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
