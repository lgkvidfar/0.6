import { ObjectId } from 'mongodb';

export interface IUserDocument {
    id: string;
    name: string;
    tokenVersion: number;
    gitHubUserId: string;
}

export type IMongoUser = IUserDocumentMongo | null;

export interface IUserDocumentMongo {
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
