const mongoose = require('mongoose');

const intentSchema = new mongoose.Schema(
  {
    name: String,
    displayName: String,
    intentId: String,
    campaignId: String,
    status: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Intent', intentSchema);
