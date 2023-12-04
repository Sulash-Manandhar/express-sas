import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { UserUpdateData } from '../../types/schema';
import { logger, validateJOISchema } from '../../utils';

const updateUserSchema = Joi.object({
    name: Joi.string().label('Name').min(3).max(30).required().messages({
        'string.empty': 'User name is required',
        'string.min': 'User name should be atleast 3 character long',
        'string.max': 'User name should not exceed more then 30 characters.',
    }),
});

export async function updateUserValidator(
    req: Request<{ id: string }, {}, UserUpdateData>,
    _res: Response,
    next: NextFunction,
) {
    try {
        await validateJOISchema(req.body, updateUserSchema);
        next();
    } catch (error) {
        logger.error('Validation failed.Error message below');
        logger.error(error);
        next(error);
    }
}

const paginationSchema = Joi.object({
    page: Joi.number().label('Page').min(1).optional().default(1),
    limit: Joi.number().label('Limit').min(1).optional().default(15),
});

export async function userListValidator(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    try {
        await validateJOISchema(req.body, paginationSchema);
        next();
    } catch (error) {
        logger.error('Validation failed of userlist.');
        next(error);
    }
}
