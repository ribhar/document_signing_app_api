const express = require("express");
const { documentController } = require("../controllers/");
const { documentValidation } = require("../validations/");
const jwtVerify = require("../middlewares/jwtVerify");
const validate = require("../middlewares/validate");
const {upload} = require("../middlewares/multer");
const { limits, path, fileName, validateImage} = require("../validations/common.validations");
const { uploadTOS3 } = require("../middlewares/s3-middleware");

const router = express.Router();


// router.post("/upload-test", async (req, res, next) => {
//   try {
//     console.log(req.body.filename)
//     uploadTOS3({
//       limits: limits.unsignedDoc,
//       fileFilter: validateImage,
//     }).single(fileName.unsignedDoc)(req, res, (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: "upload failed" });
//       }
//       next();
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "upload failed",err });
//   }
// }, async (req, res) => {
//   try {
//     const file = req.file;
    
//     return res.status(201).json({
//       status: 200,
//       message: "User registered successfully.",
//       data: file,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "upload failed" });
//   }
// });

// router.post(
//   "/upload",
//   jwtVerify.verifyToken,
//   validate(documentValidation.uploadDocument),
//   upload.single("file"),
//   documentController.uploadDocument
// );

router.post(
  "/upload",
  jwtVerify.verifyToken,
  // validate(documentValidation.uploadDocument),
  uploadTOS3({
    limits: limits.unsignedDoc,
    fileFilter: validateImage,
  }).single(fileName.unsignedDoc),
  documentController.uploadDocument
);

router.post(
  "/sign/:id",
  jwtVerify.verifyToken,
  uploadTOS3({
    limits: limits.signature,
    fileFilter: validateImage,
  }).single(fileName.signature),
  documentController.signDocument
);

router.get(
  "/:id",
  jwtVerify.verifyToken,
  validate(documentValidation.getSignedDocument),
  documentController.getSignedDocumentById
);

router.get(
  "/",
  jwtVerify.verifyToken,
  documentController.getAllSignedDocuments
);

module.exports = router;
