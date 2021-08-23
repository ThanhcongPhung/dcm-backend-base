const asyncMiddleware = require('./async');
const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const campaignDao = require('../daos/campaign');

const getCampaign = async (req, res, next) => {
  const campaignId = req.headers['campaign-id'] || req.params.campaignId;
  const campaign = await campaignDao.findCampaign({ _id: campaignId });
  if (!campaign)
    throw new CustomError(codes.BAD_REQUEST, 'Campaign is not exists');
  req.campaign = campaign;
  return next();
};

module.exports = asyncMiddleware(getCampaign);
