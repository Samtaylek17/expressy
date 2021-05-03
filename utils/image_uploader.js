const multer = require('multer');
const AppError = require('../utils/app_error');

const multerStorage = multer.diskStorage({});

const imageFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('Upload only image', 400));
	}
};

const imageUploader = multer({
	storage: multerStorage,
	fileFilter: imageFilter,
});

module.exports = { imageUploader };
