const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    format: async (req, file) => {
      if (file.mimetype === "application/pdf") {
        return "pdf";
      } else if (file.mimetype === "image/png") {
        return "png";
      } else {
        return "png"; // Default format
      }
    },
    public_id: (req, file) => `${Date.now()}`,
  },
});

const uploadSingleFile = multer({ storage: storage });
const validateformdata = multer().none();

module.exports = { uploadSingleFile, validateformdata };
