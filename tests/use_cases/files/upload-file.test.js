const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const uploadFileUseCase = require('../../../src/use_cases/files/upload-file.usecase')(dependencies);
const { ASSET_FOLDERS } = require('../../../src/database/enums');
const { BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Upload file', () => {
  it('should file without the file property', async function () {
    await expect(uploadFileUseCase.execute()).to.be.eventually.rejectedWith(BadRequestError);
  });

  it('should fail if the file parameter is not a valid File object', async function () {
    await expect(uploadFileUseCase.execute({ files: [] })).to.be.eventually.rejectedWith(BadRequestError);
  });

  it('should succeed uploading an image', async function () {
    await expect(
      uploadFileUseCase.execute({
        files: [
          {
            originalname: 'filename.jpg',
            buffer: Buffer.from(['filename']),
            mimetype: 'image/jpg',
          },
        ],
        folder: ASSET_FOLDERS.EXPENSES,
      })
    ).to.be.fulfilled;
    expect(global.stubs.fileManager.uploadFile).to.have.been.called;
  });

  it('should succeed uploading a pdf', async function () {
    await expect(
      uploadFileUseCase.execute({
        files: [
          {
            originalname: 'filename.pdf',
            buffer: Buffer.from(['filename']),
            mimetype: 'application/pdf',
          },
        ],
        folder: ASSET_FOLDERS.EXPENSES,
      })
    ).to.be.fulfilled;
    expect(global.stubs.fileManager.uploadFile).to.have.been.called;
  });
});
