const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const serviceSchema = new mongoose.Schema(
  {
    name: String,
    campaignTypes: [String],
    url: String,
    inputs: [String],
    actions: [String],
    owner: [
      {
        user: { type: ObjectId, ref: 'User' },
        role: { type: ObjectId, ref: 'Role' },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Service', serviceSchema);
