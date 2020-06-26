const axios = require('axios');

// Questa dovrebbe essere env
const API_URL = 'http://app.francescovenica.com/api';

module.exports = {
  archivia: (connectionId, cache, object) => new Promise((resolve, reject) => {

    // Aggiungo l'oggetto nel pool inProgress
    const inProgress = cache.get(`${connectionId}_inProgress`);
    inProgress[object.id] = true;
    cache.set(`${connectionId}_inProgress`, inProgress);

    const peso = parseInt(object.peso);
    if (parseInt(peso) >= 0) {
      setTimeout(() => {

        // Elimino l'oggetto nel pool inProgress
        const inProgress = cache.get(`${connectionId}_inProgress`);
        if (inProgress && inProgress[object.id]) {
          delete inProgress[object.id];
          cache.set(`${connectionId}_inProgress`, inProgress);

          const punteggio = cache.get(`${connectionId}_punteggio`);
          cache.set(`${connectionId}_punteggio`, punteggio + peso);

          return resolve(object.id);
        }

        return reject({
          id: object.id,
          messaggio: 'L\'oggetto non è presente nel pool, forse la partita è finita',
        });
      }, peso * 1000)
    } else {

      delete inProgress[object.id];
      return reject({
        id: object.id,
        inProgress,
        punteggio
      });
    }
  }),
  completa: object => axios.post(`${API_URL}/punteggio`, object)
}