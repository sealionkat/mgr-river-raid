const {SENT_MESSAGES} = require('../messagesTypes');
const Bot = require('./bot');


class RandomBot extends Bot {
  constructor() {
    super();

    super.sayHello('RandomBot');
  }

  analyze({playerPos}) {

  }

  decide() {}

  firstStepMessage() {
    return SENT_MESSAGES.GETGAMESTATE;
  }
}

module.exports = RandomBot;

