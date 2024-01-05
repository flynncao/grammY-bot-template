import type { Timer as ITimer } from 'easytimer.js'
import type { Bot } from 'grammy'
import type { MyContext } from '#root/types/bot.js'
import type { MyEnv } from '#root/types/env.js'
import type { ProducedMenu } from '#root/middlewares/menu.js'

interface SharedDB {
  timer: ITimer | null
  bot: Bot<MyContext> | null
  env: MyEnv | null
  menus: any
}

const db: SharedDB = {
  timer: null,
  bot: null,
  env: null,
  menus: null,
}

export default db
