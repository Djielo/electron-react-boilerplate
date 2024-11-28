// src/renderer/contexts/GameContext.tsx

import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

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

    return (
        <GameContext.Provider value={{
            isGameRunning,
            setIsGameRunning,
            selectedMethods,
            setSelectedMethods,
            methodConfigs,
            setMethodConfigs
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