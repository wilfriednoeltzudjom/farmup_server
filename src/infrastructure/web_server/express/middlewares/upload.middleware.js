const multer = require('multer');

const storage = multer.memoryStorage();

module.exports = multer({ storage, limits: { fieldSize: 10 * 1024 * 1024 } }).single('file');
