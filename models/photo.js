// models/Photo.js
const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imgUrl: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
  description: { type: String, required: true }
});

module.exports = mongoose.model('Photo', PhotoSchema);
