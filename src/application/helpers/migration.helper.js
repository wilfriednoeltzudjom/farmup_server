const { DATABASE_COLLECTIONS } = require('../../database/enums');

function getExpenses(db, query = {}, { relatedFieldsIncluded = true } = {}) {
  const pipeline = getPipelineForRelatedFields([
    { field: 'band', collection: DATABASE_COLLECTIONS.BANDS },
    { field: 'farm', collection: DATABASE_COLLECTIONS.FARMS },
  ]);
  const fullPipeline = [{ $match: query }];
  if (relatedFieldsIncluded) fullPipeline.push(...pipeline);

  return db.collection(DATABASE_COLLECTIONS.EXPENSES).aggregate(fullPipeline).toArray();
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

module.exports = { getExpenses };
