const {
  User, Workout, Sequelize,
} = require('../../db/models');
const getUserName = require('../selectors/getUserName');

async function leaders(ctx) {
  const username = getUserName(ctx);
  const users = await User.findAll({
    attributes: [
      'username',
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
  });

  // I know, I know look its just a pet project, kiss it.
  // Optimize it when needed.
  const userScores = Object.entries(users.reduce((acc, current) => {
    const user = current.get();
    // eslint-disable-next-line no-param-reassign
    acc[user.username] = +user.SitUps + (+user.PushUps) + (+user.PlankSec);
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);

  let result = '';

  const topFive = userScores.slice(0, 5);

  topFive.forEach((user, i) => {
    result += `${i + 1}. ${user[0]} points ${user[1]}\n`;
  });

  if (!(topFive.find((user) => user[0] === username))) {
    const index = userScores.findIndex((user) => user[0] === username);
    const user = userScores[index];
    result += `${index + 1}. ${user[0]} points ${user[1]}\n`;
  }

  ctx.reply(result);
}

module.exports = leaders;
