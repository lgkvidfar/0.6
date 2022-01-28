import { v4 as uuidv4 } from 'uuid';
import { IUserDocument } from '@shared';
import { databaseClient } from './database';
import { mongo } from './config';

const collection = () => {
    return databaseClient.db(mongo.database).collection<IUserDocument>('users');
};

export const createUser = async (name: string, gitHubUserId: number) => {
    const user: IUserDocument = {
        id: uuidv4(),
        name,
        tokenVersion: 0,
        gitHubUserId: gitHubUserId.toString(),
    };

    const coll = collection();
    const result = await coll.insertOne(user);
    if (result.acknowledged) return user;
    throw new Error('IN CREATEUSER');
};

export const getUserByGitHubId = async (gitHubUserId: number) => {
    const coll = collection();
    return coll.findOne({ gitHubUserID: gitHubUserId.toString() });
};
