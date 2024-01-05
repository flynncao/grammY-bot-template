import timestamp from './timestamp.js'
import store from '#root/databases/store.js'
import Logger from '#root/utils/logger.js'

export default function registerMiddlewares() {
  const { bot } = store
  if (!bot)
    return
  const middlewares = [
    timestamp,
  ]
  for (const item of middlewares) {
    if (item)
      bot.use(item)
  }
  Logger.logSuccess('Middlewares registered')
}
