import React from 'react';
import './styles.scss';

const Esaminatori = ({ pool, numeroEsaminatori }) => {
  const renderEsaminatori = () => {

    const components = [];
    const attivi = Object.keys(pool).length;

    for (let i = 0; i < numeroEsaminatori; i++) {
      components.push(
        <div key={`${i}-key`} className={`esaminatore ${i < attivi && 'active'}`}>
          {i < attivi ? 'In uso' : 'Disponibile'}
        </div>
      )
    }

    return components;
  }

  return (
    <div className="esaminatori-container">
      <h2>Esaminatori</h2>
      <div className="esaminatori">{renderEsaminatori()}</div>
    </div>
  );
}

export default Esaminatori;