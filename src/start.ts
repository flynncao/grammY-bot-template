import { Bot, GrammyError, HttpError, session } from 'grammy'
import mongoose from 'mongoose'
import { commandList } from './constants/index.js'
import Logger from './utils/logger.js'
import registerMessageHandler from './bot/message-handler.js'
import initLocalEnv from './utils/env.js'
import registerCommandHandler from './bot/command-handler.js'
import registerMiddlewares from './middlewares/index.js'
import { createAllMenus } from './middlewares/menu.js'
import { createAllConversations } from './middlewares/conversation.js'
import { initCrons } from './crons/index.js'
import type { MyContext } from '#root/types/bot.js'
import store from '#root/databases/store.js'

function setErrorHandler(bot: Bot<MyContext>) {
  bot.catch((err) => {
    const ctx = err.ctx
    Logger.logError(`Error while handling update ${ctx.update.update_id}:`)
    const e = err.error
    if (e instanceof GrammyError)
      Logger.logError('Error in request:', e.description)

    else if (e instanceof HttpError)
      Logger.logError('Could not contact Telegram:', e)

    else
      Logger.logError('Unknown error:', e)
  })
}

async function init() {
  if (!initLocalEnv())
    return
  Logger.logProgress('Local env loaded, bot starting...')
  try {
    const { env } = store
    if (env === null)
      return
    await mongoose.connect('mongodb://localhost:27017/blog')
    const bot = new Bot<MyContext>(env.bot_token)
    store.bot = bot
    // Set commands
    await bot.api.setMyCommands(commandList)
    // Register handlers and menus...
    registerMiddlewares()
    createAllConversations()
    createAllMenus()
    registerCommandHandler()
    registerMessageHandler()
    // Set error handler
    setErrorHandler(bot)
    // Set cron tasks
    initCrons()
    // Start bot
    bot.start()
    Logger.logSuccess('Bot started')
  }
  catch (error) {
    Logger.logError(`Error while initializing bot', ${error}`)
  }
}

init()
