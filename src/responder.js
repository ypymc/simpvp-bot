'use strict';

const createMarkov = require('markov');
const fs = require('fs');
const EventEmitter = require('events');

const chatOnlyStream = require('./util/chat-only-stream');
const { logFilePath, markovOrder } = require('./config');
const { logInfo } = require('./util/logger');

class Responder extends EventEmitter {
  constructor() {
    super();
    this.markov = createMarkov(markovOrder);
    const logStream = chatOnlyStream(fs.createReadStream(logFilePath));

    logInfo('Beginning chat seed process...');
    this.markov.seed(logStream, this._onSeedComplete.bind(this));
  }

  getResponse(input) {
    return this.markov
      .respond(input)
      .join(' ');
  }

  _onSeedComplete() {
    logInfo('Seed complete');
    this.emit('ready');
  }
}

module.exports = Responder;
