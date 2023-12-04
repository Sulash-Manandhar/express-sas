import Boom from '@hapi/boom';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

import { config } from '../app';
import { findById } from '../modules/auth/auth.repository';
import { UserEncodedRequestData } from '../types/schema';
import { logger } from './logger';

const EIGHT_HOUR = '8h';
const TWO_HOUR = '2h';
const THIRTY_MINUTES = 1800;

/**
 * @desc 120 === 2minutes, '6h' === 6 hours, '6d' === six days
 * @param {number} id
 * @param {string} email
 * @param {boolean} remember
 * @returns token
 */

interface GenerateTokenPayload {
    id: string;
    email: string;
    role: string;
    type: tokenType;
}
type tokenType =
    | 'access_token'
    | 'refresh_token'
    | 'verify_user_token'
    | 'reset_password_token';

export function generateValidationToken(payload: GenerateTokenPayload) {
    const tokenValue = {
        access_token: {
            value: config.ACCESS_TOKEN_SECRET,
            time: TWO_HOUR,
        },
        refresh_token: {
            value: config.REFRESH_TOKEN_SECRET,
            time: EIGHT_HOUR,
        },
        verify_user_token: {
            value: config.VERIFY_USER_SECRET,
            time: THIRTY_MINUTES,
        },
        reset_password_token: {
            value: config.RESET_PASSWORD_SECRET,
            time: THIRTY_MINUTES,
        },
    } as const;

    const { id, email, role, type } = payload;
    const secret = tokenValue[type];

    return jwt.sign({ id, email, role }, secret.value, {
        expiresIn: secret.time,
    });
}

export async function decodeValidationToken(
    token: string,
    tokenType: tokenType,
) {
    const tokenValue = {
        access_token: config.ACCESS_TOKEN_SECRET,
        refresh_token: config.REFRESH_TOKEN_SECRET,
        verify_user_token: config.VERIFY_USER_SECRET,
        reset_password_token: config.RESET_PASSWORD_SECRET,
    } as const;

    try {
        const decode: any = jwt.verify(token, tokenValue[tokenType]);
        const isUserValid = await findById(decode?.id);
        if (!isUserValid) {
            throw Boom.badRequest('Unauthorized, invalid token');
        }
        return {
            id: isUserValid.id,
            name: isUserValid.name,
            email: isUserValid.email,
            role: isUserValid.role,
        };
    } catch (err) {
        if (err instanceof JsonWebTokenError) {
            if (err.message === 'jwt malformed') {
                throw Boom.badData('Invalid JWT TOKEN');
            }
            if (err.message === 'jwt expired') {
                throw Boom.badData('Token is expired');
            }
        }
        logger.error(`FAILED TO DECODE JWT TOKEN ${err}`);
        throw Boom.internal();
    }
}
