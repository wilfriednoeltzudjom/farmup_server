const { DATABASE_COLLECTIONS } = require('../../database/enums');
const { BandFactory, DayFactory } = require('../../database/factories');

function getExpenses(db, query = {}, { relatedFieldsIncluded = true } = {}) {
  const pipeline = getPipelineForRelatedFields([
    { field: 'band', collection: DATABASE_COLLECTIONS.BANDS },
    { field: 'farm', collection: DATABASE_COLLECTIONS.FARMS },
  ]);
  const fullPipeline = [{ $match: query }];
  if (relatedFieldsIncluded) fullPipeline.push(...pipeline);

  return db.collection(DATABASE_COLLECTIONS.EXPENSES).aggregate(fullPipeline).toArray();
}

async function createBand(db, data = {}) {
  return db.collection(DATABASE_COLLECTIONS.BANDS).insertOne(BandFactory.generateBand(data));
}

async function getBands(db, query = {}) {
  return db.collection(DATABASE_COLLECTIONS.BANDS).find(query).toArray();
}

async function createDay(db, data = {}) {
  return db.collection(DATABASE_COLLECTIONS.DAYS).insertOne(DayFactory.generateDay(data));
}

async function getDays(db, query = {}) {
  return db.collection(DATABASE_COLLECTIONS.DAYS).find(query).sort({ chickensAge: 1 }).toArray();
}

function getPipelineForRelatedFields(relatedFields = []) {
  return relatedFields.flatMap(({ field, collection, joinedField = collection }) => [
    {
      $lookup: {
        from: collection,
        localField: field,
        foreignField: '_id',
        as: joinedField,
      },
    },
    {
      $set: { [field]: { $first: `$${joinedField}` } },
    },
    {
      $unset: `${joinedField}`,
    },
  ]);
}

module.exports = { getExpenses, createBand, getBands, createDay, getDays };
