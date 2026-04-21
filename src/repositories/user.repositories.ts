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

export {
    findUserRepositories,
    createUserRepositories
}