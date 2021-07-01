const camelCaseKeys = require('camelcase-keys');

const camelCaseReq = (req, res, next) => {
  const notTransformApis = [];
  const reqSignature = `${req.method} - ${req.originalUrl}`;
  const allowTransform = !notTransformApis.includes(reqSignature);

  if (allowTransform) {
    req.query = camelCaseKeys(req.query, { deep: true });
    req.body = camelCaseKeys(req.body, { deep: true });
  }
  next();
};

module.exports = camelCaseReq;
