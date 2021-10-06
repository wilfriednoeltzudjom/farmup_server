const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = new Schema({
  fullAddress: { type: String },
  addressLine1: { type: String },
  addressLine2: { type: String },
  zipCode: { type: String },
  city: { type: String },
  country: { type: String },
});
