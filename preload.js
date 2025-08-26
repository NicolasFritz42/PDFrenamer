const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  listPdfs: (folderPath) => ipcRenderer.invoke('list-pdfs', folderPath),
  renamePdf: (oldPath, newPath) => ipcRenderer.invoke('rename-pdf', { oldPath, newPath }),
});
