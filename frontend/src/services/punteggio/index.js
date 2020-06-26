import config from '../../config';

export const fetchClassifica = () => fetch(`${config.API_URL}/classifica`).then(response => response.json());
export const inizializzaClassifica = () => fetch(`${config.API_URL}/clear`).then(response => response.json());
export const addPunteggio = data => fetch(`${config.API_URL}/punteggio`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
}).then(response => response.json());