# Tech test

# Generale

L'app è composta da:
- frontend in react servito da nginx
- backend in nodejs (express) per gestire la classifica
- worker in nodejs (ws) per gestire il socker

# Installazione

Installare le 3 app con `yarn install` o `npm i`

Per lanciare l'app in locale aggiornare le seguenti variabili:
`./worker/services/archiviazione.js`: `API_URL` con questo valore: `http://localhost:4001/api`;
`./frontend/src/config.js`: `API_URL` con questo valore: `http://localhost:4001/api` `WEBSOCKET_URL` con questo valore: `ws://localhost:4000`

Dalla root del progetto lanciare:
`docker-compose up -d`