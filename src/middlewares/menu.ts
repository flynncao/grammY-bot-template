import type { Context } from 'grammy'
import type { MenuOptions, MenuRange } from '@grammyjs/menu'
import { Menu } from '@grammyjs/menu'
import type { MyContext } from '#root/types/bot.js'
import store from '#root/databases/store.js'
import Logger from '#root/utils/logger.js'

interface MenuButton {
  text: string
  callback: (ctx: MyContext) => Promise<any>
  handler?: (ctx: MyContext) => Promise<any>
}

export interface AtomicMenu {
  identifier: string
  buttons: MenuButton[]
  menuOptions?: MenuOptions<MyContext>
}

export interface MenuObj {
  list: AtomicMenu[]
  menuOptions?: MenuOptions<MyContext>
}

export interface IMyMenu {
  insertButtons(buttons: MenuButton[]): void
  registerInBot(): void
}

export class ProducedMenu<C extends Context = Context> extends Menu<C> {
  constructor(menuIdentifier: string, menuOptions?: MenuOptions<C>) {
    super(menuIdentifier, menuOptions)
  }
}

class ClassicMenuBuilder implements IMyMenu {
  private menu!: ProducedMenu<MyContext>
  private identifier: string
  private config: MenuOptions<MyContext>
  constructor(menuIdentifier: string, config?: MenuOptions<MyContext>) {
    this.identifier = menuIdentifier
    this.config = config || {}
    this.reset(menuIdentifier)
  }

  public reset(menuIdentifier: string, config?: MenuOptions<MyContext>) {
    // equals => new Menu(menuIdentifier, config)
    this.identifier = menuIdentifier
    this.config = config || {}
    this.menu = new ProducedMenu<MyContext>(menuIdentifier, config)
  }

  public insertButtons(buttons: MenuButton[]): void {
    // equals => menuInstance.text().text().text()
    for (const button of buttons)
      this.menu.text(button.text, (ctx: MyContext) => button.callback(ctx))
  }

  public registerInBot() {
    store.bot?.use(this.menu)
  }

  public getMenu() {
    const result = this.menu
    return result
  }

  public getConfig() {
    return this.config
  }

  public getIdentifier() {
    return this.identifier
  }
}

const menuList: AtomicMenu[] = [
  {
    identifier: 'greet-me',
    buttons: [
      {
        text: 'Greet me',
        callback: async (ctx: MyContext) => {
          console.log('greet me callback called')
          return `Greet ${ctx.from?.first_name ?? 'me'}!`
        },
        handler: async (ctx: MyContext) => {
          if (ctx.from?.first_name)
            return ctx.reply(`Hello ${ctx.from.first_name}!`)

          else
            return ctx.reply(`Hello! Stranger!`)
        },
      },
    ],
  },
  {
    identifier: 'simple-menu',
    buttons: [
      { text: 'Female', callback: (ctx: MyContext) => ctx.reply('You pressed female!') },
      { text: 'Male', callback: (ctx: MyContext) => ctx.reply('You pressed male!') },
    ],
    menuOptions: {
      onMenuOutdated: 'Reloaded',
    },
  },
  {
    identifier: 'simple-menu',
    buttons: [
      { text: 'Female', callback: (ctx: MyContext) => ctx.reply('You pressed female!') },
      { text: 'Male', callback: (ctx: MyContext) => ctx.reply('You pressed male!') },
      { text: 'Uncertain', callback: (ctx: MyContext) => ctx.reply('You pressed ?!') },
    ],
    menuOptions: {
      onMenuOutdated: '2nd menu',
    },
  },
  {
    identifier: 'edit-post',
    buttons: [
      {
        text: 'Notification',
        callback: async (ctx: MyContext) => {
          await ctx.reply('Notification')
        },
      },
      { text: 'Edit', callback: async (ctx: MyContext) => await ctx.conversation.enter('editPostConversation') },
      { text: 'Create', callback: async (ctx: MyContext) => await ctx.conversation.enter('createPostConversation') },
    ],
  },
]

const menuList2 = [
  {
    identifier: 'not-simple-menu',
    buttons: [
      { text: 'Female', callback: (ctx: MyContext) => ctx.reply('You pressed female!') },
      { text: 'Male', callback: (ctx: MyContext) => ctx.reply('You pressed male!') },
    ],
  },
]

function sharedIdent(): string {
  return store.dashboardFingerprint
}

export function createAllMenus() {
  const builder = new ClassicMenuBuilder('my-menu-identifier')
  const obj: MenuObj = {
    list: menuList,
    menuOptions: {
      onMenuOutdated: 'Reloaded',
    },
  }
  const globalMenuList: Record<string, ProducedMenu<MyContext> | Menu<MyContext>> = {}
  for (const item of menuList) {
    builder.reset(item.identifier, obj.menuOptions)
    builder.insertButtons(item.buttons)
    builder.registerInBot()
    globalMenuList[item.identifier] = builder.getMenu()
  }
  // legacy creation code
  const dynamicLabelledMenu = new Menu<MyContext>('greet-new')
    .text(
      ctx => `Greet ${ctx.from?.first_name ?? 'me'}!`,
      ctx => ctx.reply(`Hello ${ctx.from.first_name}!`),
    )
  const rangedMenu = new Menu<MyContext>('ranged-menu', { autoAnswer: true, fingerprint: (ctx: MyContext) => sharedIdent() }).url('Google', 'https://google.com').dynamic(async (ctx: MyContext, range: MenuRange<MyContext>) => {
    const length = await getRandomIntFromInternet()

    console.log('length :>> ', length)

    for (let i = 0; i < length; i++) {
      range.text(i.toString(), (ctx) => {
        store.dashboardFingerprint = new Date().toISOString()
        return ctx.reply(`You chose ${i}`, { reply_markup: store.menus['greet-new'] })
      }).row()
    }
  }).text('Cancel', ctx => ctx.deleteMessage())
  store.bot?.use(dynamicLabelledMenu).use(rangedMenu)
  globalMenuList['greet-new'] = dynamicLabelledMenu
  globalMenuList['ranged-menu'] = rangedMenu
  store.menus = globalMenuList
  Logger.logSuccess('All menus initialized')
}

async function getRandomIntFromInternet(max: number = 5): Promise<number> {
  return new Promise((resolve, reject) => {
    console.log('getting range')
    setTimeout(() => {
      const num = Math.floor(Math.random() * max)
      resolve(num === 0 ? 1 : num)
    }, 500)
  })
}
