'use strict';

const readline = require('readline');
const Responder = require('./responder');
const { logChat } = require('./util/logger');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const responder = new Responder();

responder.on('ready', () => {
  rl.on('line', (line) => {
    const response = responder.getResponse(line);
    logChat('bot', response);
  });
});

