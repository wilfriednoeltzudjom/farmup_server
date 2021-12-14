const sinon = require('sinon');

const databaseHelper = require('../src/application/helpers/database.helper');
const envHelper = require('../src/application/helpers/env.helper');
const fileManager = require('../src/infrastructure/file_manager');

const sandbox = sinon.createSandbox();

before(async () => {
  envHelper.loadEnvFile('default');
  envHelper.loadEnvFile(process.env.NODE_ENV);

  await databaseHelper.connectDatabase();
});

beforeEach(async () => {
  await databaseHelper.clearDatabase();

  global.stubs = {
    fileManager: {
      uploadFile: sandbox.stub(fileManager, 'uploadFile').resolves({ fileId: 'fileId', fileDownloadUrl: 'fileDownloadUrl' }),
      deleteFile: sandbox.stub(fileManager, 'deleteFile').resolves(),
    },
  };
});

afterEach(() => {
  sandbox.restore();
});

after(async () => {
  await databaseHelper.closeDatabase();
});
