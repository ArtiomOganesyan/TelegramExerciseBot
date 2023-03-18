const { User } = require('../../db/models');
const getUserName = require('../selectors/getUserName');

function quit(ctx) {
  const username = getUserName(ctx);
  User
    .destroy({ where: { username } })
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      ctx.reply(`${username} you progress was deleted.`);
    })
    .catch((err) => {
      console.log(err);
      ctx.reply("Boss, there is a problem. We're on it.");
    });
}

module.exports = quit;
