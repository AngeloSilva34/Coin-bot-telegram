import { createUserRepositories, findUserRepositories } from "../../repositories/user.repositories.js"
import { createAlertRepositories, findAlertRepositories } from "../../repositories/alert.repositories.js"

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

const createAlertService = async (asset: string, price: number, telegramId: number, days: number): Promise<string | undefined> => {
    const validity = new Date()
    validity.setDate(validity.getDate() + days)

    try {
        const user = await findUserRepositories(telegramId)
        if (!user) {
            return 'Algo deu errado, tente selecionar /start novamente'
        }
        const userId = user._id

        const alert = await findAlertRepositories(telegramId, asset)

        if(alert && alert.length >= 2) {
            return 'Você só pode criar 2 alertar para cada ativo.'
        }

        await createAlertRepositories(asset, price, telegramId, userId, validity)
        return 'Alerta criado com sucesso'

    } catch (err) {
        console.error("Error trying to save alert price", err)
    }
}


export {
    createUserService,
    createAlertService
}