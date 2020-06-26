const { v4: uuidV4 } = require('uuid');

module.exports = {
  savePunteggio: async (db, body) => {
    body.uuid = uuidV4();
    db.push(body);
  },
  validateInput: body => body.nome && body.punteggio >= 0,
}