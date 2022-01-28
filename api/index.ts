import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { databaseClient } from './database';
import { getGitHubUser } from './github-adapter';

const app = express();
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.get('/', (req, res) => res.send('api is healthy'));
app.get('/github', async (req, res) => {
    const { code } = req.query;

    const gitHubUser = await getGitHubUser(code as string);
});

app.post('/refresh', async (req, res) => {});
app.post('/logout', (req, res) => {});
app.post('/logout.all', async (req, res) => {});

app.get('/me', async (req, res) => {});

const main = async () => {
    console.log('connecting to mongodb');
    await databaseClient.connect();
    console.log('connected to mongodb');
};
main();

const PORT = process.env.SERVER_AUTH_PORT || 3000;

app.listen(PORT, () => {
    console.log('auth server running on', PORT);
});
