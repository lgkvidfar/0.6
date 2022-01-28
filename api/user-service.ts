import { IBasicUser } from '@shared';

import { v4 as uuidv4 } from 'uuid';
import UserModel from '../shared/models';
import { mongo } from './config';

export const createUser = async (name: string, gitHubUserId: number) => {
    const user: IBasicUser = {
        id: uuidv4(),
        name,
        tokenVersion: 0,
        gitHubUserId: gitHubUserId.toString(),
    };

    const newUser = new UserModel({ ...user });
    const result = await newUser.save();
    if (result) return user;
    throw new Error('IN CREATEUSER');
};

export const getUserByGitHubId = async (gitHubUserId: number) => {
    let result = UserModel.findOne({ gitHubUserID: gitHubUserId.toString() });
    return result;
};
