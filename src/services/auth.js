const jwt = require('jsonwebtoken');
const redisClient = require('../utils/redis');
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const userDao = require('../daos/user');
const { JWT_SECRET_KEY, JWT_EXPIRES_TIME } = require('../configs');

const createUser = async (newUser) => {
  const { ssoUserId } = newUser;
  const userExist = await userDao.findUser({ ssoUserId });
  if (userExist) throw new Error('User exist');
  const user = await userDao.createUser(newUser);
  return user;
};

const saveAccessToken = async (data) => {
  const { accessToken } = data;
  if (!accessToken) throw new CustomError(errorCodes.UNAUTHORIZED);
  await redisClient.setAsync(
    `TOKEN_${accessToken}`,
    '1',
    'EX',
    JWT_EXPIRES_TIME,
  );
};
const logout = async (data) => {
  const { accessToken } = data;
  await redisClient.delAsync(`TOKEN_${accessToken}`);
};

const verifyAccessToken = async (accessToken) => {
  const data = await jwt.verify(accessToken, JWT_SECRET_KEY);
  const { ssoUserId } = data;
  const user = await userDao.findUser({ ssoUserId });
  if (!user) throw new CustomError(errorCodes.UNAUTHORIZED);
  return user;
};

module.exports = {
  verifyAccessToken,
  createUser,
  saveAccessToken,
  logout,
};
