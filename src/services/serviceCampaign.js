const callApi = require('../utils/callApi');
const CustomError = require('../errors/CustomError');
const code = require('../errors/code');

const updateServiceCampaign = async ({
  campaignId,
  serviceUrl,
  detailCampaign,
  campaignType,
}) => {
  try {
    const options = {
      method: 'POST',
      url: `${serviceUrl}/webhooks`,
      data: { campaignId, detailCampaign, campaignType },
    };
    const response = await callApi(options);
    return response;
  } catch (error) {
    throw new CustomError(
      code.BAD_REQUEST,
      'update campaign info from failed sub service',
    );
  }
};

const getServiceCampaign = async (campaignId, serviceUrl) => {
  try {
    const options = {
      method: 'GET',
      url: `${serviceUrl}/campaigns/${campaignId}`,
    };
    const response = await callApi(options);
    return response;
  } catch (error) {
    throw new CustomError(
      code.BAD_REQUEST,
      'get campaign info from failed sub service',
    );
  }
};

const addParticipantCampaign = async (campaignId, userId, serviceUrl) => {
  try {
    const options = {
      method: 'POST',
      url: `${serviceUrl}/participants/${userId}`,
      headers: { 'campaign-id': campaignId },
    };
    const response = await callApi(options);
    return response;
  } catch (error) {
    throw new CustomError(
      code.BAD_REQUEST,
      'add participant into campaign from failed sub service',
    );
  }
};

module.exports = {
  updateServiceCampaign,
  getServiceCampaign,
  addParticipantCampaign,
};
