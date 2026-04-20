import { Telegraf } from "telegraf";
import { chatCommands } from "./chatCommands.js";
import 'dotenv/config'

const bot = new Telegraf(process.env.BOT_TOKEN!)

chatCommands(bot)

bot.launch()
    .then(() => console.log('Bot started'))
    .catch((err: Error) => console.error('Failed to start bot:', err))

export { bot }