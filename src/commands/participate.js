const getUserName = require('../selectors/getUserName');
const { User, Group, UserGroup } = require('../../db/models');
const { participateSuccess, participateDuplicate, participateError } = require('../constants/text');
const getChatTitle = require('../selectors/getChatTitle');

async function participate(ctx) {
  try {
    const [group] = await Group.findOrCreate({ where: { title: getChatTitle(ctx) } });
    const [user] = await User.findOrCreate({ where: { username: getUserName(ctx) } });
    // eslint-disable-next-line no-unused-vars
    const [userGroup, newParticipation] = await UserGroup.findOrCreate(
      { where: { groupId: group.id, userId: user.id } },
    );

    if (!newParticipation) {
      ctx.reply(`${getUserName(ctx)} ${participateDuplicate}`);
      return;
    }
    ctx.reply(`${getUserName(ctx)} ${participateSuccess}`);
  } catch (error) {
    ctx.reply(`${getUserName(ctx)} ${participateError}`);
  }
}

module.exports = participate;
