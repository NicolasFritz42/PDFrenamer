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
              <span>${pdf}</span>
              <button onclick="viewPdf('${folderPath}', this)">Voir</button>
              <button onclick="promptRename('${folderPath}', this)">Renommer</button>
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

// Ouvrir le PDF avec l'application système
async function viewPdf(folderPath, button) {
  const pdfName = button.parentNode.querySelector('span').textContent.trim()
  try {
    const pdfPath = folderPath + '/' + pdfName;
    console.log("Ouverture du PDF :", pdfPath);
    await window.electronAPI.openPdfWithSystem(pdfPath);
  } catch (error) {
    console.error("Erreur lors de l'ouverture du PDF :", error);
    Swal.fire({
      title: 'Erreur !',
      text: `Impossible d'ouvrir le PDF : ${error}`,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}

// Renommer un PDF
async function promptRename(folderPath, button) {
  const pdfName = button.parentNode.querySelector('span').textContent.trim()
  const result = await Swal.fire({
    title: 'Renommer le PDF',
    input: 'text',
    inputValue: pdfName.replace('.pdf', ''),
    inputPlaceholder: 'Nouveau nom (sans extension)',
    showCancelButton: true,
    confirmButtonText: 'Renommer',
    cancelButtonText: 'Annuler',
    inputValidator: (value) => {
      if (!value) {
        return 'Vous devez entrer un nom !';
      }
    }
  });

  if (result.isConfirmed && result.value) {
    const newName = result.value;
    const oldPath = folderPath + '/' + pdfName;
    const newPath = folderPath + '/' + `${newName}.pdf`;
    try {
      await window.electronAPI.renamePdf(oldPath, newPath);
      Swal.fire({
        title: 'Succès !',
        text: 'PDF renommé avec succès !',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        button.parentNode.querySelector('span').textContent = `${newName}.pdf`
      });
    } catch (err) {
      Swal.fire({
        title: 'Erreur !',
        text: `Erreur : ${err}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
}
