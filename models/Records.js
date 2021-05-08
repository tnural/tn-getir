const mongoose = require('mongoose');
/**
 * Record schema of mongo document
 */
const recordSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  counts: [Number],
  createdAt : Date,
  key : String,
  value: String
});

module.exports = mongoose.model('Record', recordSchema);