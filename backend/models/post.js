const mongoose = require('mongoose');

// Schema setup
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: "Default Content"}
});

// Model Schema
module.exports = mongoose.model('Post', postSchema);
