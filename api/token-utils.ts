import {
    Cookies,
    IAccessTokenPayload,
    IRefreshTokenPayload,
    IBasicUser,
    IAccessToken,
    IRefreshToken,
} from '@shared';

import jwt from 'jsonwebtoken';

import { cookie, isProduction, secrets } from './config';
import { CookieOptions, Response } from 'express';

const accessTokenSecret = secrets.access_token;
const refreshTokenSecret = secrets.refresh_token;

enum TokenExpiration {
    Access = 5 * 60,
    Refresh = 7 * 24 * 60 * 60,
    RefreshIfLessThan = 4 * 24 * 60 * 60,
}

const signAccessToken = (payload: IAccessTokenPayload) => {
    const signed = jwt.sign(payload, accessTokenSecret, { expiresIn: TokenExpiration.Access });
    return signed;
};

const signRefreshToken = (payload: IRefreshTokenPayload) => {
    const signed = jwt.sign(payload, refreshTokenSecret, { expiresIn: TokenExpiration.Refresh });
    return signed;
};

export const buildTokens = (user: IBasicUser) => {
    const accessPayload: IAccessTokenPayload = { userId: user.id };
    const refreshPayload: IRefreshTokenPayload = { userId: user.id, version: user.tokenVersion };

    const accessToken = signAccessToken(accessPayload);
    const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

    return { accessToken, refreshToken };
};

const defaultCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    domain: cookie.base_domain,
    path: '/',
};

const accessTokenCookieOptions: CookieOptions = {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Access * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Refresh * 1000,
};

export const setTokens = (res: Response, access: string, refresh?: string) => {
    res.cookie(Cookies.AccessToken, access, accessTokenCookieOptions);
    if (refresh) {
        res.cookie(Cookies.RefreshToken, refresh, refreshTokenCookieOptions);
    }
};

export const verifyRefreshToken = (token: string) => {
    try {
        const result = jwt.verify(token, refreshTokenSecret) as IRefreshToken;
        return result;
    } catch (e) {
        console.log(e);
        throw 'cannot verify refreshtoken';
    }
};

export const verifyAccessToken = (token: string) => {
    try {
        const result = jwt.verify(token, accessTokenSecret) as IAccessToken;
        return result;
    } catch (e) {
        console.log(e);
        throw 'cannot verify accesstoken';
    }
};

export const refreshTokens = (current: IRefreshToken, tokenVersion: number) => {
    if (tokenVersion !== current.version) throw 'token revoked';

    const accessPayload: IAccessTokenPayload = { userId: current.userId };
    const accessToken = signAccessToken(accessPayload);

    let refreshPayload: IRefreshTokenPayload | undefined;
    const expiration = new Date(current.exp * 1000);
    const now = new Date();
    const expirationLessNow = expiration.getTime() - now.getTime();
    const secondsUntilExpiration = expirationLessNow / 1000;
    if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
        refreshPayload = { userId: current.userId, version: tokenVersion };
    }
    const refreshToken = refreshPayload && signRefreshToken(refreshPayload);
    return { accessToken, refreshToken };
};

export const clearTokens = (res: Response) => {
    res.cookie(Cookies.AccessToken, '', { ...defaultCookieOptions, maxAge: 0 });
    res.cookie(Cookies.RefreshToken, '', { ...defaultCookieOptions, maxAge: 0 });
};
