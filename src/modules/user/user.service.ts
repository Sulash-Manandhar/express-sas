import Boom from '@hapi/boom';

import { PaginationType, UserUpdateData } from '../../types/schema';
import { generatePageList, logger } from '../../utils';
import * as UserRepo from './user.repository';

export const getUserDetail = async (id: string) => {
    try {
        const user = await UserRepo.findById(id);
        if (!user) {
            logger.error(`USER WITH ID ${id} NOT FOUND`);
            throw Boom.badRequest('Invalid user id');
        }

        return {
            message: 'Successfully fetched user detail',
            data: user,
            success: true,
        };
    } catch (error) {
        logger.error(`FAILED TO FETCH USER DETAIL. ${error}`);
        throw error;
    }
};

export const getUserList = async (payload: PaginationType) => {
    const { page = 1, limit = 15 } = payload;
    try {
        const list = await UserRepo.findAll({
            page,
            limit,
        });
        const totalCount = await UserRepo.totalUserCount();
        const meta = generatePageList({
            total: totalCount,
            page: 1,
            limit: 15,
        });
        return {
            message: 'Successfully fetched user list',
            success: true,
            data: {
                meta,
                list,
            },
        };
    } catch (error) {
        logger.error('FAILED TO FETCH  USER LIST');
        throw error;
    }
};
export const updateUser = async (id: string, payload: UserUpdateData) => {
    try {
        const user = await UserRepo.findById(id);
        if (!user) {
            throw Boom.badRequest();
        }
        const updatedUserDetail = await UserRepo.findByIdAndUpdate(id, payload);

        return {
            success: true,
            message: 'Successfully updated user detail',
            data: updatedUserDetail,
        };
    } catch (error) {
        logger.error(`FAILED TO UPDATE USER DETAIL ${error}}`);
        throw error;
    }
};

export const deleteUser = async (id: string) => {
    try {
        const user = await UserRepo.findById(id);
        if (!user) {
            logger.error(`USER WITH ID ${id} NOT FOUND`);
            throw Boom.badRequest('Invalid user id');
        }
        const response = await UserRepo.findByIdAndDelete(id);
        return {
            message: 'Successfully deleted a user',
            success: true,
        };
    } catch (error) {
        logger.error(`FAILED TO DELETE USER ${error}`);
        throw error;
    }
};
