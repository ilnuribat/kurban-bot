require('dotenv').config();
const bluebird = require('bluebird');
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
  try {
    await connect();
    bot.launch();
    debug('bot started');

    const res = await bot.telegram.sendMessage(249377954, 'test message');

    debug(res);
    await bluebird.delay(1000);

    const editRes = await bot.telegram.editMessageText(res.chat.id, res.message_id, undefined,'edited text!');

    debug(editRes);
  } catch (err) {
    debug('error in start', err);
  }
}

start();
