import React, { useState } from 'react';
import './Interface.css';
import RouletteTable from './RouletteTable';
import { FaUndo } from 'react-icons/fa';

const Interface: React.FC = () => {
  const [history, setHistory] = useState<number[]>([]);

  // Fonction pour gérer les clics sur le tapis
  const handleCellClick = (value: string | number) => {
    if (typeof value === 'number') {
      setHistory((prev) => [...prev, value]);
      console.log('Numéro ajouté à l’historique:', value);
    } else {
      console.log('Clic ignoré (non-numérique):', value);
    }
  };

  // Fonction pour annuler la dernière saisie
  const handleUndo = () => {
    setHistory((prev) => prev.slice(0, -1));
    console.log('Dernière entrée supprimée');
  };

  // Fonction pour déterminer la couleur d'un numéro
  const getNumberColor = (number: number) => {
    if (number === 0 || number === 37) return 'green';
    const redNumbers = [
      1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
    ];
    return redNumbers.includes(number) ? 'red' : 'black';
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
          <div className="tapis">
            <RouletteTable onCellClick={handleCellClick} />
            <button className="undo-button" onClick={handleUndo}>
              <FaUndo />
            </button>
          </div>
        </div>
        <div className="interface-historique">
          <h5 className='under-title'>Historique des Sorties</h5>
          <div className="historique-numbers">
            {history.map((number, index) => (
              <div
                key={index}
                className="historique-number"
                style={{
                  backgroundColor: getNumberColor(number),
                  color: 'white', // Texte toujours blanc
                }}
              >
                {number === 37 ? '00' : number}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Interface;
