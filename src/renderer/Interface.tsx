import React from 'react';
import './Interface.css';
import RouletteTable from './RouletteTable';

const Interface: React.FC = () => (
  <div className="interface-container">
    <div className="interface-section">
      <h5 className='under-title'>Paramètres de jeu</h5>
      <p className='under-text'>Section pour configurer les paramètres du jeu.</p>
    </div>
    <div className="interface-layout">
      <div className="interface-tapis">
        <h5 className='under-title'>Tapis de Roulette</h5>
        <RouletteTable onCellClick={(value) => console.log('Clic sur', value)} />
      </div>
      <div className="interface-historique">
        <h5 className='under-title'>Historique des Sorties</h5>
        <p className='under-text'>Affichage des numéros précédents.</p>
      </div>
    </div>
  </div>
);

export default Interface;
