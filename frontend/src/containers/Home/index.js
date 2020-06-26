import React, { useState, useEffect } from 'react';
import Nav from '../../components/Nav';
import Main from '../../components/Main';
import { nuovaFigura, getAlert, getPeso, getPunteggio } from '../../utiles';
import useInterval from '../../hooks/useInterval';
import Esaminatori from '../../components/Esaminatori';
import { fetchClassifica, inizializzaClassifica } from '../../services/punteggio';
import config from '../../config';
import './styles.scss';

const PESO_MAX = 150;
let socket = new WebSocket(config.WEBSOCKET_URL);

const App = () => {
  const [nome, setNome] = useState('');
  const [pool, setPool] = useState({});
  const [figure, setFigure] = useState([]);
  const [punteggio, setPunteggio] = useState('');
  const [formError, setFormErorr] = useState({});
  const [classifica, setClassifica] = useState([]);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    fetchClassifica()
      .then(({ punteggi }) => {
        setClassifica(punteggi);
      });
  }, []);

  useEffect(() => {
    if (isTimerActive === 'resetting') {
      setFigure([]);
      setIsTimerActive(true);
    }
  }, [isTimerActive]);

  useInterval(() => {

    figure.push(nuovaFigura(figure.length));

    const peso = getPeso(figure);

    setFigure([...figure]);

    if (peso > PESO_MAX) {
      stopGame();
      return alert('Hai perso, gli oggetti nel contenitore sono troppo pesanti!');
    }

  }, 1000, isTimerActive)

  // Fermo il timer, gli oggetti rimangono visibili
  const stopGame = () => {
    setPunteggio(getPunteggio(figure));
    setIsTimerActive(false)
  }

  const newGame = () => {
    socket.send(JSON.stringify({ type: 'init' }))
    setPool({});
    setPunteggio(0);
    setIsTimerActive('resetting');
  }

  const onFiguraClick = indexFigura => {

    if (!isTimerActive) return;

    if (Object.keys(pool).length < 3) {
      const figura = figure[indexFigura];

      setPool({ ...pool, [figura.id]: { ...figura, start: new Date().getTime() } })

      socket.send(JSON.stringify({ ...figura, type: 'archiviazione' }))

      figura.inProgress = true;
      setFigure(figure);
    }
  }

  const onSubmit = async e => {
    e.preventDefault();

    try {

      socket.send(JSON.stringify(({ nome, punteggio, type: 'salvataggio' })))

    } catch (error) {
      setFormErorr(error);
    }
  }

  const onInitClick = async () => {
    const { punteggi } = await inizializzaClassifica();
    setClassifica(punteggi);
  }

  socket.onmessage = function (event) {
    

    let object;
    try {
      object = JSON.parse(event.data);
    } catch (error) {

    }

    switch (object.type) {
      case 'archiviato':

        if (isTimerActive !== true) return;

        if (pool[object.id]) {
          console.log('Tempo di archiviazione: ', pool[object.id].peso, 'tempo passato: ', Math.abs((new Date().getTime() - pool[object.id].start) / 1000))
        }

        delete pool[object.id];
        setPool({ ...pool });
        setFigure(figure.map(figura => {
          if (figura.id === object.id) {
            figura.archived = true;
          }
          return figura;
        }));

        break;
      case 'salvataggio':

        if (object.status === 'fail') {
          setFormErorr(object);
        } else {
          
          setClassifica(object.punteggi);
          setNome('');
        }

        break;
      default:
        break;
    }

  }

  return (
    <div className="home">
      <main>
        <div className="top">
          <h1>Coding test</h1>
          <p>
            Gli oggetti sono disegnati su una canvas e animati usando <code>requestAnimationFrame</code> in modo da avere un amizazione fluida e a ~60fps. La fisica del gioco è molto semplice, la velocita degli oggetti come il colore e l'altezza dell'oggetto sono random, la larghezza è 1/5 della larghezza della canvas, la collision controlla solo se ho raggiunto la stessa posizione dell'ogetto sotto.
          </p>
          <div className="controls">
            <button id="test-btn-new" onClick={newGame}>Nuova partita</button>
            <button id="test-btn-stop" onClick={stopGame}>Stop partita</button>
            {(!isTimerActive && figure.length > 0) && (
              <form className="form" onSubmit={onSubmit}>
                <input type="text" name="nome" value={nome} onChange={e => setNome(e.target.value)} />
                <button id="test-btn-submit" type="submit">Salva partita</button>
                <span>{formError.message}</span>
              </form>
            )}

          </div>
        </div>
        <Main items={figure} onFiguraClick={onFiguraClick} />
        <Esaminatori pool={pool} numeroEsaminatori={3} />
      </main>
      <nav>
        <Nav
          alert={getAlert(figure)}
          pesoCorrente={getPeso(figure)}
          pesoArchivitao={getPunteggio(figure)}
          onInitClick={onInitClick}
          classifica={classifica}
        />
      </nav>
    </div>
  );
}

export default App;
