const multer = require("multer");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const axios = require('axios');
const fs = require("fs");
const { documentModel } = require("../models");





const uploadDocument = async (req, res) => {
  try {

    const document = new documentModel({
      ownerId: req.userData.id,
      unsignedDocUrl: `${req.file.path}`,
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
    const { name, email } = req.body;
    const { id } = req.params;
    const signature = req.file;

    

    const document = await documentModel.findById(id); 

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const { unsignedDocUrl } = document;

    const pdfUrl = unsignedDocUrl;

    // Download the PDF to a local file
    const localPdfPath = 'temp.pdf';
    const pdfStream = fs.createWriteStream(localPdfPath);
    const request = require('https').get(pdfUrl, (response) => {
      response.pipe(pdfStream);
      console.log(response.pipe(pdfStream))
      response.on('end', () => {
        pdfStream.close();
        // Read the downloaded PDF
        // readPDF(localPdfPath);
     });
})

    const response = await axios.get(unsignedDocUrl, { responseType: 'arraybuffer' });
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

    const signatureImage = await pdfDoc.embedPng(fs.readFileSync(signature.path)); // Embed the signature image

    page.drawImage(signatureImage, {
      x: 50,
      y: 60,
      width: 150,
      height: 90,
    });

    const modifiedPdfBytes = await pdfDoc.save(); // Save the modified PDF as bytes

    const signedDocName = new Date().getTime()

    const cloudinaryResponse = await cloudinary.uploader.upload(modifiedPdfBytes, {
      folder: config.cloudinary.docMediaPath,
      public_id: signedDocName,  
      unique_filename: true,
      resource_type: "auto",
    });

    // Save document details to the Document model
    await documentModel.findOneAndUpdate(
      { _id: docId }, // Updating the document with docId
      {
        name,
        email,
        isSigned: true,
        signatureUrl: req.file.path, 
        signedDocUrl: cloudinaryResponse.secure_url, 
      },
      { new: true }
    );

    const signedPdf = modifiedPdfBytes; // Use modified PDF bytes
    res.contentType('application/pdf');
    res.send(signedPdf);
  } catch (error) {
    console.error('Error signing document:', error);
    return res.status(500).json({ error: 'Error signing document', message: error.message });
  }
};

module.exports = { uploadDocument, signDocument };
