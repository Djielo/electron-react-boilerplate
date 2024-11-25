import React from 'react';
import './RouletteTable.css';

interface RouletteTableProps {
  onCellClick: (value: number | string) => void;  // Changé pour correspondre à l'interface
}

const RouletteTable: React.FC<RouletteTableProps> = ({ onCellClick }) => {
  const numbers = [
    [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
  ];
  
  const redNumbers = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

  return (
    <div className="roulette-table">
      <div className="table-grid">
        {/* Zone 0 et 00 avec les numéros */}
        <div className="main-numbers-container">
          <div className="zero-zone">
            <button 
              className="zero-button button-tapis"
              onClick={() => onCellClick(0)}
            >
              0
            </button>
            <button 
              className="zero-button button-tapis"
              onClick={() => onCellClick("00")}
            >
              00
            </button>
          </div>

          {/* Grille principale des numéros avec les colonnes */}
          <div className="numbers-grid">
            {numbers.map((row, rowIndex) => (
              <div key={rowIndex} className="number-row">
                {row.map((number) => (
                  <button
                    key={number}
                    className={`number-button  button-tapis ${redNumbers.has(number) ? 'red' : 'black'}`}
                    onClick={() => onCellClick(number)}
                  >
                    {number}
                  </button>
                ))}
                <button
                  className="column-button button-tapis"
                  onClick={() => onCellClick(`C${3-rowIndex}`)}
                >
                  C{3-rowIndex}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sixains */}
        <div className="sixain-row">
          {Array.from({ length: 6 }, (_, i) => (
            <button
              key={`S${i + 1}`}
              className="sixain-button button-tapis"
              onClick={() => onCellClick(`S${i + 1}`)}
            >
              Sixain {i + 1}
            </button>
          ))}
        </div>

        {/* Douzaines */}
        <div className="dozen-row">
          {['D1', 'D2', 'D3'].map((text) => (
            <button
              key={text}
              className="dozen-button button-tapis"
              onClick={() => onCellClick(text)}
            >
              {text}
            </button>
          ))}
        </div>

        {/* Chances simples */}
        <div className="chances-row">
          {[
            { text: '1-18', className: 'green' },
            { text: 'PAIR', className: 'green' },
            { text: 'R', className: 'red' },
            { text: 'N', className: 'black' },
            { text: 'IMPAIR', className: 'green' },
            { text: '19-36', className: 'green' }
          ].map(({ text, className }) => (
            <button
              key={text}
              className={`chance-button button-tapis ${className}`}
              onClick={() => onCellClick(text)}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouletteTable;