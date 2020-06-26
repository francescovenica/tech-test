const svcArchiviazione = require('./services/archiviazione');

const handler = async (ws, cache, connectionId, message) => {
  
  let obejct;
  // parsing dell'oggetto inviato
  try {
    object = JSON.parse(message)
  } catch (error) {
    return ws.send(JSON.stringify({ type: 'error', message: 'parsing_error' }));
  }
  
  switch (object.type) {
    case 'archiviazione':

      const inProgress = cache.get(`${connectionId}_inProgress`);
      if (Object.keys(inProgress).length > 2) {
        return ws.send(JSON.stringify({ type: 'error', message: 'too_busy' }));
      } else {

        try {
          const id_archiviato = await svcArchiviazione.archivia(connectionId, cache, object);

          return ws.send(JSON.stringify({ type: 'archiviato', message: 'peso_archiviato', id: id_archiviato }));
        } catch (error) {
          console.log('error', error);
          return ws.send(JSON.stringify({ type: 'error', message: 'error' }));
        }
      }

      break;
    case 'init':

      cache.set(`${connectionId}_punteggio`, 0);
      cache.set(`${connectionId}_inProgress`, {});

      break;
    case 'salvataggio':

      const { data: { punteggi } } = await svcArchiviazione.completa({
        punteggio: cache.get(`${connectionId}_punteggio`),
        nome: object.nome
      });

      cache.del(`${connectionId}_punteggio`);
      cache.del(`${connectionId}_inProgress`);

      ws.send(JSON.stringify({ type: 'salvataggio', message: 'partita_salvata', punteggi }));

      break;
    default:
      break;
  }
}

module.exports = handler;