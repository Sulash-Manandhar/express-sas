import Boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import { PaginationType, UserUpdateData } from '../../types/schema';
import { logger } from '../../utils';
import * as UserService from './user.service';

export const me = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userDetail = req.body?.user;
            if (!userDetail) {
                throw Boom.unauthorized();
            }
            res.status(HttpStatus.OK).json({
                message: 'User detail successfully fetched',
                success: true,
                data: userDetail,
            });
        } catch (error) {
            logger.error(`FAILED TO FETCH USER DETAILS, ${error} `);
            next(error);
        }
    },
);

export const getOne = expressAsyncHandler(
    async (
        req: Request<{ id: string }, {}, {}>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const data = await UserService.getUserDetail(req.params.id);
            res.status(HttpStatus.OK).json(data);
        } catch (error) {
            logger.error(`FAILED TO FETCH USER DETAILS LIST, ${error} `);
            next(error);
        }
    },
);

export const getAll = expressAsyncHandler(
    async (
        req: Request<{}, {}, PaginationType>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const data = await UserService.getUserList(req.body);
            res.status(HttpStatus.OK).json(data);
        } catch (error) {
            logger.error(`FAILED TO FETCH USER DETAILS LIST, ${error} `);
            next(error);
        }
    },
);

export const update = expressAsyncHandler(
    async (
        req: Request<{ id: string }, {}, UserUpdateData>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const data = await UserService.updateUser(req.params.id, req.body);
            res.status(HttpStatus.OK).json(data);
        } catch (error) {
            logger.error(`FAILED TO FETCH USER DETAILS LIST, ${error} `);
            next(error);
        }
    },
);

export const destroy = expressAsyncHandler(
    async (
        req: Request<{ id: string }, {}, {}>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const data = await UserService.deleteUser(req.params.id);
            res.status(HttpStatus.OK).json(data);
        } catch (error) {
            logger.error(`FAILED TO FETCH USER DETAILS LIST, ${error} `);
            next(error);
        }
    },
);
