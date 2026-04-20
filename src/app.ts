import 'dotenv/config'
import express from 'express'

import { connectDB } from './dataBase/connectDB.js'
import { bot } from './chat/chatIndex.js'

const app = express()

//app.use(bot.webhookCallback())
connectDB()

export {app, bot}