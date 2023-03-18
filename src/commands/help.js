const texts = require('../constants/text');

function help(ctx) {
  ctx.reply(texts.help);
}

module.exports = help;
