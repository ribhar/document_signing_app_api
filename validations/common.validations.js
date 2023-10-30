const Joi = require("joi");

const allowedImageMimetype = (mime) =>
  [
    "image/png",
    "application/pdf",
  ].includes(mime.toString());

const validateImage = (req, file, callback) => {
  if (allowedImageMimetype(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

// Upload Limits
// Sizes are in bytes
// 1048576 - 1mb, 5242880 - 5mb, 10485760 - 10mb
const limits = {
  unsignedDoc: { fileSize: 5242880 },
  signature: { fileSize: 5242880 },
};


// file names for s3 uploads
const fileName = {
  unsignedDoc: "file",
  signature: "signature",
};


module.exports = {
  limits,
  fileName,
  validateImage,
};
