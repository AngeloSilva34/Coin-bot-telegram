import { app, bot } from './src/app.js'

const port = process.env.PORT || 9090

app.listen(port, async () => {
    console.log(`Server running on port: ${port}`)
})