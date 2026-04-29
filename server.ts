import { app, bot, secretPath } from './src/app.js'

const port = process.env.PORT || 9090
const renderUrl = process.env.RENDER_URL!

app.listen(port, async () => {
    console.log(`Server running on port: ${port}`)

    try {
        await bot.telegram.setWebhook(`${renderUrl}${secretPath}`)
        console.log(`Telegram Webhook configurado: ${renderUrl}${secretPath}`)
    } catch (err) {
        console.error(err)
    }
})