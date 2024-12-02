import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import useGameContext from '../renderer/contexts/GameContext';

interface ChasseNumGameProps {
  baseMise: number;
  onComplete: (success: boolean) => void;
}

const ChasseNumGame = forwardRef<{ handleNouveauNumero: (numero: string) => void }, ChasseNumGameProps>(
  ({ baseMise = 1, onComplete }, ref) => {
    const { history, occurrences } = useGameContext();
    const [phase, setPhase] = useState<'observation' | 'jeu'>('observation');
    const [numerosMises, setNumerosMises] = useState<number[]>([]);
    const [toursObservation, setToursObservation] = useState(24);
    const [toursJeu, setToursJeu] = useState(12);
    const [isActive, setIsActive] = useState(true);

    const rows: number[][] = [
      [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
      [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
      [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
    ];

    const calculerToursRestants = (historique: number[]) => {
      if (historique.length >= 24) {
        return {
          phase: 'jeu' as const,
          tours: 12
        };
      } else {
        return {
          phase: 'observation' as const,
          tours: 24 - historique.length
        };
      }
    };

    // Initialisation de l'état
    useEffect(() => {
      const { phase: nouvellePhase, tours } = calculerToursRestants(history);
      setPhase(nouvellePhase);
      if (nouvellePhase === 'observation') {
        setToursObservation(tours);
      } else {
        setToursJeu(tours);
        analyserHistorique(history.slice(-24));
      }
    }, []);

    const analyserHistorique = (derniers24Tours: number[]) => {
      const numerosMultiples = Object.entries(occurrences)
        .filter(([_, count]) => count >= 2)
        .map(([numero, _]) => parseInt(numero))
        .sort((a, b) => {
          const numA = a === 37 ? '00' : a.toString();
          const numB = b === 37 ? '00' : b.toString();
          const indexA = history.indexOf(a);
          const indexB = history.indexOf(b);
          return indexA - indexB;
        });

      setNumerosMises(numerosMultiples.slice(0, 3));

      if (phase === 'observation' && numerosMultiples.length > 0) {
        setPhase('jeu');
        setToursJeu(12);
      } else if (numerosMultiples.length === 0) {
        onComplete(false);
        setIsActive(false);
      }
    };

    const handleNouveauNumero = async (numero: string) => {
      const numeroInt = numero === '00' ? 37 : parseInt(numero);
      const newHistorique = [...history, numeroInt];
      const { phase: nouvellePhase, tours } = calculerToursRestants(newHistorique);

      if (nouvellePhase === 'observation') {
        setPhase('observation');
        setToursObservation(tours);
      } else {
        if (phase === 'observation') {
          setPhase('jeu');
          setToursJeu(12);
          analyserHistorique(newHistorique.slice(-24));
        } else {
          setToursJeu(prev => prev - 1);
          if (numerosMises.includes(numeroInt)) {
            onComplete(true);
            setIsActive(false);
          } else if (tours <= 1) {
            onComplete(false);
            setIsActive(false);
          }
        }
      }
    };

    useImperativeHandle(ref, () => ({
      handleNouveauNumero
    }));

    const getObservationStatus = (numero: string) => {
      const numeroInt = numero === '00' ? '37' : numero;
      const count = occurrences[numeroInt] || 0;

      if (!isActive) return '';

      if (phase === 'jeu' && numerosMises.includes(parseInt(numeroInt))) {
        return 'selected';
      }

      if (phase === 'observation') {
        if (count >= 3) return 'more';
        if (count === 2) return 'twice';
      }

      return '';
    };

    return (
      <div className="game-content">
        {/* Section Info avec le style d'origine */}
        <div className="info-section">
          <div className="info-row">
            <span className="info-label">Phase :</span>
            <span className="info-value">
              {phase === 'observation' ? 'Observation' : 'Jeu'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Tours restants :</span>
            <span className="info-value">
              {phase === 'observation' ? toursObservation : toursJeu}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Mise de base :</span>
            <span className="info-value">{baseMise}€</span>
          </div>
        </div>

        {/* Grille d'observation */}
        <div className="observation-grid">
          <div className="observation-zero-zone">
            <div className={`observation-cell ${getObservationStatus('0')}`}>
              0
              <br />
              ({occurrences['0'] || 0})
            </div>
            <div className={`observation-cell ${getObservationStatus('00')}`}>
              00
              <br />
              ({occurrences['37'] || 0})
            </div>
          </div>

          <div className="observation-numbers-zone">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="observation-row">
                {row.map((number: number) => (
                  <div
                    key={number}
                    className={`observation-cell ${getObservationStatus(number.toString())}`}
                  >
                    {number}
                    <br />
                    ({occurrences[number.toString()] || 0})
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Section des numéros joués */}
        {phase === 'jeu' && numerosMises.length > 0 && (
          <div className="numeros-mises">
            <p className="numeros-mises-title">Numéros joués :</p>
            <div className="numeros-mises-list">
              {numerosMises.map(numero => (
                <div key={numero} className="numero-mise">
                  {numero === 37 ? '00' : numero}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default ChasseNumGame;