import { Router } from 'express';

import { validateBody } from '../middlewares/validateBody.js';
import {
  sendResetEmailSchema,
  resetPasswordSchema,
} from '../validation/authSchemas.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const authRouter = Router();
authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.post('/refresh', refreshController);
authRouter.post('/logout', logoutController);
authRouter.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  sendResetEmailController
);
authRouter.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  resetPasswordController
);

export default authRouter;
