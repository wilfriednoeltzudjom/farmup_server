const buildUploadFileUseCase = require('../use_cases/files/upload-file.usecase');
const buildDeleteFileUseCase = require('../use_cases/files/delete-file.usecase');

const HttpResponse = require('../application/payloads/http-response');
const { fileMessages } = require('../application/messages');

module.exports = function buildFileController(dependencies) {
  const uploadFileUseCase = buildUploadFileUseCase(dependencies);
  const deleteFileUseCase = buildDeleteFileUseCase(dependencies);

  async function uploadFile(request) {
    const response = await uploadFileUseCase.execute({ files: request.files, ...request.body });

    return HttpResponse.created({
      message: fileMessages.FILE_UPLOADED.FR,
      data: response,
    });
  }

  async function deleteFile(request) {
    await deleteFileUseCase.execute(request.query);

    return HttpResponse.succeeded({
      message: fileMessages.FILE_DELETED.FR,
    });
  }

  return { uploadFile, deleteFile };
};
