require('dotenv').config();
const Telegraf = require('telegraf');
const SocksProxyAgent = require('socks-proxy-agent');
const debug = require('debug')('main');
const { connect, users } = require('./mongo');

const socks5URI = process.env.SOCKS5_PROXY;
const agent = new SocksProxyAgent(socks5URI); 

const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: {
    agent,
  }
});

bot.start((ctx) => ctx.reply('Welcome!'));


bot.on('message', async ctx => {
  debug('new message', ctx.update);
  const botId = ctx.message.from.id;

  const foundUser = await users.findOne({ botId }).lean();

  if (!foundUser) {
    const {
      first_name: firstName,
      last_name: lastName,
      username: userName,
    } = ctx.message.from;

    await users.create({
      botId,
      firstName,
      lastName,
      userName,
    });
  } else {
    debug('user found', foundUser);
  }
});


async function start() {
  await connect();
  bot.launch();
  debug('bot started');
}

start();
