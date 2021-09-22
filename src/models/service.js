const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const serviceSchema = new mongoose.Schema(
  {
    name: String,
    campaignTypes: [String],
    url: String,
    inputs: [String],
    actions: [String],
    managers: [{ type: ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Service', serviceSchema);
