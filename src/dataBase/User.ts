import {Schema, model, Document} from "mongoose";

export interface iUser extends Document {
    userName: string,
    telegramId: number,
    alertsCreated: number,
    createdAt: Date
}

const userSchema = new Schema<iUser>({
    userName: {
        type: String,
        required: true
    },
    telegramId: {
        type: Number,
        required: true,
        index: true,
        unique: true
    },
    alertsCreated: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = model<iUser>("User", userSchema);

export default User;
