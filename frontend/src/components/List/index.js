import React from 'react';
import ListItem from './ListItem'
import './styles.scss';

const List = ({ items = [] }) => {
  return (
    <div className="list">
      {items.map(punteggio => (
        <ListItem
          key={punteggio.uuid}
          title={punteggio.nome}
          record={punteggio.punteggio} />
      ))}
    </div>
  )
}

export default List;