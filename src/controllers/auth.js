import {
  registerUserService,
  loginUserService,
  refreshSessionService,
  logoutUserService,
  sendResetPasswordEmailService,
  resetPassword,
} from '../services/auth.js';

import createHttpError from 'http-errors';

// Şifre sıfırlama email gönder
export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    await sendResetPasswordEmailService(email);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Şifreyi sıfırla
export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await resetPassword(token, password);

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const registerController = async (req, res, next) => {
  try {
    const user = await registerUserService(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await loginUserService(
      email,
      password
    );

    // Set refresh token in cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await refreshSessionService(refreshToken);

    // Set new refresh token in cookies
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await logoutUserService(refreshToken);
    }

    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserController = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new createHttpError(404, 'User not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Current user fetched successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRoleController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const updatedUser = await updateUserRoleController(userId, role);

    res.status(200).json({
      status: 200,
      message: 'User role updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
