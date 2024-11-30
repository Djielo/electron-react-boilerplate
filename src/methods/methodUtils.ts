// src/methods/methodUtils.ts
import axios from 'axios';

export interface MethodConfig {
    baseMise: number;
    maxPerte: number;
    maxGain: number;
    tempsMax: number;
}

export interface MethodResult {
    success: boolean;
    profit: number;
}

export const updateCapital = async (newValue: number): Promise<boolean> => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/capital', {
            capital_actuel: newValue
        });
        return response.data.status === 'success';
    } catch (error) {
        console.error("Erreur lors de la mise à jour du capital:", error);
        return false;
    }
};

export const getOccurrences = async (): Promise<{ [key: string]: number }> => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/occurrences');
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des occurrences:", error);
      return {};
    }
  };

export const addToHistory = async (number: string): Promise<boolean> => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/historique', {
            number: number
        });
        return response.data.status === 'success';
    } catch (error) {
        console.error("Erreur lors de l'ajout à l'historique:", error);
        return false;
    }
};

export const getHistory = async (): Promise<string[]> => {
    try {
        const response = await axios.get('http://127.0.0.1:5000/historique');
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'historique:", error);
        return [];
    }
};

export const getCurrentCapital = async (): Promise<number | null> => {
    try {
        const response = await axios.get('http://127.0.0.1:5000/capital');
        return response.data.capital_actuel;
    } catch (error) {
        console.error("Erreur lors de la récupération du capital:", error);
        return null;
    }
};