const moment = require('moment');
const Service = require('../models/service');
const Campaign = require('../models/campaign');
const User = require('../models/user');
const { CAMPAIGN_STATUS } = require('../constants');

const getOverview = async ({ dates }) => {
  const advanceSearch = {};
  if (dates && dates.startDate && dates.endDate) {
    const startDate = moment(dates.startDate).toDate();
    const endDate = moment(dates.endDate).toDate();
    advanceSearch.createdAt = { $gt: startDate, $lt: endDate };
  }
  const campaigns = await Campaign.find(advanceSearch);
  const services = await Service.find(advanceSearch);
  const users = await User.find(advanceSearch);

  const overviewResult = {
    serviceNumber: services.length,
    userNumber: users.length,
    campaignNumber: campaigns.length,
    waitingCampaignNumber: campaigns.filter(
      (item) => item.status === CAMPAIGN_STATUS.WAITING,
    ).length,
    runningCampaignNumber: campaigns.filter(
      (item) => item.status === CAMPAIGN_STATUS.RUNNING,
    ).length,
    draftCampaignNumber: campaigns.filter(
      (item) => item.status === CAMPAIGN_STATUS.DRAFT,
    ).length,
    pauseCampaignNumber: campaigns.filter(
      (item) => item.status === CAMPAIGN_STATUS.PAUSE,
    ).length,
    endCampaignNumber: campaigns.filter(
      (item) => item.status === CAMPAIGN_STATUS.END,
    ).length,
  };
  return overviewResult;
};

module.exports = { getOverview };
