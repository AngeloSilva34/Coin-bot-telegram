import { Telegraf } from "telegraf"

const chatCommands = (bot: Telegraf) => {
    bot.start(ctx => {
        ctx.reply('Hello world')
    })

    bot.hears('Oi', ctx => {
        ctx.reply("Olá! Tudo bem?")
    })

    bot.help(ctx => {
        ctx.reply("Para ajuda, selecione um dos comandos abaixo:\n\n - /start : Para o início da conversa\n - /help : Para ter ajuda com os comandos")
    })

    bot.launch()
        .then(() => console.log('Bot started'))
        .catch((err: Error) => console.error('Failed to start bot:', err))
}


export {chatCommands}