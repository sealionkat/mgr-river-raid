const Bot = require('./bot');


class RandomBot extends Bot {
  constructor() {
    super();

    super.sayHello('RandomBot');
  }
}

module.exports = RandomBot;

