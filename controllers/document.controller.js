const { documentModel } = require('../models');
const { documentService } = require('../services');

const uploadDocument = (req, res) => {
  documentService.uploadDocument(req, res);
};

const signDocument = (req, res) => {
  documentService.signDocument(req, res);
};

const getSignedDocumentByQuery = async (req, res) => {
  try {
    const userId = req.userData.id;
    const docNameQuery = req.query.search; 
    const signedDocuments = await documentModel.find({ ownerId: userId, isSigned: true, docName: { $regex: docNameQuery, $options: 'i' } });

    if (!signedDocuments || signedDocuments.length === 0) {
      return res.status(404).json({ message: 'No signed documents found for the provided query' });
    }

    res.json(signedDocuments);
  } catch (error) {
    console.error('Error fetching signed documents:', error);
    return res.status(500).json({ error: 'Error fetching signed documents', message: error.message });
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
  getSignedDocumentByQuery,
  getAllSignedDocuments
};
