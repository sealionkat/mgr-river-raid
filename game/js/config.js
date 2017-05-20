CONFIG = {
  INIT: {
    SCORE: 0,
    FUEL: 2000,
    MAXFUEL: 2000,
    HEIGHT: 800,
    WIDTH: 480,
    GROUNDWIDTH: 30
  },
  NAMES: {
    PLAYER: 'player',
    ENEMYV: 'enemyV',
    ENEMYH: 'enemyH',
    BACKGROUND: 'background',
    BULLETP: 'bulletP',
    BULLETE: 'bulletE',
    FUEL: 'fuel',
    ENEMY: 'enemy',
    HUD: 'HUD',
    SENSOR: 'sensor'
  },
  PLAYER: {
    IMAGE: 'player-32x32',
    WIDTH: 32,
    HEIGHT: 32,
    FRAMEWIDTH: 32,
    FRAMEHEIGHT: 32,
    SPEED: 2.0
  },
  BULLETP: {
    IMAGE: 'bulletP-16x16',
    WIDTH: 16,
    HEIGHT: 16,
    FRAMEWIDTH: 16,
    FRAMEHEIGHT: 16,
    SPEEDX: 0,
    SPEEDY: -2,
    FREQUENCY: 75,
    WORTH: 50
  },
  ENEMYV: {
    IMAGE: 'enemy1-32x32',
    WIDTH: 32,
    HEIGHT: 32,
    FRAMEWIDTH: 32,
    FRAMEHEIGHT: 32,
    SPEEDX: 0,
    SPEEDY: 2,
    FREQUENCY: 100,
    WORTH: 50
  },
  ENEMYH: {
    IMAGE: 'enemy2-32x32',
    WIDTH: 32,
    HEIGHT: 32,
    FRAMEWIDTH: 32,
    FRAMEHEIGHT: 32,
    SPEEDX: -1,
    SPEEDY: 1,
    FREQUENCY: 100,
    WORTH: 50
  },
  BULLETE: {
    IMAGE: 'bulletE-16x16',
    WIDTH: 16,
    HEIGHT: 16,
    FRAMEWIDTH: 16,
    FRAMEHEIGHT: 16
  },
  SENSOR: {

  },
  FUEL: {
    IMAGE: 'fuel-32x32',
    WIDTH: 32,
    HEIGHT: 32,
    FRAMEWIDTH: 32,
    FRAMEHEIGHT: 32,
    SPEEDX: 0,
    SPEEDY: 1,
    FREQUENCY: 300,
    LOSS: 1,
    MIN: 0
  },
  BACKGROUND: {
    IMAGE: 'bgb-480x800',
    WIDTH: 480,
    HEIGHT: 800
  },
  SCORES: {},
  BOTS: {
    HUMAN: 'human',
    RANDOM: 'random'
  },
  RECEIVED_MESSAGES: {
    MOVELEFT: 'moveleft',
    MOVERIGHT: 'moveright',
    RELEASERIGHT: 'releaseright',
    RELEASELEFT: 'releaseleft',
    GETPLAYERPOS: 'getplayerpos',
    HANDSHAKE: 'handshake',
    WHICHBOT: 'whichbot',
    BOTCREATED: 'botcreated',
    GETGAMESTATE: 'getgamestate',
    GETBOARD: 'getboard',
    RELEASEARROWKEY: 'releasearrowkey'
  },
  SENT_MESSAGES: {
    PRESSEDLEFTKEY: 'pressedLeftKey',
    RELEASEDLEFTKEY: 'releasedLeftKey',
    PRESSEDRIGHTKEY: 'pressedRightKey',
    RELEASEDRIGHTKEY: 'releasedRightKey',
    RELEASEDARROWKEY: 'releasedArrowKey',
    PLAYERPOS: 'playerpos',
    HANDSHAKE: 'handshake',
    BOT: 'bot',
    IDLE: 'idle',
    GAMESTATE: 'gamestate',
    GAMEOVER: 'gameover'
  }
};
