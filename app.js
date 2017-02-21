/**
 * Created by rebouh on 21/02/2017.
 */
var Bot = require('slackbots');

// create a bot
var settings = {
    token: 'xoxb-144196347043-0SPu0yLBZt353mJqCdge00yG',
    name: 'ia-bot'
};
var bot = new Bot(settings);

bot.on('start', function() {
    bot.postMessageToChannel('general', 'Hello channel!');
});