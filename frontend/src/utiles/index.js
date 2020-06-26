export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// solo colori chiari
export const randomColor = () => {
  var letters = 'BCDEF'.split('');
  var color = '';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};

export const nuovaFigura = offset => ({
  y: 0,
  offset,
  id: randomId(),
  color: randomColor(),
  peso: randomNumber(2, 10),
  speed: randomNumber(3, 5),
  height: randomNumber(100, 150),
});

export const randomId = (length = 6) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const getPunteggio = f => f
  .map(figura => figura.archived === true && figura.peso)
  .reduce((a, b) => a + b, 0);

export const getPeso = items => items
  .map(figura => figura.archived !== true ? figura.peso : 0)
  .reduce((a, b) => a + b, 0);

export const getAlert = f => {
  const peso = getPeso(f);

  if (peso > 50) {
    return 'medium';
  }

  if (peso > 75) {
    return 'high';
  }

  return 'low';
}