import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1500, // Largeur fixe
        height: 650
        , // Hauteur fixe
        resizable: false, // Empêcher le redimensionnement
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, // Pour sécuriser les interactions
        },
    });

    // Charger l'interface utilisateur
    mainWindow.loadURL('http://localhost:1212');
});
