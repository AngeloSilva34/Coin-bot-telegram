import { Telegraf, session } from "telegraf";
import { chatCommands } from "./chatCommands.js";
import 'dotenv/config'
import { MyContext } from "../types.js";

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!)

//Menu que fica ao lado do campo de texto no chatBot
bot.telegram.setMyCommands([
    { command: 'start', description: 'Início do bot' },
    { command: 'help', description: 'Ver comandos disponíveis' },
    { command: 'alerta', description: 'Criar um novo alerta' },
    { command: 'resumo', description: 'Resumo de todos os ativos e índices' }
]);

bot.use(session())

chatCommands(bot)

//Verificação para fazer poiling caso esteja em desenvolvimento
if (process.env.ENVIRONMENT === "development") {
    bot.launch()
        .then(() => console.log('Bot started'))
        .catch((err: Error) => console.error('Failed to start bot:', err))
}


export { bot }