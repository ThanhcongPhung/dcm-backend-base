const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const campaignSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    image: String,
    startTime: Date,
    endTime: Date,
    participants: [
      {
        _id: false,
        user: { type: ObjectId, ref: 'User' },
        role: { type: ObjectId, ref: 'Role' },
        status: String,
      },
    ],
    campaignType: String,
    status: String,
    campaignVisibility: String,
    service: { type: ObjectId, ref: 'Service' },
    action: String,
    appId: String,
    botId: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Campaign', campaignSchema);
