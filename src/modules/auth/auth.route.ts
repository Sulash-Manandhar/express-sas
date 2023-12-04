import { Router } from 'express';

import * as Controller from './auth.controller';
import * as Validator from './auth.validator';

const router = Router();

router.post('/register', Validator.registerValidator, Controller.register);
router.post('/login', Validator.loginValidator, Controller.login);
router.post(
    '/sent-verification-email',
    Validator.sentEmailValidator,
    Controller.verifyUserEmail,
);
router.patch(
    '/verify-user',
    Validator.verifyUserValidator,
    Controller.verifyUser,
);
router.post(
    '/sent-reset-password-email',
    Validator.sentEmailValidator,
    Controller.forgotPasswordEmail,
);
router.patch(
    '/reset-password',
    Validator.resetPasswordValidator,
    Controller.resetPassword,
);

export default router;
