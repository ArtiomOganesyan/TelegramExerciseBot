const getUserName = require('../selectors/getUserName');
const { User } = require('../../db/models');
const { participateSuccess, participateDuplicate, participateError } = require('../constants/text');

function participate(ctx) {
  User
    .create({ username: getUserName(ctx) })
    // eslint-disable-next-line no-unused-vars
    .then((data) => {
      ctx.reply(`${getUserName(ctx)} ${participateSuccess}`);
    })
    .catch((err) => {
      // 23505 is a code for validation of uniqueness. Code is provided by Sequelize.
      if (err.original.code === '23505') {
        ctx.reply(`${getUserName(ctx)} ${participateDuplicate}`);
        return;
      }
      console.log(err);
      ctx.reply(`${getUserName(ctx)} ${participateError}`);
    });
}

module.exports = participate;
