const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    name: String,
    desc: String,
    avatar: String,
    startTime: Date,
    endTime: Date,
    participants: [
      {
        _id: false,
        user: String,
        status: String,
      },
    ],
    status: String,
    campaignVisibility: String,
    collectDataSystem: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Campaign', campaignSchema);
