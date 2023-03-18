require('dotenv').config();
const { session, Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const commands = require('./src/commands');
const messageCb = require('./src/onEvent/message');

const commandsArr = Object.entries(commands);

const bot = new Telegraf(process.env.BOT_TOKEN, { username: 'ExerciseBot' });

bot.use(session());

commandsArr.forEach(([command, cb]) => {
  bot.command(command, cb);
});

bot.on(message('text'), messageCb);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
