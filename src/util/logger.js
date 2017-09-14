'use strict';

/* eslint-disable no-console */

function logInfo(message) {
  console.log(`[${message}]`);
}

function logChat(name, message) {
  console.log(` <${name}> ${message}`);
}

function logRaw(message) {
  console.log(message);
}

function logError(message) {
  console.error(message);
}

/* eslint-enable no-console */

module.exports = {
  logError,
  logInfo,
  logChat,
  logRaw
};
