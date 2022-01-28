import { IBasicUser } from '@shared';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import connectToMongoDB from './database';
import { getGitHubUser } from './github-adapter';
import { buildTokens, setTokens } from './token-utils';
import { createUser, getUserByGitHubId } from './user-service';

const app = express();
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.get('/', (req, res) => res.send('api is healthy'));
app.get('/github', async (req, res) => {
    const { code } = req.query;

    const gitHubUser = await getGitHubUser(code as string);
    const savedUser: IBasicUser | null = await getUserByGitHubId(gitHubUser.id);

    if (savedUser) {
        const { accessToken, refreshToken } = buildTokens(savedUser);
        setTokens(res, accessToken, refreshToken);

        res.redirect(`${process.env.CLIENT_URL}`);
    } else if (!savedUser) {
        const newUser = await createUser(gitHubUser.name, gitHubUser.id);
        const { accessToken, refreshToken } = buildTokens(newUser);
        setTokens(res, accessToken, refreshToken);

        res.redirect(`${process.env.CLIENT_URL}`);
    }
});

app.post('/refresh', async (req, res) => {});
app.post('/logout', (req, res) => {});
app.post('/logout.all', async (req, res) => {});

app.get('/me', async (req, res) => {});

const main = async () => {
    await connectToMongoDB();
    console.log('connected to mongodb');
    const PORT = process.env.SERVER_AUTH_PORT || 3000;

    app.listen(PORT, () => {
        console.log('auth server running on', PORT);
    });
};
main();
