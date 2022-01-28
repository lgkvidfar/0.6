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

export const getUserByGitHubId = async (gitHubUserId: number) => {
    const result = await UserModel.findOne({ gitHubUserID: gitHubUserId.toString() });
    return result;
};
