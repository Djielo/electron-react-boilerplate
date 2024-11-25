import React, { useState, useEffect } from 'react';
import './Interface.css';
import RouletteTable from './RouletteTable';
import { FaUndo } from 'react-icons/fa';
import axios from 'axios';

const Interface: React.FC = () => {
  const [history, setHistory] = useState<number[]>([]);

  // Charger l'historique au montage du composant
  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
  }, [history]);

  // Fonction pour récupérer l'historique depuis le backend
  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/historique');
      setHistory(response.data);
    } catch (error) {
    }
  };

  // Fonction pour gérer les clics sur le tapis
  const handleCellClick = async (value: string | number) => {
    if (typeof value === 'number') {
      try {
        // Envoyer le numéro au backend
        await axios.post('http://127.0.0.1:5000/historique', {
          number: value
        });
        // Rafraîchir l'historique
        await fetchHistory();
      } catch (error) {
        console.error('Erreur lors de l\'ajout à l\'historique:', error);
      }
    }
  };

  // Fonction pour annuler la dernière saisie
  const handleUndo = async () => {
    if (history.length > 0) {
      try {
        // Créer un nouvel historique sans le dernier élément
        const newHistory = history.slice(0, -1);

        // Envoyer le nouvel historique au backend
        await axios.post('http://127.0.0.1:5000/historique/update', {
          history: newHistory
        });

        // Mettre à jour l'état local
        setHistory(newHistory);
      } catch (error) {
        console.error('Erreur lors de l\'annulation:', error);
      }
    }
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