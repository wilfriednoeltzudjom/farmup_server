const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = new Schema(
  {
    chickensAge: { type: Number },
    category: { type: String },
    name: { type: String },
    description: { type: String },
    administrationMode: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
