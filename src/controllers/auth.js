import {
  registerUserService,
  loginUserService,
  refreshSessionService,
  logoutUserService,
  // sendResetEmailService,
  resetPasswordService,
} from '../services/auth.js';

import createHttpError from 'http-errors';
import { sendEmail } from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
// import * as authServices from '../services/auth.js';
// import { ROLES } from '../constant/index.js';

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
    await sendEmail(
      email,
      'Reset your password',
      `<p>Şifrenizi sıfırlamak için linke tıklayın: <a href="${resetLink}">${resetLink}</a></p>`
    );
    res.status(200).json({
      status: 200,
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await resetPasswordService(token, password);
    res.status(200).json({
      status: 200,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const registerController = async (req, res, next) => {
  //   try {
  //     const user = await registerUserService(req.body);
  //     res.status(201).json({
  //       status: 201,
  //       message: 'Successfully registered a user!',
  //       data: {
  //         _id: user._id,
  //         name: user.name,
  //         email: user.email,
  //         createdAt: user.createdAt,
  //       },
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
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
  //   try {
  //     const { accessToken, refreshToken } = await loginUserService(req.body);
  //     res.cookie('refreshToken', refreshToken, {
  //       httpOnly: true,
  //       expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  //       secure: process.env.NODE_ENV === 'production',
  //     });
  //     res.status(200).json({
  //       status: 'success',
  //       message: 'Login successful',
  //       date: {
  //         accessToken,
  //       },
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
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
  //   try {
  //     const { refreshToken } = req.cookies;
  //     if (!refreshToken) {
  //       throw new createHttpError(401, 'Refresh token missing');
  //     }

  //     const { accessToken, newRefreshToken } =
  //       await refreshSessionService(refreshToken);
  //     res.cookie('refreshToken', newRefreshToken, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  //     });
  //     res.status(200).json({
  //       status: 'success',
  //       message: 'Successfully refreshed a session!',
  //       data: {
  //         accessToken,
  //       },
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
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
  //   try {
  //     const { refreshToken } = req.cookies;
  //     if (!refreshToken) {
  //       throw new createHttpError(401, 'Refresh token missing');
  //     }
  //     await logoutUserService(refreshToken);
  //     res.clearCookie('refreshToken', {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //     });
  //     res.status(204).end();
  //   } catch (error) {
  //     next(error);
  //   }
  // };

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

    // if (!Object.values(ROLES).includes(role)) {
    //   throw new createHttpError(400, 'Invalid role');
    // }

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
