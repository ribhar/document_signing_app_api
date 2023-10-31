const express = require("express");
const { documentController } = require("../controllers/");
const { documentValidation } = require("../validations/");
const jwtVerify = require("../middlewares/jwtVerify");
const validate = require("../middlewares/validate");
const { limits, path, fileName, validateImage} = require("../validations/common.validations");
const { uploadToS3 } = require("../middlewares/s3-middleware");

const router = express.Router();

router.post(
  "/upload",
  jwtVerify.verifyToken,
  uploadToS3({
    limits: limits.unsignedDoc,
    fileFilter: validateImage,
  }).single(fileName.unsignedDoc),
  documentController.uploadDocument
);

router.post(
  "/sign/:id",
  jwtVerify.verifyToken,
  uploadToS3({
    limits: limits.signature,
    fileFilter: validateImage,
  }).single(fileName.signature),
  documentController.signDocument
);

router.get(
  "/search",
  jwtVerify.verifyToken,
  validate(documentValidation.getSignedDocument),
  documentController.getSignedDocumentByQuery
);

router.get(
  "/",
  jwtVerify.verifyToken,
  documentController.getAllSignedDocuments
);

module.exports = router;
