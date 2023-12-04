import { Router } from 'express';

import {
    adminProtection,
    generalProtection,
} from '../../middleware/authMiddleware';
import * as UserController from './user.controller';
import * as UserValidator from './user.validator';

const router = Router();

router.get('/', generalProtection, UserController.me);
router.get(
    '/list',
    adminProtection,
    UserValidator.userListValidator,
    UserController.getAll,
);
router.get('/:id', adminProtection, UserController.getOne);
router.put(
    '/:id',
    adminProtection,
    UserValidator.updateUserValidator,
    UserController.update,
);
router.delete('/:id', adminProtection, UserController.destroy);

export default router;
