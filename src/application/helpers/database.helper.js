const mongoose = require('mongoose');

async function connectDatabase() {
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function clearDatabase() {
  const { collections } = mongoose.connection;

  return Promise.all(
    Object.keys(collections)
      .map((collectionName) => collections[collectionName])
      .map((collection) => collection.deleteMany())
  );
}

async function closeDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}

module.exports = { connectDatabase, clearDatabase, closeDatabase };
