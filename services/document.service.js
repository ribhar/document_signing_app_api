const multer = require("multer");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const { documentModel } = require("../models");

const uploadDocument = async (req, res) => {
  try {

    const document = new documentModel({
      ownerId: req.userData.id,
      docUrl: `${req.file.filename}`,
    });

    const savedDocument = await document.save();
    const { _id } = savedDocument; // Extracting the id from the saved document

    return res.status(200).json({
      message: 'File uploaded successfully',
      _id, 
    });
  } catch (error) {
    console.error('Error saving document details:', error);
    return res.status(500).json({
      error: 'Error saving document details',
      message: error.message,
    });
  }
};


const signDocument = async (req, res) => {
  try {
    const { name, email, signature, pdfId } = req.body;

    const document = await documentModel.findById(pdfId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const { docUrl } = document;

    const pdfDocBytes = fs.readFileSync(`./uploads/${docUrl}`);

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

    const signatureImage = await pdfDoc.embedPng(signature); // Embed the signature image

    page.drawImage(signatureImage, {
      x: 50,
      y: 60,
      width: 150,
      height: 90,
    });

    const modifiedPdfBytes = await pdfDoc.save(); // Save the modified PDF as bytes

    const newDocUrl = docUrl.replace(/\.pdf$/, '_signed.pdf'); // add _signed to document's name.
    fs.writeFileSync(`./uploads/${newDocUrl}`, modifiedPdfBytes);

    // Save document details to the Document model
    const updatedDocument = await documentModel.findOneAndUpdate(
      { _id: pdfId },
      {
        name,
        email,
        isSigned: true,
        signedDocUrl: `/uploads/${newDocUrl}`,
      },
      { new: true }
    );

    const signedPdf = fs.readFileSync(`./uploads/${newDocUrl}`);
    res.contentType('application/pdf');
    res.send(signedPdf);
  } catch (error) {
    console.error('Error signing document:', error);
    return res.status(500).json({ error: 'Error signing document', message: error.message });
  }
};


module.exports = { uploadDocument, signDocument };
