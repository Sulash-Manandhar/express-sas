import Boom from '@hapi/boom';
import nodemailer from 'nodemailer';
import nodemailerExpressHandlebars from 'nodemailer-express-handlebars';
import Mail from 'nodemailer/lib/mailer';
import path from 'path';

import { config } from '../app';
import { logger } from './logger';

const viewsPath = path.join(__dirname, '../../views');

const handlebarsOptions = {
    viewEngine: {
        extName: '.handlebars',
        partialsDir: path.join(viewsPath, 'partials'),
        layoutsDir: path.join(viewsPath, 'layouts'),
        defaultLayout: 'main',
    },
    viewPath: viewsPath,
};

export async function sendMail(mailOptions: Mail.Options) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.NODEMAILER_EMAIL,
            pass: config.NODEMAILER_PASS,
        },
        secure: true,
        tls: {
            rejectUnauthorized: false,
        },
    });

    const compiledtransporter = transporter.use(
        'compile',
        nodemailerExpressHandlebars(handlebarsOptions),
    );
    try {
        const info = await compiledtransporter.sendMail(mailOptions);
        logger.info(`Mail response ${info.response}`);
        return {
            success: true,
            message: 'Password reset link sent to user',
        };
    } catch (error) {
        logger.error(`MAILERROR ${error}`);
        throw Boom.internal('FAILED TO SENT OUT MAIL');
    }
}
