const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

// @desc   Delete Model
// @route  PUT /api/v1/model/:id
// @access Private
exports.deleteOne = (Model) => asyncHandler(async (req, res, next) => {

    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
        return next(new ApiError(`No document for this ID: ${req.params.id}`, 404));
    }
    // triger remove event when delete document 
    document.remove();
    res.status(204).send();
});

// @desc   Update Model
// @route  PUT /api/v1/model/:id
// @access Private
exports.updateOne = (Model) => asyncHandler(async (req, res, next) => {

    // new is true to send the updated data in the response no the old data
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!document) {
        return next(new ApiError(`No document for this ID: ${req.params.id}`, 404));
    }
    // triger save event when update document 
    document.save();
    res.status(200).json({ data: document });
});

// @desc   Create Model
// @route  POST /api/v1/model
// @access Private
exports.createOne = (Model) => asyncHandler(async (req, res) => {
    // Remmeber, we don't need next as we use res.send() embedded in res.status.json({})
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
});

// @desc   Get Model By ID
// @route  GET /api/v1/models/:id
// @access Public
exports.getOne = (Model, populationOption) => asyncHandler(async (req, res, next) => {

    // build query 
    let query = Model.findById(req.params.id);

    if (populationOption) {
        // adding another query 
        query.populate(populationOption);
    }

    // excute query
    const document = await query;

    if (!document) {
        return next(new ApiError(`No document for this ID: ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});

// @desc   Get list of Models
// @route  GET /api/v1/models
// @access Public
exports.getAll = (Model, modelName = '') => asyncHandler(async (req, res) => {

    let filter = {};
    if (req.filterObj) {
        filter = req.filterObj;
    }
    // Build Query
    // countDocuments() is a built in function that counts model docs
    const documentCounts = await Model.countDocuments();

    // we create object then apply the chained features on it.
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
        .paginate(documentCounts)
        .filter()
        .search(modelName)
        .limitFields()
        .sort();

    // Excute Query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res.status(200).json({ results: documents.length, paginationResult, data: documents });
});