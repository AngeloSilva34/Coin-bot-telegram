import { createUserRepositories, findUserRepositories, createAlertRepositories } from "../../repositories/user.repositories.js"

const createUserService = async (telegramId: number, fullName: string): Promise<void> => {
    try {
        const user = await findUserRepositories(telegramId)
        if (!user) {
            await createUserRepositories(telegramId, fullName)
        }
        return
    } catch (err) {
        console.error("Error creating user:", err)
    }
}

const createAlertService = async (assert: string, rawText: string, telegramId: number) => {
    const formatedPrice = rawText.replace(",", ".")
    const price = Number(formatedPrice)

    if (isNaN(price) || !isFinite(price) || price <= 0) {
        return false
    }

    const validity = new Date()
    validity.setDate(validity.getDate() + 30)

    try {
        const user = await findUserRepositories(telegramId)
        if (!user) {
            return false
        }
        const userId = user._id

        await createAlertRepositories(assert, price, telegramId, userId, validity)
        return true

    } catch (err) {
        console.error("Error trying to save alert price", err)
    }
}


export {
    createUserService,
    createAlertService
}