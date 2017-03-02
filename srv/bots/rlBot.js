const {RECEIVED_MESSAGES, SENT_MESSAGES} = require('../messagesTypes');
const Bot = require('./bot');
const RL = require('../node_modules/reinforcejs/lib/rl');
const RlEnv = require('./rlEnv');

class RlBot extends Bot {
  constructor() {
    super();

    this.pressedKey = null;
    super.sayHello('Reiforcement Learning Bot');
  }

  getBotConfig() {
    return {

    };
  }

  analyze() {

  }

  firstStepMessage() {

  }
}

module.exports = RlBot;