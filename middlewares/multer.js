const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Define the destination for uploaded files
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file to avoid conflicts
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

const uploadSingleFile = multer({ storage: storage }).single("file");
const validateformdata = multer().none();

module.exports = { uploadSingleFile, validateformdata };
