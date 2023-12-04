import Boom from '@hapi/boom';

import { config } from '../../app';
import {
    ForgotPasswordParams,
    LoginUserInterface,
    RegisterUserInterface,
    SentLinkType,
    ValidateUserParams,
} from '../../types/schema';
import {
    decodeValidationToken,
    decryptPassword,
    encryptPassword,
    generateValidationToken,
    logger,
    sendMail,
} from '../../utils';
import * as AuthRepo from './auth.repository';

export const register = async (payload: RegisterUserInterface) => {
    try {
        const hashedPassword = await encryptPassword(payload.password);
        const user = await AuthRepo.create({
            ...payload,
            password: hashedPassword,
            verified: payload.role === 'admin' ? true : false,
        });

        return {
            success: true,
            message: 'User has been successfully created.',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    } catch (error: any) {
        if (
            error?.code === 'P2002' &&
            error?.name === 'PrismaClientKnownRequestError' &&
            error?.meta?.target === 'User_email_key'
        ) {
            throw Boom.conflict('Email has already been registered.', {
                _original: payload,
                details: [
                    {
                        message: '"Email" has already been registered ',
                        path: ['email'],
                        type: 'email',
                        context: {
                            label: 'Email',
                            key: 'email',
                        },
                    },
                ],
            });
        }
        throw new Error();
    }
};

export const access = async (payload: LoginUserInterface) => {
    const user = await AuthRepo.findEmail(payload.email);

    if (!user) {
        throw Boom.notFound('Email is not registered.', {
            _original: payload,
            details: [
                {
                    message: '"Email" is not registered',
                    path: ['email'],
                    type: 'email',
                    context: {
                        label: 'Email',
                        key: 'email',
                    },
                },
            ],
        });
    }

    if (!(await decryptPassword(payload.password, user.password))) {
        throw Boom.badRequest('Password do not match', {
            _original: payload,
            details: [
                {
                    message: '"Password" do not match',
                    path: ['password'],
                    type: 'password',
                    context: {
                        label: 'Password',
                        key: 'password',
                    },
                },
            ],
        });
    }
    if (!user.verified) {
        throw Boom.forbidden('Email is not verified.', {
            _original: payload,
            details: [
                {
                    message: '"Email" is not verified',
                    path: ['email'],
                    type: 'email',
                    context: {
                        label: 'Email',
                        key: 'email',
                    },
                },
            ],
        });
    }

    return {
        success: true,
        message: 'User has been successfully logged in.',
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            access_token: generateValidationToken({
                id: user.id,
                email: user.email,
                role: user.role,
                type: 'access_token',
            }),
            refresh_token: generateValidationToken({
                id: user.id,
                email: user.email,
                role: user.role,
                type: 'refresh_token',
            }),
        },
    };
};

export const sendVerifyUserLink = async (payload: SentLinkType) => {
    try {
        const user = await AuthRepo.findEmail(payload.email);
        if (!user) {
            throw Boom.notFound('Email is not registered');
        }
        if (user.verified)
            return {
                success: true,
                message: 'User is already verified',
            };

        const link = `${config.FRONTEND_URL}/auth/verify-user?id=${
            user.id
        }&token=${generateValidationToken({
            id: user.id,
            email: user.email,
            role: user.role,
            type: 'verify_user_token',
        })}`;

        const mailOptions = {
            from: config.NODEMAILER_EMAIL,
            to: user.email,
            subject: 'Gaming Mafia - Verify Your Email Address',
            template: 'VerificationLink',
            context: {
                title: 'Verify your email address',
                link,
            },
        };

        const mailResponse = await sendMail(mailOptions);

        return mailResponse;
    } catch (err) {
        logger.error(`Failed to sent verification link to user`);
        logger.error(err);
    }
};

export const updateUserVerification = async (payload: ValidateUserParams) => {
    try {
        const { id, token } = payload;
        const user = await AuthRepo.findById(id);
        if (!user) {
            throw Boom.badData('Invalid user id');
        }
        if (user.verified) {
            return {
                success: true,
                message: 'User is already verified.',
            };
        }
        if (!token) {
            throw Boom.badData('Invalid token');
        }
        const decodeUser = await decodeValidationToken(
            token,
            'verify_user_token',
        );
        if (!decodeUser) throw Boom.badData('Invalid token');

        const updatedUser = await AuthRepo.updateVerification(user.id);
        if (!updatedUser) {
            throw Boom.internal();
        }

        return {
            success: true,
            message: 'User is now verified.',
        };
    } catch (err) {
        logger.error(err);
        throw err;
    }
};

export const sentForgotPasswordLink = async (payload: SentLinkType) => {
    try {
        const user = await AuthRepo.findEmail(payload.email);
        if (!user) {
            throw Boom.notFound('Email is not registered');
        }

        const link = `${config.FRONTEND_URL}/auth/forgot-password?id=${
            user.id
        }&token=${generateValidationToken({
            id: user.id,
            email: user.email,
            role: user.role,
            type: 'reset_password_token',
        })}`;

        const mailOptions = {
            from: config.NODEMAILER_EMAIL,
            to: user.email,
            subject: 'Gaming Mafia - Reset your password?',
            template: 'ForgotPassword',
            context: {
                title: 'Forgot Password?',
                link,
            },
        };
        const mailResponse = await sendMail(mailOptions);
        return mailResponse;
    } catch (err) {
        logger.error('FAILED TO SENT RESET PASSWORD EMAIL');
        throw err;
    }
};

export const updateForgotPassword = async (payload: ForgotPasswordParams) => {
    try {
        const { id, token, password } = payload;
        const user = await AuthRepo.findById(payload.id);
        if (!user) {
            throw Boom.badData('Invalid user Id');
        }

        const decodeUser = await decodeValidationToken(
            token,
            'reset_password_token',
        );
        if (!decodeUser) throw Boom.badData('Invalid token');

        const hashedPassword = await encryptPassword(password);

        const updatedUser = await AuthRepo.updateUserPassword(
            id,
            hashedPassword,
        );

        if (!updatedUser) {
            throw Boom.internal();
        }

        return {
            success: true,
            message: 'Password is successfully changed.',
        };
    } catch (err) {
        logger.error('FAILED TO RESET USER PASSWORD ');
        throw err;
    }
};
