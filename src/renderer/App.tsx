import React from 'react';
import Manager from './Manager';
import Interface from './Interface';
import './App.css'; // Chargement du style global

const App: React.FC = () => (
  <div className="app-container">
    <h3 className="app-title">Gestionnaire de Méthodes de Roulette</h3>
    <div className="app-layout">
      <Manager />
      <Interface />
    </div>
  </div>
);

export default App;
