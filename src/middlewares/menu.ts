import { builtinModules } from 'node:module'
import type { Context } from 'grammy'
import { Bot } from 'grammy'
import { Menu } from '@grammyjs/menu'
import type { MyContext } from '#root/types/bot.js'
import store from '#root/databases/store.js'

interface MenuButton {
  text: string
  callback: (ctx: MyContext) => void
}

export interface MenuList {
  identifier: string
  buttons: MenuButton[]
}

export interface IMyMenu {
  insertButtons(buttons: MenuButton[]): void
  registerInBot(): void
}

export class ProducedMenu<C extends Context = Context> extends Menu<C> {
  constructor(menuIdentifier: string) {
    super(menuIdentifier)
  }
}

class ClassicMenuBuilder implements IMyMenu {
  private menu!: ProducedMenu<MyContext>
  private identifier: string
  constructor(menuIdentifier: string) {
    this.identifier = menuIdentifier
    this.reset(menuIdentifier)
  }

  public reset(menuIdentifier: string) {
    this.identifier = menuIdentifier
    this.menu = new ProducedMenu<MyContext>(menuIdentifier)
  }

  public insertButtons(buttons: MenuButton[]): void {
    for (const button of buttons)
      this.menu.text(button.text, (ctx: MyContext) => button.callback(ctx))
  }

  public registerInBot() {
    console.log(`Register menu: ${this.identifier}`)
    store.bot?.use(this.menu)
  }

  public getMenu() {
    const result = this.menu
    return result
  }
}

const menuList: MenuList[] = [
  {
    identifier: 'simple-menu',
    buttons: [
      { text: 'Female', callback: (ctx: MyContext) => ctx.reply('You pressed female!') },
      { text: 'Male', callback: (ctx: MyContext) => ctx.reply('You pressed male!') },
    ],
  },
  {
    identifier: 'edit-post',
    buttons: [
      { text: 'Edit', callback: (ctx: MyContext) => ctx.reply('You pressed Edit!') },
      { text: 'Delete', callback: (ctx: MyContext) => ctx.reply('You pressed Delete!') },
    ],
  },
]

export function createAllMenus() {
  const builder = new ClassicMenuBuilder('my-menu-identifier')
  const wowMenuList: Record<string, ProducedMenu<MyContext>> = {}
  for (const item of menuList) {
    builder.reset(item.identifier)
    builder.insertButtons(item.buttons)
    builder.registerInBot()
    wowMenuList[item.identifier] = builder.getMenu()
  }
  store.menus = wowMenuList
}
