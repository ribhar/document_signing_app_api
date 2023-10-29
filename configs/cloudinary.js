const cloudinary = require('cloudinary').v2;
const config = require('./config');


cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.key,
    api_secret: config.cloudinary.secret,
    // secure: true
});

module.exports = {cloudinary};