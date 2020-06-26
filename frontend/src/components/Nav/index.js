import React from 'react';
import List from '../List';
import './styles.scss';

const NavBar = ({ pesoCorrente, pesoArchivitao, alert, classifica, onInitClick }) => {
  return (
    <div className="navbar">
      <div className="peso-container">
        <div className="peso">
          <h2>Peso archiviato</h2>
          <span>{pesoArchivitao}</span>
        </div>
      </div>
      <div className="peso-container">
        <div className="peso">
          <h2>Peso attuale (max 150kg)</h2>
          <span className={`${alert}`}>{pesoCorrente}</span>
        </div>
      </div>
      <div className="classifica">
          <h2>Classifica</h2>
        <List items={classifica} />
      </div>
      <div className="init-classifica">
        <button onClick={onInitClick}>Inizializza Classifica</button>
      </div>
    </div>
  )
}

export default NavBar;