const multer = require('multer');

const { BadRequestError } = require('../../../../application/helpers/errors');

const storage = multer.memoryStorage();

function fileFilter(_, file, cb) {
  const fileAllowed = file.originalname.match(/.(jpg|jpeg|png|pdf)$/i);
  if (!fileAllowed) {
    return cb(new BadRequestError('Only image or pdf files are allowed.'), false);
  }
  cb(null, true);
}

module.exports = multer({ storage, limits: { fieldSize: 10 * 1024 * 1024 }, fileFilter }).array('files', 10);
