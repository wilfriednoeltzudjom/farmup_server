const { ASSET_FOLDERS, ASSET_TYPES } = require('../../database/enums');

module.exports = function buildUploadFileUseCase(dependencies) {
  const { dataValidator, fileManager } = dependencies;

  async function execute(data = {}) {
    validateData(data);

    const { files, folder } = data;

    return Promise.all(files.map((file) => uploadFile(file, folder)));
  }

  function validateData({ files, folder }) {
    dataValidator.validateArrayAsRequired(files, 'Files');
    files.forEach(dataValidator.validateFileAsRequired);
    dataValidator.validateEnumAsRequired(ASSET_FOLDERS, folder, 'Files folder');
  }

  async function uploadFile(file, folder) {
    const uploadResponse = await fileManager.uploadFile({ file, folder });

    return { ...uploadResponse, ...extractFileProperties(file) };
  }

  function extractFileProperties(file) {
    const { mimetype } = file;
    const fileProperties = { mimeType: mimetype };
    const type = getImageType(mimetype);
    if (type) fileProperties.type = type;

    return fileProperties;
  }

  function getImageType(mimeType) {
    if (mimeType.includes('image')) return ASSET_TYPES.IMAGE;
    if (mimeType.includes('pdf')) return ASSET_TYPES.PDF;

    return '';
  }

  return { execute };
};
