'use strict';

const readline = require('readline');
const Responder = require('./responder');
const GameClient = require('./game-client');
const { logInfo } = require('./util/logger');

const RESPOND_ODDS = 100; // i.e. "one in X"
const GREET_ODDS = 30;

const responder = new Responder();
responder.on('ready', onResponderReady);

let gameClient;
let ready = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', onUserInput);

function onSpawn() {
  ready = true;
}

// We don't start connecting to the game until after the training is done, since
// it's very CPU-intensive; running them in parallel created a bunch of errors
// with the sign-in handshake.
function onResponderReady() {
  gameClient = new GameClient();
  gameClient.on('spawn', onSpawn);
  gameClient.on('playerJoin', onPlayerJoin);
  gameClient.on('chat', onChat);
}

function shouldRespond(message) {
  return (
    gameClient.mentionsPlayer(message) ||
    random(RESPOND_ODDS) === 1
  );
}

function random(max) {
  return Math.floor(Math.random() * max) + 1;
}

/**
 * Delay for an amount of time ~ roughly ~ commensurate with the time it would
 * take to type a message.
 */
function waitForTyping(message) {
  const charactersPerSecond = 400 / 60; // 400 cpm
  const timeoutSeconds = random(3) + (message.length / charactersPerSecond);

  logInfo(`Waiting ${timeoutSeconds} seconds`);

  return new Promise((resolve) => {
    setTimeout(resolve, timeoutSeconds * 1000);
  });
}

function onChat({ message }) {
  if (!ready) return;
  if (!shouldRespond(message)) return;

  const response = responder.getResponse(message);
  logInfo(`Decided to respond to ${message} with ${response}`);

  waitForTyping(response)
    .then(() => gameClient.chat(response));
}

function onPlayerJoin({ username }) {
  if (!ready) return;

  if (random(GREET_ODDS) !== 1) return;

  logInfo(`Decided to greet ${username}`);
  const response = responder.getResponse(username);

  waitForTyping(response)
    .then(() => gameClient.chat(response));
}

function onUserInput(text) {
  if (!ready) return;
  gameClient.chat(text);
}
