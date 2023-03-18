const getUserName = require('../selectors/getUserName');

const {
  User, Workout, Sequelize,
} = require('../../db/models');

async function myResult(ctx) {
  const username = getUserName(ctx);
  try {
    const [total] = await User.findAll({
      where: { username },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('Workouts.sit')),
          'SitUps'],
        [Sequelize.fn('SUM', Sequelize.col('Workouts.push')),
          'PushUps'],
        [Sequelize.fn('SUM', Sequelize.col('Workouts.plank')),
          'PlankSec'],
      ],
      include: [{
        model: Workout,
        attributes: [],
      }],
      group: ['User.id'],
      raw: true,
    });

    const [user] = await User.findAll({
      where: { username },
      include: [{
        model: Workout,
        // TODO: order is not in sql query
        // order: [['createdAt', 'DESC']],
        where: {
          createdAt: {
            [Sequelize.Op.gte]: Sequelize.literal("NOW() - (INTERVAL '7 days')"),
          },
        },
      }],
    });

    let result = '';

    // TODO: Use order in query
    user.Workouts.sort((a, b) => a.createdAt - b.createdAt).forEach(({
      sit, push, plank, createdAt,
    }) => {
      result += `${createdAt.toLocaleDateString()}\n  Sit-Ups: ${sit}\n  Push-ups: ${push}\n  Plank secs: ${plank}\n--\n`;
    });

    result += `\n\nTotal Sit-Ups: ${total.SitUps}\nTotal Push-Ups: ${total.PushUps}\nTotal Plank seconds: ${total.PlankSec}`;

    ctx.reply(result);
  } catch (error) {
    console.error(error);
    ctx.reply('Oops! Something went wrong. We are on it.');
  }
}

module.exports = myResult;
