import cron from "node-cron";
import Alerts from "../../dataBase/Alerts.js";

import { sendExpiredAlertMessage, sendPassedMessage } from "../../chat/messages.js";
import { getAllBrapiPrice } from "../assets/acoes.service.js";
import { getAllCoinPrice } from "../assets/cripto.service.js";
import { getAllStockPrice } from "../assets/stock.service.js";

type PriceMap = {
    [key: string]: number | undefined
}

export const verifyAlerts = (): void => {
    cron.schedule('0 11,17,23 * * *', async (): Promise<void> => {
        console.log('--- Verificando alertas ---')

        const now = Date.now()

        try {
            //Limpando os alertas que já venceram e não atingiram a meta.
            try {
                const expiredAlerts = await Alerts.find({
                    validity: { $lt: now }
                })

                if (expiredAlerts.length > 0) {
                    for (let alert of expiredAlerts) {
                        await sendExpiredAlertMessage(alert.telegramId, alert.asset, alert.targetPrice);
                    }

                    const idsToDelete = expiredAlerts.map(alert => alert._id);
                    await Alerts.deleteMany({
                        _id: { $in: idsToDelete }
                    })

                    console.log(`${expiredAlerts.length} alertas expirados limpos.`)
                }
            } catch (err) {
                console.error('Error trying to clean expired alerts: ', err)
            }

            //Enviando os alertas para aqueles que atingiram a meta
            try {
                const getAllPrices = async (): Promise<PriceMap> => {
                    const [brapiPrices, coinsPrices, stockPrices] = await Promise.all([
                        getAllBrapiPrice(),
                        getAllCoinPrice(),
                        getAllStockPrice()
                    ])

                    return {
                        ...brapiPrices,
                        ...coinsPrices,
                        ...stockPrices
                    }
                }
                const allPrices = await getAllPrices()


                const allAlerts = await Alerts.find({
                    validity: { $gte: now }
                })

                for (let alert of allAlerts) {
                    const currentPrice = allPrices[alert.asset]

                    if (typeof currentPrice !== 'number') {
                        console.log(`Pulando ${alert.asset}: Preço indisponível no momento`)
                        continue
                    }

                    const passed = alert.isUpper
                        ? alert.targetPrice >= currentPrice
                        : alert.targetPrice <= currentPrice
                    
                    if(passed) await sendPassedMessage(alert.telegramId, alert.asset, alert.targetPrice)
                }

            } catch (err) {
                console.error('Error trying to send alert message: ', err)
            }


        } catch (err) {
            console.error('Error in expiration cron: ', err)
        }
    })
}