import { MyContext } from "../types.js"

const goBackButton = [{ text: "Voltar ao início", callback_data: "start" }]

const errorMessage = async (err: Error, ctx: MyContext) => {
    console.error("Error trying to send message: ", err)
    await ctx.reply('Algo deu errado, tente novamente mais tarde. \n\n - /start : Início do bot')
}

export {
    goBackButton,
    errorMessage
}