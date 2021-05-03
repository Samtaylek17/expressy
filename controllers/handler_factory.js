const catchAsync = require('../utils/catch_async');
const AppError = require('../utils/app_error');
const APIFeatures = require('../utils/api_features');

const deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc) {
			return next(new AppError('Oops! No document found with that ID', 404));
		}

		res.status(204).json({
			status: 'success',
			data: null,
		});
	});
