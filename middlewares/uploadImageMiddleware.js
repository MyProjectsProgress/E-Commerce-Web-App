const multer = require('multer');
const ApiError = require('../utils/apiError');

const multerOptions = () => {

    // Memory Storage Engine
    // Used when we need image processing, when image processing is a microservice we don't use it
    const multerStorage = multer.memoryStorage();

    // checking whether the inserted file is image or not.
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new ApiError('Only Images Allowed', 400), false);
        }
    };

    // multer middleware takes a property called storage and fileFilter which are defined above 
    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

    return upload;
};

exports.uploadSingleImage = (fieldName) => {
    // multer middleware that uploads single file
    return multerOptions().single(fieldName);
};

exports.uploadMixOfImages = (arrayOfFields) => {
    // multer middleware that uploads multiple file
    return multerOptions().fields(arrayOfFields);
};




// Disk Storage Engine
    // the configurations inside multer are done before sending the request to it.
    // const multerStorage = multer.diskStorage({
    //     // cb is like next in middleware
    //     destination: function (req, file, cb) {
    //         // cb is null means I got no errors
    //         cb(null, 'uploads/categories');
    //     },
    //     filename: function (req, file, cb) {
    //         // category-${id}-Date.now().extention
    //         const extention = file.mimetype.split('/')[1];
    //         const randomID = uuidv4();
    //         const filename = `category-${randomID}-${Date.now()}.${extention}`;
    //         cb(null, filename);
    //     }
    // });