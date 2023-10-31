const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isSigned: {
    type: Boolean,
    default: false,
  },
  unsignedDocUrl: {
    type: String,
    required: true,
  },
  signatureUrl: {
    type: String,
  },
  signedDocUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
