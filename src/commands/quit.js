const { User } = require('../../db/models');
const getUserName = require('../selectors/getUserName');

function quit(ctx) {
  const username = getUserName(ctx);
  User
    .destroy({ where: { username } })
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      if (result) {
        ctx.reply(`${username} ваш прогресс удалён.`);
        return;
      }
      ctx.reply(`${username} вы не участвуете.`);
    })
    .catch((err) => {
      console.log(err);
      ctx.reply('Босс, кажется есть проблема. Мы фиксим.');
    });
}

module.exports = quit;
