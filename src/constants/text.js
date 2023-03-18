const help = `This bot is for us to keep track of our exercise results.
\nWith it we will be able to compete and motivate each other to do more and more exercises.
\nThe challenge is to do sit-ups, push-ups as much as you can in a day and a plank stance for as long as you.
\nPlease write your results in this format:\nСегодня <число приседаний>.<число отжиманий>.<секунд в планке>
Вот пара примеров:
Сегодня 12.23.90
Сегодня 20.40.360
Сегодня 230.15.600`;

const participateSuccess = 'has joined our challenge!\nGreat!! Lets start.';
const participateDuplicate = `you have already joined the challenge!
If you need help with the bot, please use "/help"`;
const participateError = 'there seems to be problem. We are fixing it =)';

const about = `This is just a small pet project. The aim of it is to create a workout challenge for a group of colleagues.
\nIf you need help with the bot, please use "/help".
\nHope this helps us not only keep fit but have fun =)
\nGit Repo: https://github.com/ArtiomOganesyan/TelegramExerciseBot
`;

const texts = {
  about, help, participateSuccess, participateError, participateDuplicate,
};

module.exports = texts;
