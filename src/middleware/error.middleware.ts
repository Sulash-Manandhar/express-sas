import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import { isEmpty } from '../utils';

interface BoomOutputErrorType {
    statusCode: number;
    headers: any;
    payload: {
        statusCode: number;
        error: string;
        message: string;
    };
}

export function boomErrorHandler(
    err: any,
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    const {
        isBoom,
        output,
        data,
    }: { isBoom: boolean | undefined; output: BoomOutputErrorType; data: any } =
        err;

    if (!isBoom) return next(err);
    if (!isEmpty(data)) {
        res.status(output.payload.statusCode).json({
            message: output.payload.message,
            error: data,
        });
    }
    res.status(output.payload.statusCode).json({
        message: output.payload.message,
        success: false,
    });
    return;
}

export function joiErrorHandler(
    error: any,
    _request: Request,
    res: Response,
    next: NextFunction,
) {
    if (!error.isJoi) return next(error);
    res.status(HttpStatus.BAD_REQUEST).json({
        message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
        error,
    });
    return;
}

export function genericErrorHandler(
    error: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
    });
    return;
}
