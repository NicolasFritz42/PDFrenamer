const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });

  mainWindow.loadFile('index.html');
});

// Sélectionner un dossier
ipcMain.handle('select-folder', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return canceled ? null : filePaths[0];
});

// Lister les PDFs dans un dossier
ipcMain.handle('list-pdfs', async (event, folderPath) => {
  try {
    const files = fs.readdirSync(folderPath);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    console.log("PDFs trouvés dans le dossier :", pdfFiles);
    return pdfFiles;
  } catch (error) {
    console.error("Erreur lors de la lecture du dossier :", error);
    return [];
  }
});

// Renommer et déplacer un PDF
ipcMain.handle('rename-pdf', async (event, { oldPath, newPath }) => {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
});

// Ouvrir un PDF avec l'application système
ipcMain.handle('open-pdf-with-system', async (event, pdfPath) => {
  try {
    await shell.openPath(pdfPath);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'ouverture du PDF :", error);
    throw error;
  }
});
