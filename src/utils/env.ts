import Logger from '#root/utils/logger.js'
import store from '#root/databases/store.js'
import 'dotenv/config'

export default function initLocalEnv(): boolean {
  try {
    store.env = {
      bot_token: process.env.BOT_TOKEN!,
      user_chat_id: process.env.USER_CHAT_ID!,
      unsplash_access_key: process.env.UNSPLASH_ACCESS_KEY!,
      proxy_address: process.env.PROXY_ADDRESS,
    }
    return true
  }
  catch (error) {
    Logger.logError(`FATAL: Error while initializing local environment, please check .env file under root directory.', ${error}`)
    return false
  }
}
