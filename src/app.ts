import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';

import { Env, createEnv } from './config/env';
import apiTimeOut from './middleware/apiTimeout.middleware';
import * as errorMiddleware from './middleware/error.middleware';
import authRouter from './modules/auth/auth.route';
import userRouter from './modules/user/user.route';
import { expressLogger, logger } from './utils';

const app: Application = express();

dotenv.config();

export const config: Env = createEnv(process.env);

if (!config) {
    logger.error('Error:Creating a environment config failed');
    throw new Error('Error:Creating a environment config failed.');
} else {
    logger.info('Environment successfully loaded.');
}

const corsOptions = {
    origin: config.CORS_HOSTS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressLogger);
app.use(apiTimeOut);

app.all('/api/status', (req: Request, res: Response) => {
    res.sendStatus(200);
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use(errorMiddleware.boomErrorHandler);
app.use(errorMiddleware.joiErrorHandler);
app.use(errorMiddleware.genericErrorHandler);

app.listen(config.BACKEND_PORT, () => {
    logger.info(`Starting server on PORT ${config.BACKEND_PORT}`);
    logger.info(
        `Server status: http://localhost:${config.BACKEND_PORT}/api/status`,
    );
});
