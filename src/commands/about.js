const texts = require('../constants/text');

function about(ctx) {
  ctx.reply(texts.about);
}

module.exports = about;
