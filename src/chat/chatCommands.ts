import { Telegraf } from "telegraf"
import { message } from "telegraf/filters"

import { getAllCoinPrice, getCoinPrice } from "../services/assets/cripto.service.js"
import { getAllStockPrice, getStockPrice } from "../services/assets/stock.service.js"
import { getAllBrapiPrice, getBrapiPrice } from "../services/assets/acoes.service.js"
import { createAlertService, createUserService } from "../services/users/user.service.js"

import { MyContext, PriceMap } from "../types.js"
import { errorMessage, goBackButton } from "./components.js"

const start = async (ctx: MyContext) => {
    {
        const firstName = ctx.from?.first_name
        const lastName = ctx.from?.last_name || ''
        const fullName = `${firstName} ${lastName}`.trim()
        const telegramId = ctx.from!.id

        await createUserService(telegramId, fullName)

        const startMessage = `
<b>Bem vindo ao Coins Bot!</b>

Selecione um campo abaixo para ter mais informações sobre 👇
`

        await ctx.telegram.sendMessage(ctx.from!.id, startMessage, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Mercado cripto ₿', callback_data: 'cripto' }],
                    [{ text: 'Mercado americano US$', callback_data: 'eua' }],
                    [{ text: 'Mercado brasileiro R$', callback_data: 'bra' }]
                ]
            }
        }).catch((err: Error) => errorMessage(err, ctx))
    }
}

const chatCommands = (bot: Telegraf<MyContext>) => {
    bot.start(ctx => start(ctx))
    bot.action('start', async ctx => await start(ctx))

    bot.help(ctx => {
        ctx.reply(`Para ajuda, selecione um dos comandos abaixo:
- /start : Para o início da conversa
- /help : Para ter ajuda com os comandos
- /alerta : Criar um novo alerta
- /resumo : Resumo de todos os ativos e índices
            `)
    })

    bot.command('alerta', async ctx => await confirmAlert(ctx))
    bot.action('alerta', async ctx => await confirmAlert(ctx))

    bot.command('resumo', async ctx => await handleResume(ctx))
    bot.action('resumo', async ctx => await handleResume(ctx))

    bot.on(message("text"), async (ctx: MyContext) => {
        const alert = ctx.session?.pendingAsset
        if (!alert || !alert?.stage || !("text" in ctx.message!) || !ctx.from) return;

        const telegramId = ctx.from.id;

        if (alert.stage === 'waitingPrice') {
            const rawText = ctx.message.text;

            const formatedPrice = rawText.replace(",", ".")
            const price = Number(formatedPrice)

            if (isNaN(price) || !isFinite(price) || price <= 0) {
                return ctx.reply("Digite somente números")
            }

            alert.targetPrice = price
            alert.stage = 'waitingDays'
            return ctx.reply('Agora, por quantos dias esse alerta deve durar? (Ex: 7, 30, 90)')
        }

        if (alert.stage === 'waitingDays') {
            const stringDays = ctx.message.text;
            const days = parseFloat(stringDays)

            if (isNaN(days) || !isFinite(days) || days <= 0 || days >= 365) {
                return ctx.reply("Digite somente números");
            }

            const creatingAlert = await createAlertService(alert.asset!, alert.targetPrice!, telegramId, days, alert.price!);

            if (creatingAlert) {
                ctx.session.pendingAsset = {};

                return ctx.reply(creatingAlert);

            } else {
                return ctx.reply("Algo deu errado. Verifique o valor digitado novamente.");
            }
        }
    });

    //Cripto moedas

    bot.action('cripto', async ctx => {
        await ctx.answerCbQuery()

        const criptoMessage: string = `<b>Selecione uma criptomoeda para verificar seu preço:</b>`

        ctx.telegram.sendMessage(ctx.from.id, criptoMessage, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Bitcoin', callback_data: 'crpt:Bitcoin' },
                    ],
                    [
                        { text: 'Ethereum', callback_data: 'crpt:Ethereum' },
                        { text: 'Litecoin', callback_data: 'crpt:Litecoin' },
                    ],
                    [
                        { text: 'Solana', callback_data: 'crpt:Solana' },
                        { text: 'Shiba Inu', callback_data: 'crpt:Shiba' }
                    ],
                    goBackButton
                ]
            }
        }).catch((err: Error) => errorMessage(err, ctx))
    });

    bot.action(/^crpt:(.+)$/, async ctx => await handleCriptoPrice(ctx));

    // Ações americanas

    bot.action('eua', async ctx => {
        await ctx.answerCbQuery()

        const euaMessage: string = `<b>Selecione um ativo para verificar seu preço:</b>`

        await ctx.telegram.sendMessage(ctx.from.id, euaMessage, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Dólar', callback_data: 'brapi:Dólar' },
                    ],
                    [
                        { text: 'Nvidia', callback_data: 'stock:Nvidia' },
                        { text: 'Apple', callback_data: 'stock:Apple' },
                    ],
                    [
                        { text: 'Tesla', callback_data: 'stock:Tesla' },
                        { text: 'SPY', callback_data: 'stock:SPY' }
                    ],
                    goBackButton
                ]
            }
        }).catch((err: Error) => errorMessage(err, ctx))
    })

    bot.action(/^stock:(.+)$/, async ctx => await handleStockPrice(ctx))

    // Ações brasileiras

    bot.action('bra', async ctx => {
        await ctx.answerCbQuery()

        const braMessage: string = `<b>Selecione um ativo para verificar sua situação:</b>`

        await ctx.telegram.sendMessage(ctx.from.id, braMessage, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Ibovespa', callback_data: 'brapi:Ibovespa' }
                    ],
                    [
                        { text: 'Petrobras', callback_data: 'brapi:Petrobras' },
                        { text: 'Vale', callback_data: 'brapi:Vale' }
                    ],
                    [
                        { text: 'Itaú', callback_data: 'brapi:Itaú' },
                        { text: 'Selic', callback_data: 'brapi:Selic' }
                    ],
                    goBackButton
                ]
            }
        }).catch((err: Error) => errorMessage(err, ctx))
    })

    bot.action(/^brapi:(.+)$/, async ctx => await handleBrapiPrice(ctx))

    //Alertas

    bot.action(/^selectAlert:(.+)$/, async (ctx: MyContext & { match: RegExpExecArray }) => {
        await ctx.answerCbQuery()

        const typeAlert = ctx.match[1]
        if (typeAlert === "cripto") {
            await createCriptoAlert(ctx)
        } else if (typeAlert === "USA") {
            await createUsaAlert(ctx)
        } else await createBrAlert(ctx)
    })

    bot.action(/^alert:(.+)$/, async ctx => await createAlert(ctx))
}

const confirmAlert = async (ctx: MyContext) => {
    if (ctx.callbackQuery) {
        await ctx.answerCbQuery()
    }

    await ctx.telegram.sendMessage(ctx.from?.id!, 'Selecione um tipo de ativo que deseja adicionar um alerta', {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Criptomoedas", callback_data: "selectAlert:cripto" }],
                [{ text: "Ativos Americanos", callback_data: "selectAlert:USA" }],
                [{ text: "Ativos Brasileiros", callback_data: "selectAlert:BR" }],
                goBackButton
            ]
        }
    }).catch((err: Error) => errorMessage(err, ctx))
}

const createCriptoAlert = async (ctx: MyContext) => {
    if (ctx.callbackQuery) {
        await ctx.answerCbQuery()
    }

    await ctx.telegram.sendMessage(ctx.from?.id!, 'Selecione a Cripto que deseja adicionar um alerta', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Bitcoin', callback_data: 'alert:Bitcoin' },
                ],
                [
                    { text: 'Ethereum', callback_data: 'alert:Ethereum' },
                    { text: 'Litecoin', callback_data: 'alert:Litecoin' },
                ],
                [
                    { text: 'Solana', callback_data: 'alert:Solana' },
                    { text: 'Shiba Inu', callback_data: 'alert:Shiba' }
                ],
                goBackButton
            ]
        }
    }).catch((err: Error) => errorMessage(err, ctx))
}

const createUsaAlert = async (ctx: MyContext) => {
    if (ctx.callbackQuery) {
        await ctx.answerCbQuery()
    }

    await ctx.telegram.sendMessage(ctx.from?.id!, 'Selecione o ativo americano que deseja adicionar um alerta', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Dólar', callback_data: 'alert:Dólar' },
                ],
                [
                    { text: 'Nvidia', callback_data: 'alert:Nvidia' },
                    { text: 'Apple', callback_data: 'alert:Apple' },
                ],
                [
                    { text: 'Tesla', callback_data: 'alert:Tesla' },
                    { text: 'SPY', callback_data: 'alert:SPY' }
                ],
                goBackButton
            ]
        }
    }).catch((err: Error) => errorMessage(err, ctx))
}

const createBrAlert = async (ctx: MyContext) => {
    if (ctx.callbackQuery) {
        await ctx.answerCbQuery()
    }

    await ctx.telegram.sendMessage(ctx.from?.id!, 'Selecione o ativo brasileiro que deseja adicionar um alerta', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Ibovespa', callback_data: 'alert:Ibovespa' }
                ],
                [
                    { text: 'Petrobras', callback_data: 'alert:Petrobras' },
                    { text: 'Vale', callback_data: 'alert:Vale' }
                ],
                [
                    { text: 'Itaú', callback_data: 'alert:Itaú' },
                    { text: 'Selic', callback_data: 'alert:Selic' }
                ],
                goBackButton
            ]
        }
    }).catch((err: Error) => errorMessage(err, ctx))
}

const createAlert = async (ctx: MyContext & { match: RegExpExecArray }) => {
    await ctx.answerCbQuery()
    const ticker = ctx.match[1]

    let phrase = ''
    let price

    if (["Bitcoin", "Ethereum", "Litecoin", "Solana", "Shiba"].includes(ticker)) {
        price = await getCoinPrice(ticker)
        phrase = `O valor da cripto ${ticker} está em ${price} dólares atualmente.`

    } else if (["Nvidia", "Apple", "Tesla", "SPY"].includes(ticker)) {
        price = await getStockPrice(ticker)

        if (ticker === "SPY") {
            phrase = `O ETF SPY está a ${price} dólares atualmente`
        } else {
            phrase = `O valor da ação da ${ticker} esta a ${price} dólares atualmente`
        }

    } else if (["Dólar", "Ibovespa", "Petrobras", "Vale", "Itaú", "Selic"].includes(ticker)) {
        price = await getBrapiPrice(ticker)

        if (ticker === "Selic") {
            phrase = `A taxa Selic está em ${price}% atualmente`
        } else if (ticker === "Ibovespa") {
            phrase = `A Ibovespa está com ${price} pontos atualmente`
        } else {
            phrase = `${ticker === 'Dólar' || ticker === 'Itaú' ? 'O' : 'A'} ${ticker} está valendo ${price} reais atualmente`
        }
    } else {
        return await ctx.reply('Não foi possível identificar o ativo. Por favor tente novamente mais tarde.')
    }

    if (typeof price !== 'number') {
        return ctx.reply("Algo deu errado. Tente novamente mais tarde")
    }

    ctx.session ??= {}
    ctx.session.pendingAsset = {
        asset: ticker,
        stage: 'waitingPrice',
        price: price
    }

    await ctx.reply(`${phrase}. \n\n Você gostaria de ser avisado quando atingisse qual marca? \n\n (Escreva somente números)`)
}

const handleCriptoPrice = async (ctx: MyContext & { match: RegExpExecArray }) => {
    if (!ctx.from) return;

    await ctx.answerCbQuery()
    const asset = ctx.match[1]
    const urlPhoto: Record<string, string> = {
        'Bitcoin': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
        'Ethereum': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        'Litecoin': 'https://cryptologos.cc/logos/litecoin-ltc-logo.png',
        'Solana': 'https://cryptologos.cc/logos/solana-sol-logo.png',
        'Shiba': 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png'
    }

    const photo = urlPhoto[asset]
    const price = await getCoinPrice(asset)

    if (!price) return await ctx.reply(`Não foi possível conseguir o preço da moeda ${asset}. Tente novamente em alguns minutos`)

    return await ctx.telegram.sendPhoto(ctx.from.id, photo, {
        caption: `O ${asset} está a ${price} dólares`
    }).catch((err: Error) => errorMessage(err, ctx))
}

const handleStockPrice = async (ctx: MyContext & { match: RegExpExecArray }) => {
    if (!ctx.from) return;

    await ctx.answerCbQuery()
    const asset = ctx.match[1]
    const urlPhoto: Record<string, string> = {
        'Nvidia': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi7L7QB4QXqLiToDglgC_sE9V6FJH4tINhMA&s',
        'Apple': 'https://cdn-icons-png.flaticon.com/256/0/747.png',
        'Tesla': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFJP7X_crOPPYfdGyvHw8KhkxswWPubv8P4w&s',
        'SPY': 'https://pbs.twimg.com/media/Foc5p55XEAMpKMe.png'
    }

    const photo = urlPhoto[asset]
    const price = await getStockPrice(asset)

    if (!price) return await ctx.reply(`Não foi possível conseguir o preço da ${asset}. Tente novamente em alguns minutos`)
    if (asset === 'SPY') {
        return await ctx.telegram.sendPhoto(ctx.from.id, photo, {
            caption: `O ETF SPY está valendo ${price} dólares`
        }).catch((err: Error) => errorMessage(err, ctx))
    }

    return await ctx.telegram.sendPhoto(ctx.from.id, photo, {
        caption: `A ação da ${asset} está valendo ${price} dólares`
    }).catch((err: Error) => errorMessage(err, ctx))
}

const handleBrapiPrice = async (ctx: MyContext & { match: RegExpExecArray }) => {
    if (!ctx.from) return;

    await ctx.answerCbQuery()
    const asset = ctx.match[1]
    const urlPhoto: Record<string, string> = {
        'Dólar': 'https://images.vexels.com/media/users/3/130116/isolated/preview/215a871596b92451a1678e36960c0ab7-icone-de-moeda-de-dolar.png',
        'Ibovespa': 'https://monitormercantil.com.br/wp-content/uploads/2020/12/Logo-B3-positivo.png',
        'Petrobras': 'https://upload.wikimedia.org/wikipedia/commons/5/51/Logo_petrobras.gif',
        'Vale': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTip8PCZbUp6ZvhVkX-Oz5PXo4-qb8ueZ7YRg&s',
        'Itaú': 'https://upload.wikimedia.org/wikipedia/commons/2/2d/2023_Ita%C3%BA_Unibanco_Logo.png',
        'Selic': 'https://static.poder360.com.br/2020/07/tesouro-selic.png',
    }

    const photo = urlPhoto[asset]
    const price = await getBrapiPrice(asset)

    if (!price) return await ctx.reply(`Não foi possível conseguir informações sobre ${asset}. Tente novamente em alguns minutos`)
    if (asset === 'Selic') {
        return await ctx.telegram.sendPhoto(ctx.from.id, photo, {
            caption: `A taxa Selic está em ${price}%`
        }).catch((err: Error) => errorMessage(err, ctx))
    }
    if (asset === 'Ibovespa') {
        return await ctx.telegram.sendPhoto(ctx.from.id, photo, {
            caption: `A Ibovespa está com ${price} pontos`
        }).catch((err: Error) => errorMessage(err, ctx))
    }

    return await ctx.telegram.sendPhoto(ctx.from.id, photo, {
        caption: `${asset === 'Dólar' || asset === 'Itaú' ? 'O' : 'A'} ${asset} está valendo ${price} reais`
    }).catch((err: Error) => errorMessage(err, ctx))
}

const handleResume = async (ctx: MyContext) => {
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

    const resumeMessage = ` <b> 📊Este é um resumo dos ativos: </b>
    
Bitcoin(BTC): $ ${allPrices.Bitcoin}
Ethereum(ETH): $ ${allPrices.Ethereum}
Litecoin(LTC): $ ${allPrices.Litecoin}
Solana(SOL): $ ${allPrices.Solana}
Shiba(Shib): $ ${allPrices.Shiba}

Dólar(USD): R$ ${allPrices.Dólar}
Nvidia(NVDA): $ ${allPrices.Nvidia}
Apple(APPL): $ ${allPrices.Apple}
Tesla(TSLA): $ ${allPrices.Tesla}
SPY: $ ${allPrices.SPY}

Ibovespa(Ibov): ${allPrices.Ibovespa} pontos
Petrobras(Petr4): R$ ${allPrices.Petrobras}
Vale(Vale3): R$ ${allPrices.Vale}
Itaú(Itub4): R$ ${allPrices.Itaú}
Selic: ${allPrices.Selic}%
    `

    await ctx.replyWithHTML(resumeMessage)
}


export { chatCommands }
