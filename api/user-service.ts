import { IBasicUser } from '@shared';

import { v4 as uuidv4 } from 'uuid';
import UserModel from '../shared/models';

export const createUser = async (name: string, gitHubUserId: number) => {
    const user: IBasicUser = {
        id: uuidv4(),
        name,
        tokenVersion: 0,
        gitHubUserId: gitHubUserId.toString(),
    };

    const newUser = new UserModel({ ...user });
    await newUser.save();
    return newUser;
};

export const getUserById = async (id: string) => {
    const result = await UserModel.findOne({ id });
    return result;
};

export const getUserByGitHubId = async (gitHubUserId: number) => {
    const result = await UserModel.findOne({ gitHubUserID: gitHubUserId.toString() });
    return result;
};

export const increaseTokenVersion = async (userId: string) => {
    try {
        const result = await UserModel.findOneAndUpdate(
            { id: userId },
            { $inc: { tokenVersion: 1 } }
        );
        return result;
    } catch (e) {
        console.log(e);
        throw new Error('could not increase token version by one');
    }
};
