import { Types } from "mongoose";
import Alerts, { iAlert } from "../dataBase/Alerts.js";
import User, { iUser } from "../dataBase/User.js";

const findUserRepositories = async (telegramId?: number, userId?: number): Promise<iUser | null> => {
    if (telegramId) {
        return await User.findOne({ telegramId: telegramId })
    }
    if (userId) {
        return await User.findById(userId)
    }
    return null
}

const createUserRepositories = async (telegramId: number, fullName: string): Promise<iUser | null> => User.create({ telegramId, userName: fullName })

const createAlertRepositories = async (asset: string, value: number, telegramId: number, user: Types.ObjectId, validity: Date): Promise<iAlert | null> => Alerts.create({user, telegramId, asset, value, validity})

export {
    findUserRepositories,
    createUserRepositories,
    createAlertRepositories
}