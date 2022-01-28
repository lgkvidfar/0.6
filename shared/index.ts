export interface IBasicUser {
    id: string;
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
