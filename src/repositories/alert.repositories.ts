import { Types } from "mongoose";
import Alerts, { iAlert } from "../dataBase/Alerts.js";

const createAlertRepositories = async (asset: string, value: number, telegramId: number, user: Types.ObjectId, validity: Date): Promise<iAlert | null> => Alerts.create({ user, telegramId, asset, value, validity })

const findAlertRepositories = async (telegramId: number, asset?: string): Promise<iAlert[] > => {
    if (asset) {
        return Alerts.find({ telegramId, asset })
    }

    return Alerts.find({ telegramId })
}

export {
    createAlertRepositories,
    findAlertRepositories
}