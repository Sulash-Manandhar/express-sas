import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
    ForgotPasswordParams,
    LoginUserInterface,
    RegisterUserInterface,
    SentLinkType,
    ValidateUserParams,
} from '../../types/schema';
import { logger } from '../../utils';
import * as AuthService from './auth.service';

export const register = expressAsyncHandler(
    async (
        req: Request<{}, {}, RegisterUserInterface>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const data = await AuthService.register(req.body);
            logger.info(data.message);
            res.status(HttpStatus.CREATED).json(data);
        } catch (error) {
            logger.error(`FAILED TO REGISTER USER, ${error} `);
            next(error);
        }
    },
);

export const login = expressAsyncHandler(
    async (
        req: Request<{}, {}, LoginUserInterface>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const data = await AuthService.access(req.body);
            logger.info(data.message);
            res.status(HttpStatus.OK).json(data);
        } catch (error) {
            logger.error(`FAILED TO ACCESS USER, ${error} `);
            next(error);
        }
    },
);

export const verifyUserEmail = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await AuthService.sendVerifyUserLink(req.body);
            if (data) {
                logger.info(data.message);
                res.status(HttpStatus.OK).json(data);
            }
        } catch (error) {
            logger.error(`FAILED TO SENT USER VERIFICATION EMAIL, ${error} `);
            next(error);
        }
    },
);

export const verifyUser = expressAsyncHandler(
    async (
        req: Request<{}, {}, ValidateUserParams>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const data = await AuthService.updateUserVerification(req.body);
            logger.info(data.message);
            res.status(HttpStatus.OK).json(data);
        } catch (error) {
            logger.error(`FAILED TO VERIFY USER., ${error} `);
            next(error);
        }
    },
);

export const forgotPasswordEmail = expressAsyncHandler(
    async (
        req: Request<{}, {}, SentLinkType>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const data = await AuthService.sentForgotPasswordLink(req.body);
            res.status(HttpStatus.OK).json(data);
        } catch (error) {
            logger.error(`FAILED TO SENT FORGOTPASSWORD EMAIL, ${error} `);
            next(error);
        }
    },
);

export const resetPassword = expressAsyncHandler(
    async (
        req: Request<{}, {}, ForgotPasswordParams>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const data = await AuthService.updateForgotPassword(req.body);
            res.status(HttpStatus.OK).json(data);
        } catch (error) {
            logger.error(`FAILED TO RESET PASSWORD., ${error} `);
            next(error);
        }
    },
);
