const multer = require("multer");
const { URL } = require('url');
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const axios = require('axios');
const fs = require("fs");
const { documentModel } = require("../models");
const { deleteFileFromS3, uploadS3Object } = require("../middlewares/s3-middleware");
const config = require("../configs/config");
const s3 = require("../configs/s3");


const uploadDocument = async (req, res) => {
  try {

    const document = new documentModel({
      ownerId: req.userData.id,
      unsignedDocUrl: `${req.file.location}`,
    });
    
    const savedDocument = await document.save();
    const { _id } = savedDocument; // Extracting the id from the saved document

    return res.status(200).json({
      message: 'File uploaded successfully',
      _id, 
    });
  } catch (error) {
    console.error('Error saving document details:', error);
    // Call deleteFileFromS3 to delete the uploaded file on error
    if (req.file && req.file.location) {
      await deleteFileFromS3(req.file.location);
    }

    return res.status(500).json({
      error: 'Error saving document details',
      message: error.message,
    });
  }
};


const signDocument = async (req, res) => {
  try {
    const { name, email } = req.body;
    const { id } = req.params;
    const signature = req.file;

    const document = await documentModel.findById(id); 

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const { unsignedDocUrl } = document;

    const url = new URL(unsignedDocUrl);
    const s3Params = {
      Bucket: config.aws.bucket,
      Key: decodeURIComponent(url.pathname.substr(1)), // Extract the key from the pathname
    };

    const s3PdfObject = await s3.getObject(s3Params).promise();
    const pdfDocBytes = s3PdfObject.Body;

    const pdfDoc = await PDFDocument.load(pdfDocBytes);
    const page = pdfDoc.getPage(0);

    const { width, height } = page.getSize();
    const fontSize = 12;
    const xCoordinate = 50;
    const yCoordinate = 50;

    page.drawText(name, {
      x: xCoordinate,
      y: yCoordinate,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    page.drawText(email, {
      x: xCoordinate,
      y: yCoordinate - 20,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    const s3SignatureParams = {
      Bucket: config.aws.bucket,
      Key: signature.key, 
    };

    const s3SignatureObject = await s3.getObject(s3SignatureParams).promise();
    const signatureImage = await pdfDoc.embedPng(s3SignatureObject.Body); // Embed the signature image

    page.drawImage(signatureImage, {
      x: 50,
      y: 60,
      width: 150,
      height: 90,
    });

    const modifiedPdfBytes = await pdfDoc.save(); 

    const s3Response = await uploadS3Object(modifiedPdfBytes)

    // Save document details to the Document model
    await documentModel.findOneAndUpdate(
      { _id: id }, // Updating the document with docId
      {
        name,
        email,
        isSigned: true,
        signatureUrl: signature.location, 
        signedDocUrl: s3Response, 
      },
      { new: true }
    ).catch(async (error) => {
      await deleteFileFromS3(s3Response);
      return res.status(500).json({ error: 'Error saving document url', message: error.message });
    });

    const signedPdf = modifiedPdfBytes; // Use modified PDF bytes
    res.contentType('application/pdf');
    res.send(signedPdf);
  } catch (error) {
    console.error('Error signing document:', error);
    await deleteFileFromS3(req.file.location);
    return res.status(500).json({ error: 'Error signing document', message: error.message });
  }
};

module.exports = { uploadDocument, signDocument };
