import { bot } from "./chatIndex.js"

const sendExpiredAlertMessage = async (telegramId: number, asset: string, targetPrice: number): Promise<void> => {
    const expiredAlertMesage = `Seu alerta para ${asset} com a marca de ${targetPrice} expirou.`

    await bot.telegram.sendMessage(telegramId, expiredAlertMesage, {
        reply_markup: {
            inline_keyboard: [
                [{ text: `Adicionar um novo alerta para ${asset}`, callback_data: `alert:${asset}` }]
            ]
        }
    })
}

const sendPassedMessage = async (telegramId: number, asset: string, targetPrice: number) => {
    const passedMesage = `<b>O ativo ${asset} acaba de atingir a marca ${targetPrice}!</b>`

    await bot.telegram.sendMessage(telegramId, passedMesage, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [{ text: `Adicionar um novo alerta para ${asset}`, callback_data: `alert:${asset}` }]
            ]
        }
    })
}

export {
    sendExpiredAlertMessage,
    sendPassedMessage
}