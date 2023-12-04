import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import { logger } from '../../utils';
import { validateJOISchema } from '../../utils/validator';

const PASSWORD_REGREX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/i;

const registerUserJoiSchema = Joi.object({
    name: Joi.string().label('Name').min(3).max(30).required().messages({
        'string.empty': 'User name is required',
        'string.min': 'User name should be atleast 3 character long',
        'string.max': 'User name should not exceed more then 30 characters.',
    }),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .label('Email')
        .required()
        .messages({
            'string.empty': 'Email address is required',
        }),
    role: Joi.string().label('Role').optional().valid('customer', 'admin'),
    password: Joi.string()
        .label('Password')
        .regex(PASSWORD_REGREX)
        .required()
        .messages({
            'string.pattern.base':
                'Password must contain at least 8 characters including a capital letter, a symbol and a number',
            'string.empty': 'Password field is required',
        }),
    verified: Joi.binary().label('Verified').optional(),
});

export async function registerValidator(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    try {
        await validateJOISchema(req.body, registerUserJoiSchema);
        next();
    } catch (error) {
        logger.error('Validation failed.Error message below');
        logger.error(error);
        next(error);
    }
}

const loginUserJoiSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .label('Email')
        .required()
        .messages({
            'string.empty': 'Email address is required',
        }),
    password: Joi.string()
        .label('Password')
        .regex(PASSWORD_REGREX)
        .required()
        .messages({
            'string.pattern.base': 'Password do not match',
            'string.empty': 'Password do not match',
        }),
});

export function loginValidator(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    validateJOISchema(req.body, loginUserJoiSchema)
        .then(() => next())
        .catch((err) => next(err));
}

const sentLinkJoiSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .label('Email')
        .required()
        .messages({
            'string.empty': 'Email address is required',
        }),
});

export function sentEmailValidator(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    validateJOISchema(req.body, sentLinkJoiSchema)
        .then(() => next())
        .catch((err) => next(err));
}

const verifyUserSchema = Joi.object({
    id: Joi.string().label('Id').uuid().required(),
    token: Joi.string().label('Token').required(),
});

export function verifyUserValidator(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    validateJOISchema(req.body, verifyUserSchema)
        .then(() => next())
        .catch((err) => next(err));
}

const resetPasswordSchema = Joi.object({
    id: Joi.string().label('Id').uuid().required(),
    token: Joi.string().label('Token').required(),
    password: Joi.string()
        .label('Password')
        .regex(PASSWORD_REGREX)
        .required()
        .messages({
            'string.pattern.base':
                'Password must contain at least 8 characters including a capital letter, a symbol and a number',
            'string.empty': 'Password field is required',
        }),
});

export function resetPasswordValidator(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    validateJOISchema(req.body, resetPasswordSchema)
        .then(() => next())
        .catch((err) => next(err));
}
