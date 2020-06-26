const api = require("../api");

const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", api);

describe('Api route', () => {
  it('deve aggiungere un nuovo punteggio', done => {
    request(app)
      .post("/api/punteggio")
      .send({ nome: "Nome", punteggio: 12 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(({ body }) => {
        expect(body.punteggi).toHaveLength(1);
        done();
      });
  });
  it('deve restituire la classifica', done => {
    request(app)
      .get("/api/classifica")
      .then(({ body }) => {
        expect(body.punteggi).toHaveLength(1);
        done();
      });
  });
  it('deve inizializzare la classifica', done => {
    request(app)
      .get("/api/clear")
      .then(({ body }) => {
        expect(body.punteggi).toHaveLength(0);
        done();
      });
  });
})