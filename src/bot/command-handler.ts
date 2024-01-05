import Logger from '#root/utils/logger.js'
import store from '#root/databases/store.js'
import unsplash from '#root/modules/unsplash.js'

export default function registerCommandHandler() {
  const { env, bot, menus } = store
  if (env === null || bot === null || menus === null)
    return

  bot.command('start', async (ctx) => {
    console.log(menus['edit-post'])
    await ctx.reply('Welcome, check out this menu', {
      reply_markup: menus['edit-post'],
    })
  })
  bot.command('welcome', async () => {
    await bot.api.sendMessage(
      env.user_chat_id,
      '*Hi\\!* _Welcome_ to [grammY](https://grammy.dev)\\.',
      { parse_mode: 'MarkdownV2' },
    )
  })

  bot.command('wallpaper', async (ctx) => {
    await unsplash.photos.getRandom({ query: 'tokyo,night', orientation: 'landscape' }).then((result: any) => {
      if (result.errors) {
        // handle error here
        console.log('error occurred: ', result.errors[0])
        bot.api.sendMessage(env.user_chat_id, `error occurred: ${result.errors[0]}`)
      }
      else {
        console.log('result :>> ', result.response)
        ctx.replyWithPhoto(result.response.urls.regular)
        // TODO: extend the result.response object with current unsplash api
        // https://unsplash.com/documentation#get-a-random-photo
      }
    })
  })

  bot.command('about', async (ctx) => {
    const me = await bot.api.getMe()
    console.log('me :>> ', me)
    ctx.reply(`<b>Hi!</b> <i>Welcome</i> to <a href="https://t.me/${me.username}">${me.first_name}</a><span class="tg-spoiler"> id:${me.id}</span>`, { parse_mode: 'HTML' })
  })

  Logger.logSuccess('Command handler registered')
}
