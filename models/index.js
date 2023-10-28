const mongoose = require('mongoose');
const config = require("../configs/config");
const User = require('./user.model')
const Document = require('./document.model')

mongoose.set("strictQuery", false);
const connection = mongoose.connect(config.db.dbURI);

module.exports.connection = connection;

module.exports.userModel = User;
module.exports.documentModel = Document;
