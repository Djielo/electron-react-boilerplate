import React, { useState } from 'react';
import './Manager.css';
import { FaCog, FaPencilAlt, FaCheck } from 'react-icons/fa';

const Manager: React.FC = () => {
  const [methods, setMethods] = useState([
    { name: 'Méthode SDC', configured: false, selected: false },
    { name: 'Tiers sur Sixains', configured: false, selected: false },
    { name: 'Chasse aux Numéros', configured: false, selected: false },
  ]);

  const [capitalInitial, setCapitalInitial] = useState(30);
  const [capitalActuel, setCapitalActuel] = useState(30);
  const [newCapital, setNewCapital] = useState('');

  const [activeMethod, setActiveMethod] = useState<string | null>(null);

  const handleCapitalChange = () => {
    const value = parseFloat(newCapital);
    if (!isNaN(value)) {
      setCapitalInitial(value);
      setCapitalActuel(value);
    }
  };

  const handleConfigureClick = (methodName: string) => {
    setActiveMethod(methodName);
  };

  const handleSaveConfig = () => {
    setMethods((prev) =>
      prev.map((method) =>
        method.name === activeMethod ? { ...method, configured: true } : method
      )
    );
    setActiveMethod(null);
  };

  const handleCancelConfig = () => {
    setActiveMethod(null);
  };

  const handleSelectChange = (methodName: string) => {
    setMethods((prev) =>
      prev.map((method) =>
        method.name === methodName
          ? { ...method, selected: !method.selected }
          : method
      )
    );
  };

  const selectedMethods = methods.filter((method) => method.selected);

  return (
    <div className="manager-container">
      {/* Bloc Capital et Sécurité */}
      <div className="manager-capital-security-container">
        <div className="manager-capital-security">
          <div className="capital-section">
            <h5 className="under-title">Suivi du Capital</h5>
            <p>Capital Initial : {capitalInitial} €</p>
            <p>Capital Actuel : {capitalActuel} €</p>
            <p style={{ color: 'green' }}>Bénéfice : +0.00€ (+0.00%)</p>
            <div className="capital-input">
              <input
                type="text"
                value={newCapital}
                onChange={(e) => setNewCapital(e.target.value)}
                placeholder="Nouveau Capital"
              />
              <button onClick={handleCapitalChange}>Mettre à jour</button>
            </div>
          </div>
          <div className="security-section">
            <h5 className="under-title">Contrôles</h5>
            <label>
              Temps (min) :
              <input type="number" value={20} readOnly style={{ marginLeft: '10px' }} />
            </label>
            <br />
            <label>
              Perte max (%) :
              <input type="number" value={10} readOnly style={{ marginLeft: '10px' }} />
            </label>
          </div>
        </div>
      </div>

      {/* Bloc Gestion des Méthodes */}
      <div className="manager-methods-container">
        {/* Méthodes disponibles */}
        <div className="methods-checked">
          <h5 className="under-title">Gestion des Méthodes</h5>
          {methods.map((method) => (
            <div key={method.name} className="method-item">
              <label className="method-select">
                <input
                  type="checkbox"
                  checked={method.selected}
                  onChange={() => handleSelectChange(method.name)}
                />
              </label>
              <span className="method-name">{method.name}</span>
              <div className="method-icons">
                {method.configured ? (
                  <FaCheck className="icon-check" />
                ) : (
                  <FaCog
                    className="icon-cog"
                    onClick={() => handleConfigureClick(method.name)}
                  />
                )}
                <FaPencilAlt
                  className={`icon-pencil ${method.configured ? 'active' : 'inactive'}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Méthodes sélectionnées */}
        <div className="methods-selected">
          <h5 className="under-title">Méthodes Sélectionnées</h5>
          {selectedMethods.length > 0 ? (
            selectedMethods.map((method) => (
              <div key={method.name} className="selected-item">
                <span>{method.name}</span>
              </div>
            ))
          ) : (
            <p>Aucune méthode sélectionnée.</p>
          )}
        </div>
      </div>

      {/* Commandes */}
      <div className="manager-commands">
        <button>Démarrer</button>
        <button>Arrêter</button>
        <button>Réinitialiser</button>
      </div>

      {/* Footer */}
      <div className="manager-footer">
        <span className="game-status">Statut : En attente</span>
        <span className="help-icon">❓</span>
      </div>

      {/* Modale de Configuration */}
      {activeMethod && (
        <div className="config-modal">
          <div className="config-modal-content">
            <h5>Configuration pour {activeMethod}</h5>
            <p>Ajoutez ici les paramètres spécifiques à cette méthode.</p>
            <div className="config-buttons">
              <button onClick={handleSaveConfig}>Valider</button>
              <button onClick={handleCancelConfig}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manager;
