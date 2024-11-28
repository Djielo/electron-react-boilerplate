import React from 'react';
import Manager from './Manager';
import Interface from './Interface';
import { GameProvider } from './contexts/GameContext';
import './App.css';

const App: React.FC = () => (
    <GameProvider>
        <div className="app-container">
            <h3 className="app-title">Gestionnaire de Méthodes de Roulette</h3>
            <div className="app-layout">
                <Manager />
                <Interface />
            </div>
        </div>
    </GameProvider>
);

export default App;