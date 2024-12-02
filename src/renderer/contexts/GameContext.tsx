// src/renderer/contexts/GameContext.tsx

import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import axios from 'axios';

// Interfaces pour le typage
export interface Method {
    name: string;
    configured: boolean;
    selected: boolean;
}

interface MethodConfig {
    baseMise: number;
    configured: boolean;
}

interface GameContextType {
    // États du jeu
    isGameRunning: boolean;
    setIsGameRunning: Dispatch<SetStateAction<boolean>>;

    // Méthodes et leur gestion
    methods: Method[];
    initializeMethods: () => void;
    updateMethodStatus: (methodName: string, configured: boolean) => void;
    toggleMethodSelection: (methodName: string) => void;
    selectedMethods: string[];

    // Configurations des méthodes
    methodConfigs: { [key: string]: MethodConfig };
    setMethodConfigs: Dispatch<SetStateAction<{ [key: string]: MethodConfig }>>;
    updateMethodConfig: (newConfigs: { [key: string]: MethodConfig }) => Promise<void>;

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
    // États du jeu
    const [isGameRunning, setIsGameRunning] = useState(false);

    // États des méthodes
    const [methods, setMethods] = useState<Method[]>([
        { name: 'Méthode SDC', configured: false, selected: false },
        { name: 'Tiers sur Sixains', configured: false, selected: false },
        { name: 'Chasse aux Numéros', configured: false, selected: false },
    ]);

    // État dérivé pour les méthodes sélectionnées
    const selectedMethods = methods.filter((m: Method) => m.selected).map((m: Method) => m.name);

    // États des configurations
    const [methodConfigs, setMethodConfigs] = useState<{ [key: string]: MethodConfig }>({
        'Chasse aux Numéros': {
            baseMise: 1,
            configured: false
        }
    });

    // États pour l'historique et les occurrences
    const [history, setHistory] = useState<number[]>([]);
    const [occurrences, setOccurrences] = useState<{ [key: string]: number }>({});

    // Fonctions de gestion des méthodes
    const initializeMethods = () => {
        setMethods([
            { name: 'Méthode SDC', configured: false, selected: false },
            { name: 'Tiers sur Sixains', configured: false, selected: false },
            { name: 'Chasse aux Numéros', configured: false, selected: false },
        ]);
    };

    const updateMethodStatus = (methodName: string, configured: boolean) => {
        setMethods(prev => prev.map((method: Method) =>
            method.name === methodName
                ? { ...method, configured }
                : method
        ));
    };

    const toggleMethodSelection = (methodName: string) => {
        setMethods(prev => prev.map((method: Method) =>
            method.name === methodName
                ? { ...method, selected: !method.selected }
                : method
        ));
    };

    // Fonctions de gestion des configurations
    const fetchConfig = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/config');
            setMethodConfigs(response.data.methodConfigs);
            // Mettre à jour l'état configured des méthodes
            for (const [methodName, config] of Object.entries<MethodConfig>(response.data.methodConfigs)) {
                updateMethodStatus(methodName, config.configured);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des configurations:', error);
        }
    };

    const updateMethodConfig = async (newConfigs: { [key: string]: MethodConfig }) => {
        try {
            await axios.post('http://127.0.0.1:5000/config', {
                methodConfigs: newConfigs
            });
            setMethodConfigs(newConfigs);
            // Mettre à jour l'état configured des méthodes
            for (const [methodName, config] of Object.entries(newConfigs)) {
                updateMethodStatus(methodName, config.configured);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des configurations:', error);
        }
    };

    // Fonctions de gestion de l'historique
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

    const updateOccurrences = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/occurrences');
            setOccurrences(response.data);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des occurrences:', error);
        }
    };

    // Chargement initial des données
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                await fetchConfig();
                const historyResponse = await axios.get('http://127.0.0.1:5000/historique');
                setHistory(historyResponse.data);
                const occurrencesResponse = await axios.get('http://127.0.0.1:5000/occurrences');
                setOccurrences(occurrencesResponse.data);
            } catch (error) {
                console.error('Erreur lors du chargement initial:', error);
            }
        };

        loadInitialData();
    }, []);

    return (
        <GameContext.Provider value={{
            isGameRunning,
            setIsGameRunning,
            methods,
            initializeMethods,
            updateMethodStatus,
            toggleMethodSelection,
            selectedMethods,
            methodConfigs,
            setMethodConfigs,
            updateMethodConfig,
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

const useGameContext = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
};

export default useGameContext;