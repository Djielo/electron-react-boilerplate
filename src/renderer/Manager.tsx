import React, { useState, useEffect } from 'react';
import './Manager.css';
import { FaCog, FaPencilAlt, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import useGameContext, { Method } from './contexts/GameContext';

const Manager: React.FC = () => {
    // Import du context avec tout ce dont on a besoin
    const {
        isGameRunning,
        setIsGameRunning,
        methods,
        toggleMethodSelection,
        updateMethodStatus,
        methodConfigs,
        updateMethodConfig,
        updateHistory
    } = useGameContext();

    // États locaux qui ne concernent que le Manager
    const [activeMethod, setActiveMethod] = useState<string | null>(null);
    const [capitalInitial, setCapitalInitial] = useState(0);
    const [capitalActuel, setCapitalActuel] = useState(0);
    const [newCapital, setNewCapital] = useState('');
    const [tempsMin, setTempsMin] = useState<number>(20);
    const [perteMax, setPerteMax] = useState<number>(10);
    const [gainMax, setGainMax] = useState<number>(10);

    // Pour stocker temporairement la configuration pendant l'édition
    const [tempConfig, setTempConfig] = useState<number | null>(null);

    // Charger le capital initial
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

                if (response.data.data) {
                    setCapitalInitial(response.data.data.capital_depart);
                    setCapitalActuel(response.data.data.capital_actuel);
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

    // Gestion des configurations de méthodes
    const handleConfigureClick = (methodName: string) => {
        setActiveMethod(methodName);
        // Initialiser la configuration temporaire
        setTempConfig(methodConfigs[methodName]?.baseMise || 0.01);
    };

    const handleSaveConfig = async () => {
        if (activeMethod && tempConfig !== null) {
            try {
                const newConfigs = {
                    ...methodConfigs,
                    [activeMethod]: {
                        baseMise: tempConfig,
                        configured: true
                    }
                };
                await updateMethodConfig(newConfigs);
                setActiveMethod(null);
                setTempConfig(null);
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
                alert('Erreur lors de la sauvegarde');
            }
        }
    };

    const handleCancelConfig = () => {
        setActiveMethod(null);
        setTempConfig(null);
    };

    // Contrôles du jeu
    const handleStart = () => {
        const configuredMethods = methods.filter((m: Method) => m.selected && m.configured);
        if (configuredMethods.length > 0) {
            setIsGameRunning(true);
        } else {
            alert("Veuillez sélectionner et configurer au moins une méthode");
        }
    };

    const handleStop = () => {
        setIsGameRunning(false);
    };

    const handleReset = async () => {
        try {
            // Arrêter le jeu
            setIsGameRunning(false);

            // Vider l'historique
            await updateHistory([]);

            // Récupérer et mettre à jour le capital
            const response = await axios.get('http://127.0.0.1:5000/capital');
            const lastCapital = response.data.capital_actuel;

            await axios.post('http://127.0.0.1:5000/capital', {
                capital_depart: lastCapital,
                capital_actuel: lastCapital
            });

            setCapitalInitial(lastCapital);
            setCapitalActuel(lastCapital);

            // Réinitialiser les paramètres de sécurité
            setTempsMin(20);
            setPerteMax(10);
            setGainMax(10);

        } catch (error) {
            console.error('Erreur lors de la réinitialisation:', error);
            alert('Erreur lors de la réinitialisation');
        }
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
                                <input
                                    className="input-security"
                                    type="number"
                                    value={tempsMin}
                                    onChange={(e) => setTempsMin(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                            </label>
                            <label>
                                Perte max (%) :
                                <input
                                    className="input-security"
                                    type="number"
                                    value={perteMax}
                                    onChange={(e) => setPerteMax(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                            </label>
                            <label>
                                Gain max (%) :
                                <input
                                    className="input-security"
                                    type="number"
                                    value={gainMax}
                                    onChange={(e) => setGainMax(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                            </label>
                        </div>
                        <div className="countdown">{String(tempsMin).padStart(2, '0')}:00</div>
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
                                    onChange={() => toggleMethodSelection(method.name)}
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
                        {methods.filter((m: Method) => m.selected).length > 0 ? (
                            methods.filter((m: Method) => m.selected).map((method: Method) => (
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
                                        min="0.01"
                                        step="0.01"
                                        className="input ml-2"
                                        value={tempConfig ?? methodConfigs[activeMethod]?.baseMise ?? 0.01}
                                        onChange={(e) => setTempConfig(parseFloat(e.target.value) || 0.01)}
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