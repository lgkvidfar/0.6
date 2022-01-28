import axios from 'axios';
import { gitHubClientID, gitHubClientSecret } from './config';

interface IGitHubUser {
    id: number;
    name: string;
}

interface IAccessTokenResponse {
    access_token: string;
}

interface IUserResponse {
    id: number;
    name: string;
}

const TOKEN_URL = 'https://github.com/login/oauth/access_token';
const USER_URL = 'https://api.github.com/user';

export const getGitHubUser = async (code: string) => {
    const token = await getAccessToken(code);
    return getUser(token);
};

const getAccessToken = async (code: string) => {
    const response = await axios.post<IAccessTokenResponse>(
        TOKEN_URL,
        {
            client_id: gitHubClientID,
            client_secret: gitHubClientSecret,
            code,
        },
        {
            headers: { Accept: 'application/json' },
        }
    );
    return response.data.access_token;
};

const getUser = async (token: string) => {
    const response = await axios.get<IUserResponse>(USER_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as IGitHubUser;
};
