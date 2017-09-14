'use strict';

const { Transform } = require('stream');

class ChatStream extends Transform {
  _transform(chunk, encoding, callback) {
    const replaced = chunk
      .toString()
      .split('\n')
      .map(line => line
        .replace(/^<[^>]+> /, '')
        .replace(/^[a-zA-Z0-9_]+ joined the game$/, '')
        .replace(/^[a-zA-Z0-9_]+ left the game$/, ''))
      .filter(line => line !== '')
      .join('\n');

    callback(null, replaced);
  }
}

/**
 * @param {Stream} stream A readable stream to be transformed (e.g. the output
 * of a minecraft log file)
 * @returns {Stream} A new stream, containing only the messages themselves — no
 * player names or metadata
 */
function chatOnlyStream(stream) {
  const chatStream = new ChatStream();
  stream.pipe(chatStream);
  return chatStream;
}

module.exports = chatOnlyStream;
