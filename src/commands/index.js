const about = require('./about');
const help = require('./help');
const leaders = require('./leaders');
const myResult = require('./myResult');
const participate = require('./participate');
const quit = require('./quit');

const commands = {
  my_results: myResult,
  leaders,
  help,
  about,
  quit,
  participate,
};

module.exports = commands;
