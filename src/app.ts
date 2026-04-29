import 'dotenv/config'
import express from 'express'

import { connectDB } from './dataBase/connectDB.js'
import { bot } from './chat/chatIndex.js'

const app = express()

const secretPath = `/webhook/${process.env.SHA256HASH_PATH}`

app.use(bot.webhookCallback(secretPath))
app.use(express.json())

connectDB()

export {app, bot, secretPath}