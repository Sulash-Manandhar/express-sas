import Boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import { decodeValidationToken, logger } from '../utils';

export const generalProtection = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            try {
                token = req.headers.authorization.split(' ')[1];
                if (!token)
                    throw Boom.unauthorized('Unauthorized, invalid token');
                const decodeUser = await decodeValidationToken(
                    token,
                    'access_token',
                );
                if (!decodeUser)
                    throw Boom.unauthorized('Unauthorized, invalid token');

                req.user = {
                    id: decodeUser.id,
                    name: decodeUser.name,
                    email: decodeUser.email,
                    role: decodeUser.role,
                };

                next();
            } catch (error) {
                logger.error(`Failed to authenticate user ${error}}`);
                throw Boom.unauthorized('Unauthorized, Token is expired');
            }
        }
        if (!token) {
            logger.error('Not Authorized, no token.');
            throw Boom.unauthorized('Unauthorized, no token');
        }
    },
);
export const adminProtection = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            try {
                token = req.headers.authorization.split(' ')[1];
                if (!token)
                    throw Boom.unauthorized('Unauthorized, invalid token');
                const decodeUser = await decodeValidationToken(
                    token,
                    'access_token',
                );
                if (!decodeUser)
                    throw Boom.unauthorized('Unauthorized, invalid token');

                if (decodeUser.role !== 'admin') {
                    throw Boom.forbidden();
                }
                req.user = {
                    id: decodeUser.id,
                    name: decodeUser.name,
                    email: decodeUser.email,
                    role: decodeUser.role,
                };
                next();
            } catch (error) {
                logger.error(`Failed to authenticate user ${error}`);
                throw Boom.unauthorized('Unauthorized');
            }
        }
        if (!token) {
            logger.error('Not Authorized, no token.');
            throw Boom.unauthorized('Unauthorized, no token');
        }
    },
);
