const { v4: uuidV4 } = require('uuid');
const LRU = require('lru-cache');
const WebSocket = require('ws');
const handler = require('./handler');

const wss = new WebSocket.Server({ port: 4000 });

// Storage temporaneo, in un progetto piu grande forse avrei usato redis
var cache = new LRU(500);

wss.on('connection', function connection(ws) {

  const connectionId = uuidV4();

  cache.set(`${connectionId}_punteggio`, 0);
  cache.set(`${connectionId}_inProgress`, {});

  ws.on('message', async message => handler(ws, cache, connectionId, message));
});

module.exports = {
  handler
};
