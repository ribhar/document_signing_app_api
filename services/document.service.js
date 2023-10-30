const multer = require("multer");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const axios = require('axios');
const fs = require("fs");
const { documentModel } = require("../models");
const { deleteFileFromS3, uploadS3Object } = require("../middlewares/s3-middleware");


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

    const response = await axios.get(unsignedDocUrl, {
      responseType: 'arraybuffer', // Get the S3 object as an array buffer
    });
    const pdfDocBytes = response.data;

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

    const signatureImageResponse = await axios.get(signature.location
      , {
      responseType: 'arraybuffer', // Get the S3 object as an array buffer
    }
    );
    const signatureImageBytes = signatureImageResponse.data;
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

    page.drawImage(signatureImage, {
      x: 50,
      y: 60,
      width: 150,
      height: 90,
    });

    const modifiedPdfBytes = await pdfDoc.save(); // Save the modified PDF as bytes

    const signedDocUrl = await uploadS3Object(modifiedPdfBytes)

    // Save document details to the Document model
    await documentModel.findOneAndUpdate(
      { _id: id }, // Updating the document with docId
      {
        name,
        email,
        isSigned: true,
        signatureUrl: signature.location, 
        signedDocUrl, 
      },
      { new: true }
    ).catch(async (error) => {
      await deleteFileFromS3(signedDocUrl);
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
