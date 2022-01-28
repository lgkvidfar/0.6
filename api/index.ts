import { Cookies, IBasicUser } from '@shared';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { authMiddleware } from './auth-middleware';
import connectToMongoDB from './database';
import { getGitHubUser } from './github-adapter';
import {
    buildTokens,
    clearTokens,
    refreshTokens,
    setTokens,
    verifyRefreshToken,
} from './token-utils';
import { createUser, getUserByGitHubId, getUserById, increaseTokenVersion } from './user-service';

const app = express();
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.get('/', (req, res) => res.send('api is healthy'));
app.get('/github', async (req, res) => {
    try {
        const { code } = req.query;
        const gitHubUser = await getGitHubUser(code as string);
        const savedUser: IBasicUser | null = await getUserByGitHubId(gitHubUser.id);

        if (savedUser) {
            const { accessToken, refreshToken } = buildTokens(savedUser);
            setTokens(res, accessToken, refreshToken);

            res.redirect(`${process.env.CLIENT_URL}/me`);
        } else if (!savedUser) {
            const newUser = await createUser(gitHubUser.name, gitHubUser.id);
            const { accessToken, refreshToken } = buildTokens(newUser);

            setTokens(res, accessToken, refreshToken);

            res.redirect(`${process.env.CLIENT_URL}/me`);
        }
    } catch (e) {
        console.log(e);
    }
    res.end();
});

app.post('/refresh', async (req, res) => {
    try {
        const current = verifyRefreshToken(req.cookies(Cookies.RefreshToken));
        const user = await getUserById(current.userId);
        if (!user) throw 'user not found in /refresh';

        const { accessToken, refreshToken } = refreshTokens(current, user.tokenVersion);
        setTokens(res, accessToken, refreshToken);
    } catch (e) {
        console.log('error in post(refresh)', e);
        clearTokens(res);
    }
    res.end();
});
app.post('/logout', authMiddleware, (req, res) => {
    clearTokens(res);
    res.end();
});
app.post('/logout-all', authMiddleware, async (req, res) => {
    await increaseTokenVersion(res.locals.token.userId);
    clearTokens(res);
    res.end();
});

app.get('/me', authMiddleware, async (req, res) => {
    const user = await getUserById(res.locals.token.userId);
    res.json(user);
});

const main = async () => {
    await connectToMongoDB();
    console.log('connected to mongodb');
    const PORT = process.env.SERVER_AUTH_PORT || 3000;

    app.listen(PORT, () => {
        console.log('auth server running on', PORT);
    });
};
main();
