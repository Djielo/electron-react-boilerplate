import React, { useState, useEffect } from 'react';
import './Manager.css';
import { FaCog, FaPencilAlt, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const Manager: React.FC = () => {
    // États pour le capital
    const [capitalInitial, setCapitalInitial] = useState(0);
    const [capitalActuel, setCapitalActuel] = useState(0);
    const [newCapital, setNewCapital] = useState('');

    // États pour les méthodes
    const [methods, setMethods] = useState([
        { name: 'Méthode SDC', configured: false, selected: false },
        { name: 'Tiers sur Sixains', configured: false, selected: false },
        { name: 'Chasse aux Numéros', configured: false, selected: false },
    ]);
    const [activeMethod, setActiveMethod] = useState<string | null>(null);

    // Récupérer le capital initial au chargement
    useEffect(() => {
        fetchCapital();
    }, []);

    // Fonction pour récupérer le capital depuis le backend
    const fetchCapital = async () => {
        try {
            alert('🔄 DÉBUT : Récupération du capital actuel');
            const response = await axios.get('http://127.0.0.1:5000/capital');
            console.log("Réponse GET capital:", response.data);
            const { capital_depart, capital_actuel } = response.data;

            setCapitalInitial(capital_depart);
            setCapitalActuel(capital_actuel);
            alert(`✅ SUCCÈS : Capital récupéré\nDépart: ${capital_depart}€\nActuel: ${capital_actuel}€`);
        } catch (error) {
            console.error("Erreur fetchCapital:", error);
            alert(`❌ ERREUR : Impossible de récupérer le capital : ${error}`);
        }
    };

    // Fonction pour mettre à jour le capital
    const handleCapitalChange = async () => {
        const value = parseFloat(newCapital);
        if (!isNaN(value)) {
            try {
                alert(`🚀 DÉBUT : Envoi du nouveau capital ${value}€`);
                console.log("Tentative d'envoi du capital:", value);

                const response = await axios.post('http://127.0.0.1:5000/capital', {
                    capital_depart: value,
                    capital_actuel: value
                });

                console.log("Réponse POST capital:", response.data);

                if (response.data.status === 'success') {
                    setCapitalInitial(value);
                    setCapitalActuel(value);
                    setNewCapital('');
                    alert(`✅ SUCCÈS : Capital mis à jour à ${value}€`);
                }
            } catch (error) {
                console.error("Erreur handleCapitalChange:", error);
                alert(`❌ ERREUR : Échec de la mise à jour du capital : ${error}`);
            }
        }
    };

    // Calcul du bénéfice
    const benefice = capitalActuel - capitalInitial;
    const beneficePourcentage = capitalInitial !== 0
        ? ((capitalActuel - capitalInitial) / capitalInitial) * 100
        : 0;

    // Fonctions pour la gestion des méthodes
    const handleConfigureClick = (methodName: string) => {
        setActiveMethod(methodName);
    };

    const handleSaveConfig = () => {
        setMethods((prev) =>
            prev.map((method) =>
                method.name === activeMethod
                    ? { ...method, configured: true }
                    : method
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

    // Filtrer les méthodes sélectionnées
    const selectedMethods = methods.filter((method) => method.selected);

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
                        {selectedMethods.length > 0 ? (
                            selectedMethods.map((method) => (
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
                        <p className='under-text'>Ajoutez ici les paramètres spécifiques à cette méthode.</p>
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