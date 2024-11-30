// src/renderer/contexts/GameContext.tsx

import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import axios from 'axios';

interface MethodConfig {
    baseMise: number;
}

interface GameContextType {
    // États du jeu
    isGameRunning: boolean;
    setIsGameRunning: Dispatch<SetStateAction<boolean>>;
    
    // Méthodes actives
    selectedMethods: string[];
    setSelectedMethods: Dispatch<SetStateAction<string[]>>;
    
    // Configurations des méthodes
    methodConfigs: { [key: string]: MethodConfig };
    setMethodConfigs: Dispatch<SetStateAction<{ [key: string]: MethodConfig }>>;

    // Historique et occurrences
    history: number[];
    setHistory: Dispatch<SetStateAction<number[]>>;
    occurrences: { [key: string]: number };
    
    // Fonctions utilitaires
    updateHistory: (newHistory: number[]) => Promise<void>;
    addToHistory: (number: number) => Promise<void>;
    undoLastNumber: () => Promise<void>;
    updateOccurrences: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
    const [methodConfigs, setMethodConfigs] = useState<{ [key: string]: MethodConfig }>({
        'Chasse aux Numéros': {
            baseMise: 1
        }
    });

    // Nouveaux états
    const [history, setHistory] = useState<number[]>([]);
    const [occurrences, setOccurrences] = useState<{ [key: string]: number }>({});

    // Charger l'historique initial
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const historyResponse = await axios.get('http://127.0.0.1:5000/historique');
            setHistory(historyResponse.data);

            const occurrencesResponse = await axios.get('http://127.0.0.1:5000/occurrences');
            setOccurrences(occurrencesResponse.data);
        } catch (error) {
            console.error('Erreur lors du chargement initial:', error);
        }
    };

    // Fonction pour mettre à jour l'historique
    const updateHistory = async (newHistory: number[]) => {
        try {
            await axios.post('http://127.0.0.1:5000/historique/update', {
                history: newHistory
            });
            setHistory(newHistory);
            await updateOccurrences();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'historique:', error);
        }
    };

    // Fonction pour ajouter un numéro
    const addToHistory = async (number: number) => {
        try {
            await axios.post('http://127.0.0.1:5000/historique', {
                number: number
            });
            setHistory(prev => [...prev, number]);
            await updateOccurrences();
        } catch (error) {
            console.error('Erreur lors de l\'ajout à l\'historique:', error);
        }
    };

    // Fonction pour annuler le dernier numéro
    const undoLastNumber = async () => {
        if (history.length > 0) {
            try {
                const newHistory = history.slice(0, -1);
                await updateHistory(newHistory);
            } catch (error) {
                console.error('Erreur lors de l\'annulation:', error);
            }
        }
    };

    // Fonction pour mettre à jour les occurrences
    const updateOccurrences = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/occurrences');
            setOccurrences(response.data);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des occurrences:', error);
        }
    };

    return (
        <GameContext.Provider value={{
            isGameRunning,
            setIsGameRunning,
            selectedMethods,
            setSelectedMethods,
            methodConfigs,
            setMethodConfigs,
            history,
            setHistory,
            occurrences,
            updateHistory,
            addToHistory,
            undoLastNumber,
            updateOccurrences
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
};

export default GameContext;