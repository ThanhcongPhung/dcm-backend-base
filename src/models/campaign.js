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
        userId: { type: ObjectId, ref: 'User' },
        role: String,
        status: String,
      },
    ],
    campaignType: String,
    status: String,
    campaignVisibility: String,
    serviceId: { type: ObjectId, ref: 'Service' },
    actions: [String],
    appId: String,
    botId: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Campaign', campaignSchema);
