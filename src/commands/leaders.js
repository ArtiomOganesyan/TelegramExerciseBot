const {
  User, Workout, Group,
} = require('../../db/models');
const getChatTitle = require('../selectors/getChatTitle');
const getUserName = require('../selectors/getUserName');

async function leaders(ctx) {
  const username = getUserName(ctx);
  const chatTitle = getChatTitle(ctx);

  try {
    const group = await Group.findOne({
      where: { title: chatTitle },
      include: [{
        model: User,
        include: { model: Workout, attributes: ['sit', 'push', 'plank'] },
        attributes: ['id', 'username'],
      }],
    });

    // I know, I know look its just a pet project, kiss it.
    // Optimize it when needed.
    const usersScore = group.get({ plain: true }).Users.reduce((acc, cur) => {
      acc[cur.username] = cur.Workouts
        .reduce((a, b) => a + Object.values(b)
          .reduce((c, d) => c + d, 0), 0);
      return acc;
    }, {});

    const usersScoreEntries = Object.entries(usersScore);

    const topFive = usersScoreEntries.sort((a, b) => b[1] - a[1]).slice(0, 5);

    let result = '';

    topFive.forEach((user, i) => {
      result += `${i + 1}. ${user[0]} очков ${user[1]}\n`;
    });

    if (!(topFive.find((user) => user[0] === username))) {
      const index = usersScoreEntries.findIndex((user) => user[0] === username);
      if (index !== -1) {
        const user = usersScoreEntries[index];
        result += `---\n${index + 1}. ${user[0]} очков ${user[1]}\n`;
      }
    }

    ctx.reply(result);
  } catch (error) {
    console.log(error);
    ctx.reply('У нас тут проблемка.');
  }
}

module.exports = leaders;
