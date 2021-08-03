const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: String,
    displayName: String,
    roles: [String],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Role', roleSchema);
