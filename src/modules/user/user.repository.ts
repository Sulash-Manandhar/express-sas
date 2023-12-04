import db from '../../config/db.config';
import { PaginationType, UserUpdateData } from '../../types/schema';

export const findById = (id: string) => {
    return db.user.findFirst({
        where: {
            id,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
        },
    });
};

export const findAll = ({ page, limit }: PaginationType) => {
    return db.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
        },
        skip: page,
        take: limit,
    });
};

export const totalUserCount = () => {
    return db.user.count();
};

export const findByIdAndUpdate = (id: string, data: UserUpdateData) => {
    return db.user.update({
        where: {
            id,
        },
        data: {
            name: data.name,
        },
        select: {
            id: true,
            email: true,
            name: true,
            verified: true,
            role: true,
        },
    });
};

export const findByIdAndDelete = (id: string) => {
    return db.user.delete({
        where: {
            id,
        },
    });
};
