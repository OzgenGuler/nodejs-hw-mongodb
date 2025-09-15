import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';
import { SMTP } from '../constant/index.js';
import sendMail from '../utils/sendMail.js';
import { env } from '../utils/env.js';
import { TEMPLATES_DIR } from '../constant/index.js';

export const sendResetPasswordEmailService = async (email) => {
  const user = await User.findOne({
    email,
  });
  if (!user) throw createHttpError(404, 'User not found');
  const resetToken = jwt.sign(
    {
      email: user.email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    }
  );

  const resetEmailTemplateSource = await fs.readFile(
    path.join(TEMPLATES_DIR, 'reset-password-email.html'),
    'utf-8'
  );

  if (!resetEmailTemplateSource)
    throw createHttpError(500, 'Email template not found');

  const resetEmailTemplate = handlebars.compile(resetEmailTemplateSource);
  const html = resetEmailTemplate({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  await sendMail({
    from: env(SMTP.SMTP_FROM),
    to: user.email,
    subject: 'Reset your password',
    html,
    text: `Hello ${user.name},\n\nPlease reset your password by clicking the link: ${env('APP_DOMAIN')}/reset-password?token=${resetToken}\n\nThis link will expire in 5 minutes.\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nYour Company`,
  })
    .then((mail) => {
      console.log('Sending mail log:', mail);
    })
    .catch((error) => {
      console.error('Error sending mail:', error);
      throw createHttpError(500, 'Failed to send reset email');
    });
};

// Şifreyi sıfırla
export const resetPassword = async (token, password) => {
  try {
    // JWT token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    if (!password) {
      throw createHttpError(400, 'New password is required.');
    }
    console.log('Hashing password for user :', email);

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 5);

    // Şifreyi güncelle
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    // Kullanıcının tüm oturumlarını sil
    await Session.deleteMany({ userId: user._id });

    return true;
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }
};

const generateTokens = () => {
  return {
    accessToken: crypto.randomBytes(64).toString('hex'),
    refreshToken: crypto.randomBytes(64).toString('hex'),
  };
};

export const registerUserService = async (userData) => {
  const { email, password, name } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

// Login user
export const loginUserService = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid credentials');
  }

  // Delete existing session
  await Session.deleteMany({ userId: user._id });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens();

  // Create session
  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  return { accessToken, refreshToken };
};

// Refresh session
export const refreshSessionService = async (refreshToken) => {
  // Find session
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // Check if refresh token is still valid
  if (new Date() > session.refreshTokenValidUntil) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Refresh token expired');
  }

  // Delete old session
  await Session.deleteOne({ _id: session._id });

  // Generate new tokens
  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    generateTokens();

  // Create new session
  const newSession = await Session.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// Logout user
export const logoutUserService = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (session) {
    await Session.deleteOne({ _id: session._id });
  }
};

// Find session by access token
export const findSessionByAccessToken = async (accessToken) => {
  const session = await Session.findOne({ accessToken }).populate('userId');

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.accessTokenValidUntil) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Access token expired');
  }

  return session;
};
