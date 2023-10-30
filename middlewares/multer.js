const multer = require("multer");
const {cloudinary} = require('../configs/cloudinary')
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const config = require("../configs/config");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: `${config.cloudinary.docMediaPath}`,
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

const upload = multer({ storage: storage, limits: { fileSize: 5242880 } });

module.exports = { upload };
