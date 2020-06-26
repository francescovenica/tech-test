import React from 'react';
import './styles.scss';

const ListItem = ({ title, record }) => {
  return (
    <div className="list-item">
      <span className="nome">{title}</span>
      <span className="record">{record}</span>
    </div>
  )
}

export default ListItem;