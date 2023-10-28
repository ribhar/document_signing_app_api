const mergeSignatureWithDocument = async (
  documentBytes,
  signatureBytes,
  x,
  y,
  width,
  height
) => {
  try {
    const pdfDoc = await PDFDocument.load(documentBytes);

    const signatureImage = await pdfDoc.embedPng(signatureBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    firstPage.drawImage(signatureImage, {
      x: x,
      y: y,
      width: width,
      height: height,
    });

    // Serialize the PDF document
    const modifiedDocumentBytes = await pdfDoc.save();

    return modifiedDocumentBytes;
  } catch (error) {
    throw new Error("Failed to merge signature with the document");
  }
};

module.exports = {
  mergeSignatureWithDocument,
};
