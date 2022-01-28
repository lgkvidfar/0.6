import dotenv from 'dotenv';
dotenv.config();

export const gitHubClientID = process.env.GITHUB_CLIENT_ID;
export const gitHubClientSecret = process.env.GITHUB_CLIENT_SECRET;

export const mongo = {
    full_url: process.env.MONGODB_FULL_URL!,
    url: process.env.MONGODB_URL!,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    database: process.env.MONGODB_DATABASE,
};
