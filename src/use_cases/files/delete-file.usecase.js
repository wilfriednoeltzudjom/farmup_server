const { isNonEmptyObject } = require('../../application/helpers/types.helper');
const { Sale, Expense } = require('../../database/models');

module.exports = function buildDeleteFileUseCase(dependencies) {
  const { dataValidator, fileManager } = dependencies;

  async function execute(data = {}) {
    validateData(data);
    await fileManager.deleteFile(data);
    await removeFileFromDocumentAssets(data);
  }

  function validateData({ fileId }) {
    dataValidator.validateStringAsRequired(fileId, 'File identifier');
  }

  async function removeFileFromDocumentAssets({ fileId, ...options }) {
    if (!isNonEmptyObject(options)) return;

    const { documentCollection, documentId } = options;
    const chosenStrategy = {
      async sales() {
        return Sale.updateOne({ _id: documentId }, { $pull: { assets: { fileId } } });
      },
      async expenses() {
        return Expense.updateOne({ _id: documentId }, { $pull: { assets: { fileId } } });
      },
    }[documentCollection];
    if (chosenStrategy) await chosenStrategy();
  }

  return { execute };
};
