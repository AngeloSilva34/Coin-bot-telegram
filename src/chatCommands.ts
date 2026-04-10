import { Telegraf } from "telegraf"
import { getBtcPrice, getEthPrice, getLtcPrice, getSolPrice, getShibPrice } from "./services/cripto.service.js"
import { getNvdaPrice, getAaplPrice, getTslaPrice } from "./services/stock.service.js"
import { getPetr4Price, getVale3Price, getItau4Price, getSelicRate, getIbovPoints, getUsdPrice, getSpxPrice } from "./services/acoes.service.js"

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
                    { text: 'Ethereum', callback_data: 'eth' },
                    { text: 'Litecoin', callback_data: 'ltc' },
                    { text: 'Solana', callback_data: 'sol' },
                    { text: 'Shiba Inu', callback_data: 'shib' }
                ],
                [
                    { text: 'Nvidia', callback_data: 'nvda' },
                    { text: 'Apple', callback_data: 'aapl' },
                    { text: 'Tesla', callback_data: 'tsla' },
                    { text: 'Dólar', callback_data: 'usd' },
                    { text: 'S&P 500', callback_data: 'spx' }
                ],
                [
                    { text: 'Petrobras', callback_data: 'petr4' },
                    { text: 'Vale', callback_data: 'vale3' },
                    { text: 'Itaú', callback_data: 'itau4' },
                    { text: 'Selic', callback_data: 'selic' },
                    { text: 'Ibovespa', callback_data: 'ibov' }
                ],
                ]
            }
        })
    })

    bot.help(ctx => {
        ctx.reply("Para ajuda, selecione um dos comandos abaixo:\n\n - /start : Para o início da conversa\n - /help : Para ter ajuda com os comandos")
    })

    //Cripto moedas

    bot.action('btc', async ctx => {
        await ctx.answerCbQuery()

        const btcPrice = await getBtcPrice()
        ctx.reply(`O preço do Bitcoin é: $ ${btcPrice} dólares`)
    })

    bot.action('eth', async ctx => {
        await ctx.answerCbQuery()

        const ethPrice = await getEthPrice()
        ctx.reply(`O preço do Ethereum é: $ ${ethPrice} dólares`)
    })

    bot.action('ltc', async ctx => {
        await ctx.answerCbQuery()

        const ltcPrice = await getLtcPrice()
        ctx.reply(`O preço do Litecoin é: $ ${ltcPrice} dólares`)
    })

    bot.action('sol', async ctx => {
        await ctx.answerCbQuery()

        const solPrice = await getSolPrice()
        ctx.reply(`O preço do Solana é: $ ${solPrice} dólares`)
    })

    bot.action('shib', async ctx => {
        await ctx.answerCbQuery()

        const shibPrice = await getShibPrice()
        ctx.reply(`O preço do Shiba Inu é: $ ${shibPrice} dólares`)
    })

    // Ações americanas

    bot.action('nvda', async ctx => {
        await ctx.answerCbQuery()

        const nvdaPrice = await getNvdaPrice()
        ctx.reply(`O preço da Nvidia é: $ ${nvdaPrice} dólares`)
    })

    bot.action('aapl', async ctx => {
        await ctx.answerCbQuery()

        const aaplPrice = await getAaplPrice()
        ctx.reply(`O preço da Apple é: $ ${aaplPrice} dólares`)
    })

    bot.action('tsla', async ctx => {
        await ctx.answerCbQuery()

        const tslaPrice = await getTslaPrice()
        ctx.reply(`O preço da Tesla é: $ ${tslaPrice} dólares`)
    })

    bot.action('usd', async ctx => {
        await ctx.answerCbQuery()

        const usdPrice = await getUsdPrice()
        ctx.reply(`O dólar está a ${usdPrice} reais`)
    })

    bot.action('spx', async ctx => {
        await ctx.answerCbQuery()

        const spxPrice = await getSpxPrice()
        ctx.reply(`O preço do S&P 500 é: $ ${spxPrice} dólares`)
    })

    // Ações brasileiras

    bot.action('petr4', async ctx => {
        await ctx.answerCbQuery()

        const petr4Price = await getPetr4Price()
        ctx.reply(`O preço da Petrobras é: R$ ${petr4Price} reais`)
    })

    bot.action('vale3', async ctx => {
        await ctx.answerCbQuery()

        const vale3Price = await getVale3Price()
        ctx.reply(`O preço da Vale é: R$ ${vale3Price} reais`)
    })

    bot.action('itau4', async ctx => {
        await ctx.answerCbQuery()

        const itau4Price = await getItau4Price()
        ctx.reply(`O preço do Itaú é: R$ ${itau4Price} reais`)
    })

    bot.action('selic', async ctx => {
        await ctx.answerCbQuery()

        const selicRate = await getSelicRate()
        ctx.reply(`A taxa Selic é: ${selicRate}%`)
    })

    bot.action('ibov', async ctx => {
        await ctx.answerCbQuery()

        const ibovPoints = await getIbovPoints()
        ctx.reply(`A Ibovespa está com ${ibovPoints} pontos.`)
    })

    bot.launch()
        .then(() => console.log('Bot started'))
        .catch((err: Error) => console.error('Failed to start bot:', err))
}


export { chatCommands }