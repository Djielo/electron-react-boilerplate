import React, { useState } from 'react';
import './Interface.css';
import RouletteTable from './RouletteTable';
import { FaUndo } from 'react-icons/fa';


const Interface: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);

  const handleCellClick = (value: string | number) => {
    setHistory((prev) => [...prev, value.toString()]);
    console.log('Clic sur', value);
  };

  const handleUndo = () => {
    setHistory((prev) => prev.slice(0, -1)); // Annule la dernière entrée
  };

  return (
    <div className="interface-container">
      <div className="interface-section">
        <h5 className='under-title'>Paramètres de jeu</h5>
        <p className='under-text'>Section pour configurer les paramètres du jeu.</p>
      </div>
      <div className="interface-layout">
        <div className="interface-tapis">
          <h5 className='under-title tapis-title'>Tapis de Roulette</h5>
          <div className='tapis'>
            <RouletteTable onCellClick={handleCellClick} />
            <button className="undo-button" onClick={handleUndo}>
              <FaUndo />
            </button>
          </div>
        </div>
        <div className="interface-historique">
          <h5 className='under-title'>Historique des Sorties</h5>
          <p className='under-text'>Affichage des numéros précédents : {history.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default Interface;
