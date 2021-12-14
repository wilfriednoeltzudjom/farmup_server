const addressSchema = require('./address.schema');
const assetSchema = require('./asset.schema');
const categorySchema = require('./category.schema');
const prophylaxisRecordSchema = require('./prophylaxis/prophylaxis-record.schema');
const dayAlimentationSchema = require('./day/day-alimentation.schema');
const dayMedecineSchema = require('./day/day-medecine.schema');
const dayObservationSchema = require('./day/day-observation.schema');
const dayDeathSchema = require('./day/day-death.schema');

module.exports = { addressSchema, assetSchema, categorySchema, prophylaxisRecordSchema, dayAlimentationSchema, dayMedecineSchema, dayObservationSchema, dayDeathSchema };
