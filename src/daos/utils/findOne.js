const { ObjectId } = require('mongoose').Types;

const findOne = async (model, condition) => {
  if (ObjectId.isValid(condition)) {
    const document = await model.findById(condition).lean();
    return document;
  }

  if (typeof condition === 'object' && condition !== null) {
    const document = await model.findOne(condition).lean();
    return document;
  }

  throw new Error('Invalid query');
};

module.exports = { findOne };
