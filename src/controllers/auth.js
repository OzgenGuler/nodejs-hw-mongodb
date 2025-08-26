import {
  registerUserService,
  loginUserService,
  refreshSessionService,
  logoutUserService,
} from '../services/auth.js';
// import createHttpError from 'http-errors';

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
