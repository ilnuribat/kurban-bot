require('dotenv').config();
const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome!'));

bot.launch(() => {
  console.log('started');
});

bot.on('message', () => {
  console.log('new message');
})

console.log('bot started');
