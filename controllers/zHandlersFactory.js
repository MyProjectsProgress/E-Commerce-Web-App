const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');


// @desc   Update Model
// @route  PUT /api/v1/model/:id
// @access Private
exports.updateOne = (Model) => asyncHandler(async (req, res, next) => {

    const document = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!document) {
        return next(new ApiError(`No ${Model} for This ID: ${id}`, 404));
    }

    res.status(200).json({ data: document });
});


// @desc   Delete Model
// @route  PUT /api/v1/model/:id
// @access Private
exports.deleteOne = (Model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
        return next(new ApiError(`No ${Model} for This ID: ${id}`, 404));
    }

    res.status(204).send();
});


// @desc   Create Model
// @route  POST /api/v1/model
// @access Private
exports.createOne = (Model) => asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
});


// @desc   Get Model By ID
// @route  GET /api/v1/models/:id
// @access Public
exports.getOne = (Model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
        return next(new ApiError(`No ${Model} for This ID: ${id}`, 404));
    }
    res.status(200).json({ data: document });
});
