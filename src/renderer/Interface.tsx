import React, { useState, useEffect, useRef } from 'react';
import RouletteTable from './RouletteTable';
import ChasseNumGame from '../methods/ChasseNumGame';
import { useGameContext } from './contexts/GameContext';
import { FaUndo } from 'react-icons/fa';
import axios from 'axios';
import './Interface.css';

const Interface: React.FC = () => {
  const [history, setHistory] = useState<number[]>([]);
  const { isGameRunning, selectedMethods, methodConfigs } = useGameContext();
  const gameRef = useRef<{ handleNouveauNumero: (numero: string) => void } | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/historique');
      setHistory(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
    }
  };

  const handleCellClick = async (value: string | number) => {
    if (typeof value === 'number') {
      try {
        await axios.post('http://127.0.0.1:5000/historique', {
          number: value
        });

        // Si la méthode est active, informer ChasseNumGame
        if (isGameRunning && gameRef.current) {
          gameRef.current.handleNouveauNumero(value.toString());
        }

        await fetchHistory();
      } catch (error) {
        console.error('Erreur lors de l\'ajout à l\'historique:', error);
      }
    }
  };

  const handleUndo = async () => {
    if (history.length > 0) {
      try {
        const newHistory = history.slice(0, -1);
        await axios.post('http://127.0.0.1:5000/historique/update', {
          history: newHistory
        });
        setHistory(newHistory);
      } catch (error) {
        console.error('Erreur lors de l\'annulation:', error);
      }
    }
  };

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
        <h5 className='under-title'>
          {isGameRunning && selectedMethods.length > 0
            ? `Jeu en cours : ${selectedMethods[0]}`
            : 'Veuillez sélectionner vos méthodes et cliquer sur Démarrer'
          }
        </h5>

        {isGameRunning && selectedMethods.includes('Chasse aux Numéros') && (
          <ChasseNumGame
            ref={gameRef}
            baseMise={methodConfigs['Chasse aux Numéros']?.baseMise || 1}
            onComplete={(success) => {
              console.log("Méthode terminée:", success);
            }}
          />
        )}
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
                  color: 'white',
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