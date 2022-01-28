import { IBasicUser } from '@shared';
import { model, Schema } from 'mongoose';

export const schema = new Schema<IBasicUser>(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        tokenVersion: { type: Number, required: true },
        gitHubUserId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default model<IBasicUser>('User', schema);
