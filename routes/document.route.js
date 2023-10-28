const express = require("express");
const { documentController } = require("../controllers/");
const { documentValidation } = require("../validations/");
const jwtVerify = require("../middlewares/jwtVerify");
const validate = require("../middlewares/validate");
const multerValidatation = require("../middlewares/multer");

const router = express.Router();

router.post(
  "/upload",
  jwtVerify.verifyToken,
  validate(documentValidation.uploadDocument),
  multerValidatation.uploadSingleFile,
  documentController.uploadDocument
);

router.post(
  "/sign",
  jwtVerify.verifyToken,
  validate(documentValidation.signDocument),
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
