import React from 'react';
import './Interface.css';

const Interface: React.FC = () => (
  <div className="interface-container">
    <div className="interface-section">
      <h5 className='under-title'>Paramètres de jeu</h5>
      <p className='under-text'>Section pour configurer les paramètres du jeu.</p>
    </div>
    <div className="interface-layout">
      <div className="interface-tapis">
        <h5 className='under-title'>Tapis de Roulette</h5>
        <p className='under-text'>Zone interactive pour saisir les numéros.</p>
      </div>
      <div className="interface-historique">
        <h5 className='under-title'>Historique des Sorties</h5>
        <p className='under-text'>Affichage des numéros précédents.</p>
      </div>
    </div>
  </div>
);

export default Interface;
