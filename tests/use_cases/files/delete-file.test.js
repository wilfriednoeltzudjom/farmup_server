const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const deleteFileUseCase = require('../../../src/use_cases/files/delete-file.usecase')(dependencies);
const { BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Delete file', () => {
  it('should file without the file identifier', async function () {
    await expect(deleteFileUseCase.execute()).to.be.eventually.rejectedWith(BadRequestError);
  });

  it('should succeed deleting a file', async function () {
    await expect(deleteFileUseCase.execute({ fileId: 'fileId' })).to.be.fulfilled;
    expect(global.stubs.fileManager.deleteFile).to.have.been.called;
  });
});
