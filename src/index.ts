import { Telegraf } from "telegraf";
import { chatCommands } from "./chatCommands.js";
import 'dotenv/config'

const bot = new Telegraf(process.env.BOT_TOKEN!)

chatCommands(bot)