import jwt from 'jsonwebtoken';

import { IAccessTokenPayload, IRefreshTokenPayload, IUserDocument } from '@shared';
import { secrets } from './config';

const accessTokenSecret = secrets.access_token;
const refreshTokenSecret = secrets.refresh_token;

enum TokenExpiration {
    Access = 5 * 60,
    Refresh = 7 * 24 * 60 * 60,
}

const signAccessToken = (payload: IAccessTokenPayload) => {
    const signed = jwt.sign(payload, accessTokenSecret, { expiresIn: TokenExpiration.Access });
    return signed;
};

const signRefreshToken = (payload: IRefreshTokenPayload) => {
    const signed = jwt.sign(payload, refreshTokenSecret, { expiresIn: TokenExpiration.Refresh });
    return signed;
};

export const buildTokens = (user: IUserDocument) => {
    const accessPayload: IAccessTokenPayload = { userId: user.id };
    const refreshPayload: IRefreshTokenPayload = { userId: user.id, version: user.tokenVersion };

    const accessToken = signAccessToken(accessPayload);
    const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

    return { accessToken, refreshToken };
};
