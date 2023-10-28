const { documentModel } = require('../models');
const { documentService } = require('../services');

const uploadDocument = (req, res) => {
  documentService.uploadDocument(req, res);
};

const signDocument = (req, res) => {
  documentService.signDocument(req, res);
};

const getSignedDocumentById = async (req, res) => {
  try {
    const userId = req.userData.id; 
    const documentId = req.params.id;
    const signedDocument = await documentModel.findOne({ _id: documentId, ownerId: userId, isSigned: true }); 

    if (!signedDocument) {
      return res.status(404).json({ message: 'Document not found or not signed by the user' });
    }

    res.json(signedDocument);
  } catch (error) {
    console.error('Error fetching signed document:', error);
    return res.status(500).json({ error: 'Error fetching signed document', message: error.message });
  }
};


const getAllSignedDocuments = async (req, res) => {
  try {
    const userId = req.userData.id; 
    const signedDocuments = await documentModel.find({ ownerId: userId, isSigned: true }); // Query to find signed documents for the user
    res.json(signedDocuments);
  } catch (error) {
    console.error('Error fetching signed documents:', error);
    return res.status(500).json({ error: 'Error fetching signed documents', message: error.message });
  }
};

module.exports = {
  uploadDocument,
  signDocument,
  getSignedDocumentById,
  getAllSignedDocuments
};
