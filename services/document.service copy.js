const multer = require('multer');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const { documentModel } = require('../models');

const uploadDocument = (req, res) => {
  const updatedPdfUrl = req.file.filename;

  const document = new documentModel({
    ownerId: req.userData.id, 
    docUrl: `http://localhost:8080/uploads/${updatedPdfUrl}`,
  });

  document.save((err, savedDocument) => {
    if (err) {
      console.error('Error saving document details:', err);
      return res.status(500).json({ error: 'Error saving document details', message: err.message });
    }

    return res.status(200).json({ message: 'File uploaded successfully', pdfUrl: savedDocument.pdfUrl });
  });
};

const signDocument = async (req, res) => {
  try {
    const { name, email, signature, pdfUrl } = req.body; 

    const pdfDocBytes = fs.readFileSync(`./uploads/${pdfUrl}`); 

    const pdfDoc = await PDFDocument.load(pdfDocBytes);
    const page = pdfDoc.getPage(0); 

    const { width, height } = page.getSize();
    const fontSize = 12;
    const xCoordinate = 50; 
    const yCoordinate = 50; 

    page.drawText(name, { x: xCoordinate, y: yCoordinate, size: fontSize, color: rgb(0, 0, 0) });
    page.drawText(email, { x: xCoordinate, y: yCoordinate - 20, size: fontSize, color: rgb(0, 0, 0) });

  
    const signatureImage = await pdfDoc.embedPng(signature); // Embed the signature image

    page.drawImage(signatureImage, {
      x: 50,
      y: 60,
      width: 150,
      height: 90,
    });

    const modifiedPdfBytes = await pdfDoc.save(); // Save the modified PDF as bytes

    fs.writeFileSync(`./uploads/signed/${pdfUrl}`, modifiedPdfBytes);
    
    // Save document details to the Document model
    const updatedDocument = await documentModel.findOneAndUpdate(
      { docUrl },
      { name, email, isSigned: true, signedDocUrl: `http://localhost:8080/uploads/signed/${pdfUrl}` },
      { new: true }
    );

    const signedPdf = fs.readFileSync(`./uploads/signed/${pdfUrl}`);
    res.contentType('application/pdf');
    res.send(signedPdf);
  } catch (error) {
    console.error('Error signing document:', error);
    return res.status(500).json({ error: 'Error signing document', message: error.message });
  }
};

module.exports = { uploadDocument, signDocument };
