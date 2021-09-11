const callApi = require('../utils/callApi');

const updateServiceCampaign = async ({
  campaignId,
  serviceUrl,
  detailCampaign,
  campaignType,
}) => {
  const options = {
    method: 'POST',
    url: `${serviceUrl}/campaigns`,
    data: { campaignId, detailCampaign, campaignType },
  };
  const response = await callApi(options);
  return response;
};

const getServiceCampaign = async (campaignId, serviceUrl) => {
  const options = {
    method: 'GET',
    url: `${serviceUrl}/campaigns/${campaignId}`,
  };
  const response = await callApi(options);
  return response;
};

module.exports = {
  updateServiceCampaign,
  getServiceCampaign,
};
