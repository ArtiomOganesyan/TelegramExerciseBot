require('dotenv').config();
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const commands = require('./src/commands');
const messageCb = require('./src/onEvent/message');

const commandsArr = Object.entries(commands);
const launch = async () => {
  try {
    const bot = new Telegraf(process.env.BOT_TOKEN, { username: 'ExerciseBot' });

    commandsArr.forEach(([command, cb]) => {
      bot.command(command, cb);
    });

    bot.on(message('text'), messageCb);

    bot.launch();
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (error) {
    console.log(error);
  }
};

launch();
