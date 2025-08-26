document.getElementById('selectFolder').addEventListener('click', async () => {
  try {
    const folderPath = await window.electronAPI.selectFolder();
    if (folderPath) {
      console.log("Chemin du dossier sélectionné :", folderPath);
      document.getElementById('selectedFolder').textContent = folderPath;

      const pdfFiles = await window.electronAPI.listPdfs(folderPath);
      console.log("Fichiers PDF trouvés :", pdfFiles);

      const pdfList = document.getElementById('pdfList');
      pdfList.innerHTML = '<h2>Liste des PDFs :</h2>';

      if (pdfFiles.length === 0) {
        pdfList.innerHTML += '<p>Aucun fichier PDF trouvé dans ce dossier.</p>';
      } else {
        pdfFiles.forEach(pdf => {
          const pdfItem = document.createElement('div');
          pdfItem.innerHTML = `
            <p>
              ${pdf}
              <button onclick="viewPdf(${folderPath}', '${pdf}')">Voir</button>
              <button onclick="promptRename('${folderPath}', '${pdf}')">Renommer</button>
            </p>
          `;
          pdfList.appendChild(pdfItem);
        });
      }
    }
  } catch (error) {
    console.error("Erreur lors de la sélection du dossier :", error);
  }
});

// Afficher le contenu du PDF
async function viewPdf(folderPath, pdfName) {
  try {
    const pdfPath = folderPath + '/' + pdfName;
    console.log("Chemin du PDF :", pdfPath);

    /* const loadingTask = pdfjsLib.getDocument(pdfPath);
    const pdfDocument = await loadingTask.promise;
    const page = await pdfDocument.getPage(1);
    const scale = 1.5;
    const viewport = page.getViewport({ scale: scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
    const pdfViewer = document.getElementById('pdfViewer');
    pdfViewer.innerHTML = '';
    pdfViewer.appendChild(canvas); */
  } catch (error) {
    console.error("Erreur lors de l'affichage du PDF :", error);
  }
}

// Renommer un PDF
async function promptRename(folderPath, pdfName) {
  const newName = prompt("Nouveau nom (sans extension) :", pdfName.replace('.pdf', ''));
  if (newName) {
    const oldPath = path.join(folderPath, pdfName);
    const newPath = path.join(folderPath, `${newName}.pdf`);
    try {
      await window.electronAPI.renamePdf(oldPath, newPath);
      alert('PDF renommé avec succès !');
      location.reload();
    } catch (err) {
      alert(`Erreur : ${err}`);
    }
  }
}
