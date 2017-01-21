const Bot = require('./bot');


class RandomBot extends Bot {
  constructor() {
    super();

    super.sayHello();
  }
}

module.exports = RandomBot;

