const indexService = require('../services');

const helloWorld = async (req, res) => {
  const { name } = req.query;
  const greetingMessage = indexService.helloWorld(name);
  return res.send({ status: 1, result: greetingMessage });
};

module.exports = { helloWorld };
