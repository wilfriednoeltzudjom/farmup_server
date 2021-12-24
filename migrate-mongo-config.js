const envHelper = require('./src/application/helpers/env.helper');

function initSetup() {
  envHelper.loadEnvFile(process.env.NODE_ENV);

  return {
    mongodb: {
      url: process.env.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    migrationsDir: 'migrations',
    migrationFileExtension: '.js',
    changelogCollectionName: 'changelog',
    useFileHash: false,
  };
}

module.exports = initSetup();
