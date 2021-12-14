module.exports = function buildDeleteFileUseCase(dependencies) {
  const { dataValidator, fileManager } = dependencies;

  async function execute(data = {}) {
    validateData(data);

    return fileManager.deleteFile(data);
  }

  function validateData({ fileId }) {
    dataValidator.validateStringAsRequired(fileId, 'File identifier');
  }

  return { execute };
};
