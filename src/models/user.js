const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    ssoUserId: String,
    roleId: { type: ObjectId, ref: 'Role' },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('User', userSchema);
