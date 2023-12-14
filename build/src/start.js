import { Bot, GrammyError, HttpError } from 'grammy';
import { responseTime } from './middlewares/timestamp.js';
import { commandList } from './constants/index.js';
import unsplash from './modules/unsplash.js';
// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot('6962244178:AAGy1H78uOymtwmB5T39qnGroAAdHIO0Gmw'); // <-- put your bot token between the ""
const userChatID = 5766880721;
/**
 * High-priority middleware
 */
await bot.api.setMyCommands(commandList);
bot.use(responseTime);
/**
 * Message handlers
 */
bot.command('start', ctx => ctx.reply('Welcome! Up and running.'));
bot.command('help', async (ctx) => {
    ctx.reply('You wanna some help?');
});
bot.on('message::email', async (ctx) => {
    ctx.reply(`Send email to ${ctx.message.text}?`);
});
bot.hears('I love pizza!', async (ctx) => {
    // `reply` is an alias for `sendMessage` in the same chat (see next section).
    await ctx.reply('Pizza loves you!', {
        // `reply_to_message_id` specifies the actual reply feature.
        reply_to_message_id: ctx.msg.message_id,
    });
});
bot.command('welcome', async () => {
    await bot.api.sendMessage(userChatID, '*Hi\\!* _Welcome_ to [grammY](https://grammy.dev)\\.', { parse_mode: 'MarkdownV2' });
});
bot.command('wallpaper', async (ctx) => {
    await unsplash.photos.getRandom({ query: 'tokyo,night', orientation: 'landscape' }).then((result) => {
        if (result.errors) {
            // handle error here
            console.log('error occurred: ', result.errors[0]);
            bot.api.sendMessage(userChatID, `error occurred: ${result.errors[0]}`);
        }
        else {
            console.log('result :>> ', result.response);
            ctx.replyWithPhoto(result.response.urls.regular);
            // TODO: extend the result.response object with current unsplash api
            // https://unsplash.com/documentation#get-a-random-photo
        }
    });
});
bot.command('about', async (ctx) => {
    const me = await bot.api.getMe();
    console.log('me :>> ', me);
    ctx.reply(`<b>Hi!</b> <i>Welcome</i> to <a href="https://t.me/${me.username}">${me.first_name}</a><span class="tg-spoiler"> id:${me.id}</span>`, { parse_mode: 'HTML' });
});
bot.on('message:entities:url', async (ctx) => {
    ctx.reply('Got a URL!');
}); // messages containing a URL
bot.on('message', async (ctx) => {
    ctx.reply('Got another message!');
});
/**
 * Error handling
 */
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError)
        console.error('Error in request:', e.description);
    else if (e instanceof HttpError)
        console.error('Could not contact Telegram:', e);
    else
        console.error('Unknown error:', e);
});
/**
 * Custom middlewares
 */
// Start the bot.
bot.start();
//# sourceMappingURL=start.js.map