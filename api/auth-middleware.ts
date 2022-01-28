import { NextFunction, Request, Response } from 'express';
import { Cookies } from '@shared';

import { verifyAccessToken } from './token-utils';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = verifyAccessToken(req.cookies[Cookies.AccessToken]);
    if (!token) {
        res.status(401);
        return next(new Error('not signed in'));
    }
    res.locals.token = token;
    next();
};
