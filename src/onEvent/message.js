const getText = require('../selectors/getText');
const getUserName = require('../selectors/getUserName');

const { User, Workout } = require('../../db/models');

function messageCb(ctx) {
  const username = getUserName(ctx);
  const text = getText(ctx).match(/^Сегодня \d+.\d+.\d+$/g);

  if (text) {
    User
      .findOne({ where: { username }, include: { model: Workout, limit: 1, order: [['createdAt', 'DESC']] } })
      .then((user) => {
        if (user) {
          const [sit, push, plank] = text[0].match(/\d+/g);
          const lastWorkout = user.Workouts[0];
          if (
            lastWorkout.createdAt.toLocaleDateString() === (new Date()).toLocaleDateString()
          ) {
            return Workout.update(
              {
                sit: lastWorkout.sit + (+sit),
                push: lastWorkout.push + (+push),
                plank: lastWorkout.plank + (+plank),
              },
              { where: { userId: user.id, createdAt: lastWorkout.createdAt }, returning: true },
            );
          }

          return Workout.create({
            userId: user.id,
            sit: +sit,
            push: +push,
            plank: +plank,
          });
        }
        return null;
      })
      .then((workout) => {
        if (workout) {
          const msgs = ['WOW!', 'Great Job!', 'Push It!', 'You got it!'];
          ctx.reply(msgs[Math.floor(Math.random() * msgs.length)]);
        }
      })
      .catch((err) => {
        console.log(err);
        ctx.reply('Something went wrong... we are on it boss.');
      });
  }
}

module.exports = messageCb;
