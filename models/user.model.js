const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require('../configs/config')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String
  },
});


userSchema.methods.getAuthorizationToken = async function () {
  const token = jwt.sign({ id: this._id, email: this.email, username: this.username }, config.jwt.secret, { expiresIn: config.jwt.secretExpiry });
  this.online = true;
  this.token = token;
  await this.save();
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
