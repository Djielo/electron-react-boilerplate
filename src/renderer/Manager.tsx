import React, { useState, useEffect } from 'react';
import './Manager.css';
import { FaCog, FaPencilAlt, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { useGameContext } from './contexts/GameContext';

// Interface pour la configuration des méthodes
interface MethodConfig {
    baseMise: number;
}

const Manager: React.FC = () => {
    // États pour le capital
    const [capitalInitial, setCapitalInitial] = useState(0);
    const [capitalActuel, setCapitalActuel] = useState(0);
    const [newCapital, setNewCapital] = useState('');

    // États pour les méthodes et leur gestion
    const [methods, setMethods] = useState([
        { name: 'Méthode SDC', configured: false, selected: false },
        { name: 'Tiers sur Sixains', configured: false, selected: false },
        { name: 'Chasse aux Numéros', configured: false, selected: false },
    ]);
    const [activeMethod, setActiveMethod] = useState<string | null>(null);
    const [methodConfigs, setMethodConfigs] = useState<{ [key: string]: MethodConfig }>({
        'Chasse aux Numéros': {
            baseMise: 1
        }
    });

    // Context pour la communication avec l'interface
    const { setIsGameRunning, setSelectedMethods } = useGameContext();

    // Effet pour mettre à jour les méthodes sélectionnées dans le contexte
    useEffect(() => {
        const selected = methods.filter(m => m.selected).map(m => m.name);
        setSelectedMethods(selected);
    }, [methods, setSelectedMethods]);

    // Récupérer le capital initial au chargement
    useEffect(() => {
        fetchCapital();
    }, []);

    // Fonction pour récupérer le capital depuis le backend
    const fetchCapital = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/capital');
            const { capital_depart, capital_actuel } = response.data;
            setCapitalInitial(capital_depart);
            setCapitalActuel(capital_actuel);
        } catch (error) {
            console.error("Erreur fetchCapital:", error);
        }
    };

    // Fonction pour mettre à jour le capital
    const handleCapitalChange = async () => {
        const value = parseFloat(newCapital);
        if (!isNaN(value)) {
            try {
                const response = await axios.post('http://127.0.0.1:5000/capital', {
                    capital_depart: value,
                    capital_actuel: value
                });

                if (response.data.status === 'success') {
                    setCapitalInitial(value);
                    setCapitalActuel(value);
                    setNewCapital('');
                }
            } catch (error) {
                console.error("Erreur handleCapitalChange:", error);
            }
        }
    };

    // Calcul du bénéfice
    const benefice = capitalActuel - capitalInitial;
    const beneficePourcentage = capitalInitial !== 0
        ? ((capitalActuel - capitalInitial) / capitalInitial) * 100
        : 0;

    // Gestion des méthodes
    const handleConfigureClick = (methodName: string) => {
        setActiveMethod(methodName);
    };

    const handleSaveConfig = () => {
        if (activeMethod) {
            setMethods((prev) =>
                prev.map((method) =>
                    method.name === activeMethod
                        ? { ...method, configured: true }
                        : method
                )
            );
        }
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

    // Contrôles du jeu
    const handleStart = () => {
        const configuredMethods = methods.filter(m => m.selected && m.configured);
        if (configuredMethods.length > 0) {
            setIsGameRunning(true);
        } else {
            alert("Veuillez sélectionner et configurer au moins une méthode");
        }
    };

    const handleStop = () => {
        setIsGameRunning(false);
    };

    const handleReset = () => {
        setIsGameRunning(false);
        fetchCapital(); // Recharger le capital initial
    };

    return (
        <div className="manager-container">
            {/* Bloc Capital et Sécurité */}
            <div className="manager-capital-security-container">
                <div className="manager-capital">
                    <div className="capital-section">
                        <h5 className="under-title">Suivi du Capital</h5>
                        <p className='under-text'>Capital Initial : {capitalInitial.toFixed(2)} €</p>
                        <p className='under-text'>Capital Actuel : {capitalActuel.toFixed(2)} €</p>
                        <p className='under-text' style={{
                            color: benefice >= 0 ? 'green' : 'red'
                        }}>
                            Bénéfice : {benefice.toFixed(2)}€ ({beneficePourcentage.toFixed(2)}%)
                        </p>
                        <div className="capital-input">
                            <input
                                className='input'
                                type="text"
                                value={newCapital}
                                onChange={(e) => setNewCapital(e.target.value)}
                                placeholder="Nouveau Capital"
                            />
                            <button
                                className='capital-update'
                                onClick={handleCapitalChange}
                            >
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <h5 className="under-title">Contrôles</h5>
                        <div className="security-controls">
                            <label>
                                Temps (min) :
                                <input className="input-security" type="number" value={20} readOnly />
                            </label>
                            <label>
                                Perte max (%) :
                                <input className="input-security" type="number" value={10} readOnly />
                            </label>
                            <label>
                                Gain max (%) :
                                <input className="input-security" type="number" value={10} readOnly />
                            </label>
                        </div>
                        <div className="countdown">20:00</div>
                    </div>
                </div>
            </div>

            {/* Bloc Gestion des Méthodes */}
            <div className="manager-methods-container">
                {/* Méthodes disponibles */}
                <div className="methods-checked">
                    <h5 className="under-title">Gestion des Méthodes</h5>
                    {methods.map((method) => (
                        <div key={method.name} className="method-checked">
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
                                    <FaCheck className='icon-check' />
                                ) : (
                                    <FaCog
                                        className="icon-cog"
                                        onClick={() => handleConfigureClick(method.name)}
                                    />
                                )}
                                <FaPencilAlt
                                    className={`icon-pencil ${method.configured ? 'active' : 'inactive'}`}
                                    onClick={() => {
                                        if (method.configured) {
                                            handleConfigureClick(method.name);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Méthodes sélectionnées */}
                <div className="methods-selected">
                    <h5 className="under-title">Méthodes Sélectionnées</h5>
                    <div className='selected-container'>
                        {methods.filter(m => m.selected).length > 0 ? (
                            methods.filter(m => m.selected).map((method) => (
                                <div key={method.name} className="method-selected">
                                    <span>{method.name}</span>
                                </div>
                            ))
                        ) : (
                            <p className='under-text'>Aucune méthode sélectionnée.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Commandes */}
            <div className="manager-commands">
                <button onClick={handleStart}>Démarrer</button>
                <button onClick={handleStop}>Arrêter</button>
                <button onClick={handleReset}>Réinitialiser</button>
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
                        <h5 className="under-title">Configuration pour {activeMethod}</h5>
                        {activeMethod === 'Chasse aux Numéros' && (
                            <div className="config-input mt-4">
                                <label className="under-text">
                                    Mise de base (€) :
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.5"
                                        className="input ml-2"
                                        value={methodConfigs[activeMethod]?.baseMise || 1}
                                        onChange={(e) => setMethodConfigs(prev => ({
                                            ...prev,
                                            [activeMethod]: {
                                                baseMise: parseFloat(e.target.value) || 1
                                            }
                                        }))}
                                    />
                                </label>
                            </div>
                        )}
                        <div className="config-buttons mt-6">
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