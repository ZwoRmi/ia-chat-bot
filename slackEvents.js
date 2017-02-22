'use strict';

const SmartAgent = require('./smartAgent/smartAgent');
const Bot = require('slackbots');

class SlackEvents {
  constructor() {
    const that = this;
    const settings = {
      token: process.env.SLACK_TOKEN,
      name: 'ia-bot'
    };
    this.bot = new Bot(settings);
    this.bot.on('start', function() {
      that.bot.postMessageToChannel('general', 'I\'m connected');
    });
  }

  listenEvents() {
    const that = this;
    this.bot.on('message', function(data) {
      if(data.type === 'message' && typeof data.bot_id === 'undefined') {
        data.text = data.text.trim();
        if (data.text.substring(0, 15) === 'expectedAnswer:') {
          SmartAgent.addSentenceNode(data.text.substring(15).trim(), that.lastRequest || '', 1);
        }
        else {
          that.lastRequest = data.text;
          let response = SmartAgent.getResponse(data.text, that.lastResponse || '');
          that.lastResponse = response;
          that.bot.postMessage(data.channel, response, undefined);
        }
      }
      if(data.type === 'reaction_added' && typeof data.reaction !== 'undefined') {
        if(data.reaction === '-1') {
          SmartAgent.decreasePerformance(that.lastResponse);
        } else if(data.reaction === '+1') {
          SmartAgent.increasePerformance(that.lastResponse);
        }
      }
    });
  }
}

module.exports = SlackEvents;