const getUserName = require('../selectors/getUserName');

const {
  User, Workout, Sequelize,
} = require('../../db/models');

async function myResult(ctx) {
  const username = getUserName(ctx);
  try {
    const isChallenger = await User.count({ where: { username } });

    if (!isChallenger) {
      ctx.reply(`${username} пожалуйста с начало зарегистрируйтесь /participate.`);
      return;
    }

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

    if (!user) {
      ctx.reply('Нет записей.');
      return;
    }

    // TODO: Use order in query
    user.Workouts.sort((a, b) => a.createdAt - b.createdAt).forEach(({
      sit, push, plank, createdAt,
    }) => {
      result += `${createdAt.toLocaleDateString()}\nПриседания: ${sit ?? 0``}\nОтжимания: ${push ?? 0``}\nСекунд в планке: ${plank ?? 0``}\n--\n`;
    });

    result += `\n\nПриседания: ${total.SitUps ?? 0}\nОтжимания: ${total.PushUps ?? 0}\nСекунд в планке: ${total.PlankSec ?? 0}`;

    ctx.reply(result);
  } catch (error) {
    console.error(error);
    ctx.reply('Упс! Что-то пошло не так.');
  }
}

module.exports = myResult;
