// const callApi = require('../utils/callApi');

const updateServiceCampaign = () => {
  // const options = {
  //   method: 'POST',
  //   url: `${serviceExist.url}/campaigns`,
  //   params: {
  //     campaignInfo: detailCampaign,
  //     campaignId,
  //   },
  // };
  // const response = await callApi(options);
  // return response;
  return {
    status: 1,
  };
};
const getServiceCampaign = () => {
  // const options = {
  //   method: 'GET',
  //   url: `${serviceExist.url}/campaigns/${campaignId}`,
  // };
  // const response = await callApi(options);
  // return response;
  return {
    status: 1,
    result: {
      usecases: [
        {
          id: '6112358d5e1f033538712dcfaa',
          name: 'kich ban 1',
          intents: [
            {
              id: '6112358d5e1f033538712dcf',
              displayName: 'Hỏi tuổi',
              name: 'hoi_tuoi',
            },
            {
              id: '6112358d5e1f033538712dd1',
              displayName: 'Khen',
              name: 'khen',
            },
          ],
        },
      ],
      intents: [
        {
          id: '6112358d5e1f033538712dcf',
          displayName: 'Hỏi tuổi',
          name: 'hoi_tuoi',
        },
        {
          id: '6112358d5e1f033538712dd1',
          displayName: 'Khen',
          name: 'khen',
        },
      ],
    },
  };
};

module.exports = {
  updateServiceCampaign,
  getServiceCampaign,
};
