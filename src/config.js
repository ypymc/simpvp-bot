'use strict';

const path = require('path');

const { logError } = require('./util/logger');

const config = {
  user: process.env.MC_USER,
  pass: process.env.MC_PASS,
  serverHost: process.env.MC_SERVER_HOST || 'simpvp.net',
  serverPort: process.env.MC_SERVER_PORT || 25565,
  logFilePath: process.env.LOG_FILE_PATH || path.join(__dirname, '..', 'data', 'master.log'),
  markovOrder: 2
};

Object.keys(config).forEach((key) => {
  if (!config[key]) {
    logError(`WARNING: Missing configuration value: ${key}`);
  }
});

module.exports = config;
