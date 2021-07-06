const authService = require('../services/auth');
const { SSO_EVENT } = require('../constants/params');

const actionWebhookSso = async (req, res) => {
  const { event, data } = req.body;
  let result;
  switch (event) {
    case SSO_EVENT.CREATE_USER:
      result = await authService.createUser(data);
      break;
    case SSO_EVENT.SET_TOKEN:
      result = await authService.saveAccessToken(data);
      break;
    case SSO_EVENT.LOGOUT:
      result = await authService.logout(data);
      break;
    default:
      break;
  }
  return res.send({ status: 1, result });
};

async function verifyToken(req, res) {
  const { user } = req;
  if (req.adminId) {
    return res.send({
      status: 1,
      result: { isAdmin: true, ...user },
    });
  }
  return res.send({ status: 1, result: { ...user } });
}
module.exports = {
  actionWebhookSso,
  verifyToken,
};
