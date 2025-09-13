import createHttpError from 'http-errors';

import User from '../db/models/user.js';
import Session from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return next(createHttpError(401, 'Authorization header missing'));

  console.log(authHeader);

  const bearer = authHeader.split(' ')[0];
  if (bearer !== 'Bearer')
    return next(createHttpError(401, 'Invalid authorization header format'));
  const token = authHeader.split(' ')[1];
  if (!token)
    return next(createHttpError(401, 'Token missing in authorization header'));

  const session = await Session.findOne({ accessToken: token });
  if (!session) return next(createHttpError(401, 'Session not found'));

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (isAccessTokenExpired)
    return next(createHttpError(401, 'Access token expired'));

  const user = await User.findOne({ _id: session.userId });
  if (!user)
    return next(createHttpError(401, 'User not found for this session'));

  req.user = user;

  next();
};
