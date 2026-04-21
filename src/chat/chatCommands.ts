import { Context, Telegraf } from "telegraf"
import { getBtcPrice, getEthPrice, getLtcPrice, getSolPrice, getShibPrice } from "../services/asserts/cripto.service.js"
import { getNvdaPrice, getAaplPrice, getTslaPrice, getSpyPrice } from "../services/asserts/stock.service.js"
import { getPetr4Price, getVale3Price, getItau4Price, getSelicRate, getIbovPoints, getUsdPrice } from "../services/asserts/acoes.service.js"
import { createUserService } from "../services/users/user.service.js"

const goBackButton = [{
    text: 'Voltar',
    callback_data: 'start'
}]

const start = async (ctx: Context) => {
    {
        const firstName = ctx.from?.first_name
        const lastName = ctx.from?.last_name || ''
        const fullName = `${firstName} ${lastName}`.trim()
        const telegramId = ctx.from!.id

        await createUserService(telegramId, fullName)

        const startMessage = `
<b>Bem vindo ao Coins Bot!</b>

Selecione um campo abaixo para ter mais informações sobre:
`

        await ctx.telegram.sendMessage(ctx.from!.id, startMessage, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Mercado cripto', callback_data: 'cripto' },
                        { text: 'Mercado americano', callback_data: 'eua' },
                        { text: 'Mercado brasileiro', callback_data: 'bra' }
                    ]
                ]
            }
        })
    }
}

const chatCommands = (bot: Telegraf) => {
    bot.start(ctx => start(ctx))

    bot.help(ctx => {
        ctx.reply("Para ajuda, selecione um dos comandos abaixo:\n\n - /start : Para o início da conversa\n - /help : Para ter ajuda com os comandos")
    })

    bot.action('start', async ctx => await start(ctx))

    //Cripto moedas

    bot.action('cripto', async ctx => {
        await ctx.answerCbQuery()

        const criptoMessage: string = `<b>Selecione uma criptomoeda para verificar seu preço:</b>`

        ctx.telegram.sendMessage(ctx.from.id, criptoMessage, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Bitcoin', callback_data: 'btc' },
                    ],
                    [
                        { text: 'Ethereum', callback_data: 'eth' },
                        { text: 'Litecoin', callback_data: 'ltc' },
                    ],
                    [
                        { text: 'Solana', callback_data: 'sol' },
                        { text: 'Shiba Inu', callback_data: 'shib' }
                    ],
                    goBackButton
                ]
            }
        })
    })

    bot.action('btc', async ctx => {
        await ctx.answerCbQuery()
        const btcPrice = await getBtcPrice()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', {
            caption: `O preço do Bitcoin é: $ ${btcPrice} dólares`
        })
    })

    bot.action('eth', async ctx => {
        await ctx.answerCbQuery()
        const ethPrice = await getEthPrice()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://cryptologos.cc/logos/ethereum-eth-logo.png', {
            caption: `O preço do Ethereum é: $ ${ethPrice} dólares`
        })
    })

    bot.action('ltc', async ctx => {
        await ctx.answerCbQuery()
        const ltcPrice = await getLtcPrice()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://cryptologos.cc/logos/litecoin-ltc-logo.png', {
            caption: `O preço do Litecoin é: $ ${ltcPrice} dólares`
        })
    })

    bot.action('sol', async ctx => {
        await ctx.answerCbQuery()
        const solPrice = await getSolPrice()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://cryptologos.cc/logos/solana-sol-logo.png', {
            caption: `O preço do Solana é: $ ${solPrice} dólares`
        })
    })

    bot.action('shib', async ctx => {
        await ctx.answerCbQuery()
        const shibPrice = await getShibPrice()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png', {
            caption: `O preço do Shiba Inu é: $ ${shibPrice} dólares`
        })
    })

    // Ações americanas

    bot.action('eua', async ctx => {
        await ctx.answerCbQuery()

        const euaMessage: string = `<b>Selecione um ativo para verificar seu preço:</b>`

        await ctx.telegram.sendMessage(ctx.from.id, euaMessage, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Dólar', callback_data: 'usd' },
                    ],
                    [
                        { text: 'Nvidia', callback_data: 'nvda' },
                        { text: 'Apple', callback_data: 'aapl' },
                    ],
                    [
                        { text: 'Tesla', callback_data: 'tsla' },
                        { text: 'SPY', callback_data: 'spy' }
                    ],
                    goBackButton
                ]
            }
        })
    })

    bot.action('usd', async ctx => {
        await ctx.answerCbQuery()

        const usdPrice = await getUsdPrice()
        await ctx.telegram.sendPhoto(ctx.from.id, 'https://images.vexels.com/media/users/3/130116/isolated/preview/215a871596b92451a1678e36960c0ab7-icone-de-moeda-de-dolar.png', {
            caption: `O preço do Dólar é: R$ ${usdPrice} reais`
        })
    })

    bot.action('nvda', async ctx => {
        await ctx.answerCbQuery()
        const nvdaPrice = await getNvdaPrice()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi7L7QB4QXqLiToDglgC_sE9V6FJH4tINhMA&s', {
            caption: `O preço da Nvidia é: $ ${nvdaPrice} dólares`
        })
    })

    bot.action('aapl', async ctx => {
        await ctx.answerCbQuery()
        const aaplPrice = await getAaplPrice()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://cdn-icons-png.flaticon.com/256/0/747.png', {
            caption: `O preço da Apple é: $ ${aaplPrice} dólares`
        })
    })

    bot.action('tsla', async ctx => {
        await ctx.answerCbQuery()
        const tslaPrice = await getTslaPrice()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFJP7X_crOPPYfdGyvHw8KhkxswWPubv8P4w&s', {
            caption: `O preço da Tesla é: $ ${tslaPrice} dólares`
        })
    })

    bot.action('spy', async ctx => {
        await ctx.answerCbQuery()
        const spyPrice = await getSpyPrice()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://pbs.twimg.com/media/Foc5p55XEAMpKMe.png', {
            caption: `O preço do SPY é: $ ${spyPrice} dólares`
        })
    })

    // Ações brasileiras

    bot.action('bra', async ctx => {
        await ctx.answerCbQuery()

        const braMessage: string = `<b>Selecione um ativo para verificar sua situação:</b>`

        await ctx.telegram.sendMessage(ctx.from.id, braMessage, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Ibovespa', callback_data: 'ibov' }
                    ],
                    [
                        { text: 'Petrobras', callback_data: 'petr4' },
                        { text: 'Vale', callback_data: 'vale3' }
                    ],
                    [
                        { text: 'Itaú', callback_data: 'itau4' },
                        { text: 'Selic', callback_data: 'selic' }
                    ],
                    goBackButton
                ]
            }
        })
    })

    bot.action('petr4', async ctx => {
        await ctx.answerCbQuery()
        const petr4Price = await getPetr4Price()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://upload.wikimedia.org/wikipedia/commons/5/51/Logo_petrobras.gif', {
            caption: `O preço da Petrobras é: R$ ${petr4Price} reais`
        })
    })

    bot.action('vale3', async ctx => {
        await ctx.answerCbQuery()
        const vale3Price = await getVale3Price()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTip8PCZbUp6ZvhVkX-Oz5PXo4-qb8ueZ7YRg&s', {
            caption: `O preço da Vale é: R$ ${vale3Price} reais`
        })
    })

    bot.action('itau4', async ctx => {
        await ctx.answerCbQuery()
        const itau4Price = await getItau4Price()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://upload.wikimedia.org/wikipedia/commons/2/2d/2023_Ita%C3%BA_Unibanco_Logo.png', {
            caption: `O preço do Itaú é: R$ ${itau4Price} reais`
        })
    })

    bot.action('selic', async ctx => {
        await ctx.answerCbQuery()
        const selicRate = await getSelicRate()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://static.poder360.com.br/2020/07/tesouro-selic.png', {
            caption: `A taxa Selic é: ${selicRate}%`
        })
    })

    bot.action('ibov', async ctx => {
        await ctx.answerCbQuery()
        const ibovPoints = await getIbovPoints()

        await ctx.telegram.sendPhoto(ctx.from.id, 'https://monitormercantil.com.br/wp-content/uploads/2020/12/Logo-B3-positivo.png', {
            caption: `A Ibovespa está com ${ibovPoints} pontos.`
        })
    })
}


export { chatCommands }
