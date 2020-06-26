const logger = require('../../utils/logger')
const { validateToken, decodeToken } = require('../../utils')

module.exports = (req, res, next) => {

  const { authorization } = req.headers;
  if (!authorization) {
    logger('auth', 'Token mancante');
    return res.sendStatus(401);
  }

  if (validateToken(authorization)) {

    // Salvo l'utente nell'oggetto req
    req.user = decodeToken(authorization);

    return next();
  } else {
    return res.sendStatus(401);
  }

  return next();
}