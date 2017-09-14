# simpvp-bot

A robot designed to emulate a productive member of society in
[SimPvP](https://simplicitypvp.net).

## Contributing

Help make this bot smarter by contributing your own Minecraft logs! Please!

```
$ bin/extract-logs >> data/master.log
```

This script redacts anything that's not in public chat — so your private
messages and coords won't be sent.

Gladly accepting pull requests to make the bot smarter, too. Some ideas:

- Replace the Markov chain with something more interesting (neural net?)
- Bake in some fun predefined behaviors

## Usage

### Prerequisites

- [Node.js](https://nodejs.org/en/) (probably >= 8.0)

After cloning this repo, install all dependencies:

```
$ npm install
```

### Running

To start the full bot and connect to SimPvP:

```
$ npm start
```

To start an interactive session for testing out bot responses:

```
$ npm run interactive
```

Note that training the Markov model currently takes a few minutes on each boot -
and possibly more on slower computers.

### Configuration

Your deployment environment must have two environment variables set:

- `MC_USER` - Your Minecraft username or Mojang account email
- `MC_PASS` - Your Minecraft password

Other optional configuration includes:

- `MC_SERVER_HOST` - Minecraft server host to connect to (default: simpvp.net)
- `MC_SERVER_PORT` - Minecraft server port to connect to (default: 25565)
- `LOG_FILE_PATH` - Location of training data (default: data/master.log)

For local use, you can set these inline:

```
MC_USER=ypy MC_PASS=hunter2 npm start
```

### Testing

As of the time of writing there are no unit tests, but pull requests will be
rejected if they don't pass the linter:

```
$ npm run lint
```
