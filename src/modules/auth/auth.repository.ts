import db from '../../config/db.config';
import { RegisterUserInterface } from '../../types/schema';

export const create = (payload: RegisterUserInterface) => {
    return db.user.create({
        data: payload,
        select: {
            id: true,
            email: true,
            name: true,
            verified: true,
            role: true,
        },
    });
};

export const findEmail = (email: string) => {
    return db.user.findFirst({ where: { email } });
};

export const findById = (id: string) => {
    return db.user.findFirst({
        where: {
            id: id,
        },
    });
};

export const updateVerification = (id: string, verified: boolean = true) => {
    return db.user.update({
        where: {
            id,
        },
        data: {
            verified,
        },
    });
};

export const updateUserPassword = (id: string, password: string) => {
    return db.user.update({
        where: {
            id,
        },
        data: {
            password,
        },
    });
};
