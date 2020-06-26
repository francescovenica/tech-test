const express = require('express');
const svcPunteggio = require('../service/punteggio');
const logger = require('../utils/logger');

const router = express.Router();
let db = [];

/**
 * 
 * Pseudo code, il logger è un console.log, ipotizzo di avere un servizio async anche se in questo caso non serve
 * uso async/await che wrappo in un try/catch per loggare l'eventuale errore
 * 
 */
router.post('/punteggio', async (req, res, next) => {
  const { body } = req;
  if (!svcPunteggio.validateInput(body)) {
    logger('route:punteggio', { message: 'Input invalido' })
    return res.status(400).send({
      status: 'fail',
      message: 'Input non valido'
    });
  }

  try {
    svcPunteggio.savePunteggio(db, body);
  } catch (error) {
    logger('route:punteggio', error);
    throw error;
  }

  return res.send({ punteggi: db });
});

// Prendo tutti i valori
router.get('/classifica', function (req, res, next) {
  return res.send({ punteggi: db });
});

// REsetto i valori
router.get('/clear', function (req, res, next) {
  db = [];
  return res.send({ punteggi: db });
});

module.exports = router;
