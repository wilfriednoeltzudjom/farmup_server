const cloudinary = require('cloudinary').v2;
const md5 = require('md5');
const DatauriParser = require('datauri/parser');
const path = require('path');

const FileManager = require('../interface');
const logger = require('../../logger');
const { BadRequestError } = require('../../../application/helpers/errors');

module.exports = class CloudinaryFileManager extends FileManager {
  async uploadFile({ file, folder } = {}) {
    configureCloudinary();

    const response = await cloudinary.uploader.upload(toDataURIContent(file), {
      folder: getFileBaseFolder(folder),
    });
    if (!hasFileBeenCorrectlyUploaded(file, response)) {
      await this.deleteFile({ fileId: response._id });
      throw new BadRequestError(`Unable to upload file <${JSON.stringify(file)}> to folder <${folder}>`);
    }

    return { fileDownloadUrl: response.secure_url, fileId: response.public_id };
  }

  async deleteFile({ fileId } = {}) {
    configureCloudinary();
    await cloudinary.uploader.destroy(fileId);
    logger.info(`File <${fileId}> successfully deleted`);
  }
};

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

function toDataURIContent(file) {
  const datauri = new DatauriParser().format(path.extname(file.originalname).toString(), file.buffer);

  return datauri.content;
}

function getFileBaseFolder(folder) {
  const ROOT_FOLDER = 'farmup';
  const baseFolder = `${ROOT_FOLDER}/${process.env.NODE_ENV}`;

  return baseFolder.concat(folder ? `/${folder}` : '');
}

function hasFileBeenCorrectlyUploaded(file, response) {
  const fileEtag = md5(file.buffer);

  return fileEtag === response.etag;
}
