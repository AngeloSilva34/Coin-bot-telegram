import { Telegraf, session } from "telegraf";
import { chatCommands } from "./chatCommands.js";
import 'dotenv/config'
import { MyContext } from "../types.js";


const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!)

bot.use(session())

chatCommands(bot)

bot.launch()
    .then(() => console.log('Bot started'))
    .catch((err: Error) => console.error('Failed to start bot:', err))

export { bot }