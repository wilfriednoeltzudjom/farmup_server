const { expect } = require('chai');

const dependencies = require('../../../src/infrastructure');
const deleteFileUseCase = require('../../../src/use_cases/files/delete-file.usecase')(dependencies);
const { SaleFactory, AssetFactory } = require('../../../src/database/factories');
const { BadRequestError } = require('../../../src/application/helpers/errors');

describe('UseCase - Delete file', () => {
  it('should file without the file identifier', async function () {
    await expect(deleteFileUseCase.execute()).to.be.eventually.rejectedWith(BadRequestError);
  });

  it('should succeed deleting a file', async function () {
    await expect(deleteFileUseCase.execute({ fileId: 'fileId' })).to.be.fulfilled;
    expect(global.stubs.fileManager.deleteFile).to.have.been.called;
  });

  it('should succeed and update the document assets', async function () {
    const sale = await SaleFactory.createSale({ assets: Array(3).fill().map(AssetFactory.generateAsset) });

    await expect(deleteFileUseCase.execute({ fileId: sale.assets[0].fileId, documentCollection: 'sales', documentId: sale.id })).to.be.fulfilled;
    expect(global.stubs.fileManager.deleteFile).to.have.been.called;

    const updatedSale = await sale.refresh();
    expect(updatedSale.assets).to.have.lengthOf(2);
    expect(updatedSale.assets.find((asset) => asset === sale.assets[0].fileId)).to.be.undefined;
  });
});
