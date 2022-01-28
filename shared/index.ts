import { Document, ObjectId } from 'mongodb';

export interface IUserDocument {
    id: string;
    _id: ObjectId;
    name: string;
    tokenVersion: number;
    gitHubUserId: string;
}
export interface IAccessTokenPayload {
    userId: string;
}

export interface IRefreshTokenPayload {
    userId: string;
    version: number;
}

export enum Cookies {
    AccessToken = 'access',
    RefreshToken = 'refresh',
}
