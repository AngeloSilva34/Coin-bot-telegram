import { createUserRepositories, findUserRepositories } from "../../repositories/user.repositories.js"

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

export { createUserService }