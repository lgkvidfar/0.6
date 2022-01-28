export interface IBasicUser {
    id: string;
    name: string;
    tokenVersion: number;
    gitHubUserId: string;
}
export interface IAccessTokenPayload {
    userId: string;
}

export interface IAccessToken extends IAccessTokenPayload {
    exp: number;
}

export interface IRefreshTokenPayload {
    userId: string;
    version: number;
}
export interface IRefreshToken extends IRefreshTokenPayload {
    exp: number;
}

export enum Cookies {
    AccessToken = 'access',
    RefreshToken = 'refresh',
}
