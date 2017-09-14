'use strict';

const EventEmitter = require('events');
const mineflayer = require('mineflayer');

const { logInfo, logChat } = require('./util/logger');
const {
  user, pass, serverHost, serverPort
} = require('./config');

class GameClient extends EventEmitter {
  constructor() {
    super();
    this._connect();
    this._spawned = false;
  }

  chat(message) {
    this._bot.chat(message);
  }

  mentionsPlayer(message) {
    const pattern = new RegExp(this._bot.username, 'i');
    return Boolean(message.match(pattern));
  }

  _connect() {
    logInfo('Connecting to server...');

    const bot = mineflayer.createBot({
      host: serverHost,
      port: serverPort,
      username: user,
      password: pass
    });

    bot.on('spawn', this._onSpawn.bind(this));
    bot.on('chat', this._onChat.bind(this));
    bot.on('playerJoined', this._onPlayerJoin.bind(this));
    bot.on('playerLeft', this._onPlayerLeave.bind(this));
    bot.on('whisper', this._onWhisper.bind(this));
    bot.on('kicked', this._onKicked.bind(this));
    bot.on('end', this._onEnd.bind(this));

    this._bot = bot;
  }

  _waitThenReconnect() {
    setTimeout(() => {
      logInfo('Attempting to reconnect');
      this._connect();
    }, 30000);
  }

  _onSpawn() {
    const playerNames = Object.keys(this._bot.players).join(', ');
    logInfo(`Spawned! Online players: ${playerNames}`);

    this.emit('spawn');
    this._spawned = true;
  }

  _onChat(username, message) {
    logChat(username, message);

    if (username === this._bot.username) return;

    this.emit('chat', { username, message });
  }

  _onPlayerJoin(player) {
    if (!this._spawned) return;

    const { username } = player;

    logInfo(`${username} joined`);
    this.emit('playerJoin', { username });
  }

  _onPlayerLeave(player) {
    logInfo(`${player.username} left`);
  }

  _onWhisper(username, message) {
    logChat(`WHISPER: ${username}`, message);
  }

  _onKicked(reason) {
    logInfo(`Kicked! ${reason}`);
    this._waitThenReconnect();
  }

  _onEnd() {
    logInfo('Server session ended');
    this._waitThenReconnect();
  }
}

module.exports = GameClient;
