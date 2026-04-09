import { Telegraf } from "telegraf"
import { getBtcPrice, getNvdaPrice, getPetr4Price } from "./services/prices.service.js"

const chatCommands = (bot: Telegraf) => {
    bot.start(ctx => {
        const startMessage = `
<b>Bem vindo ao Coins Bot!</b>

Selecione um ativo abaixo para verificar seu preço:
`

        ctx.telegram.sendMessage(ctx.from.id, startMessage, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[
                    { text: 'Bitcoin', callback_data: 'btc' },
                    // { text: 'Ethereum', callback_data: 'eth' },
                    // { text: 'Litecoin', callback_data: 'ltc' },
                    // { text: 'Solana', callback_data: 'sol' },
                    // { text: 'Shiba Inu', callback_data: 'shib' }
                ],
                [
                    { text: 'Nvidia', callback_data: 'nvda' },
                    // { text: 'Apple', callback_data: 'aapl' },
                    // { text: 'Tesla', callback_data: 'tsla' },
                    // { text: 'Dólar', callback_data: 'usd' },
                    // { text: 'S&P 500', callback_data: 'spx' }
                ],
                [
                    { text: 'Petrobras', callback_data: 'petr4' },
                    // { text: 'Vale', callback_data: 'vale3' },
                    // { text: 'Itaú', callback_data: 'itau4' },
                    // { text: 'Real', callback_data: 'brl' },
                    // { text: 'Ibovespa', callback_data: 'ibov' }
                ],
                ]
            }
        })
    })

    bot.help(ctx => {
        ctx.reply("Para ajuda, selecione um dos comandos abaixo:\n\n - /start : Para o início da conversa\n - /help : Para ter ajuda com os comandos")
    })

    bot.action('btc', async ctx => {
        await ctx.answerCbQuery()

        const btcPrice = await getBtcPrice()
        ctx.reply(`O preço do Bitcoin é: $ ${btcPrice} dólares`)
    })

    bot.action('nvda', async ctx => {
        await ctx.answerCbQuery()

        const nvdaPrice = await getNvdaPrice()
        ctx.reply(`O preço da Nvidia é: $ ${nvdaPrice} dólares`)
    })

    bot.action('petr4', async ctx => {
        await ctx.answerCbQuery()

        const petr4Price = await getPetr4Price()
        ctx.reply(`O preço da Petrobras é: R$ ${petr4Price} reais`)
    })

    bot.launch()
        .then(() => console.log('Bot started'))
        .catch((err: Error) => console.error('Failed to start bot:', err))
}


export { chatCommands }