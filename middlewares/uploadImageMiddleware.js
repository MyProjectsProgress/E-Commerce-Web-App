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
    // it creates req.file field
    // multer options returns upload 
    return multerOptions().single(fieldName);
};

exports.uploadMixOfImages = (arrayOfFields) => {
    // multer middleware that uploads multiple files
    // it creates req.files field
    // multerOptions returns upload
    return multerOptions().fields(arrayOfFields);
};

// refactoring image processing in controller is exhausting as there are many fields could be different like size, image field name, etc


// Disk Storage Engine
// Used when no image processing is needed
// the configurations inside multer are done before sending the request to it.
// storage is a function that takes (request, file uploaded, call back)
// request id the body sent by client, file uploaded is created by multer in the request body after catching a file, call nack to handle the error and the path inwhich the file will be saved
// fileFilter to handle whther the user uploaded image or not
// const upload = multer({ storage = multerStorage, fileFileter: multerFilter });
// const multerStorage = multer.diskStorage({
//     // cb 'call back' is like next in middleware
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
// cb send null or error, true or false
// const multerFilter = function (req, file, cb) {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true)
//     } else {
//         cb(new ApiError('Only Images Allowed', 400), false)
//     }
// };