document.getElementById('gameForm').addEventListener('submit', e => {
  e.preventDefault();
  const jeu = {
    nom: document.getElementById('nom').value,
    nb_joueurs_min: parseInt(document.getElementById('min').value),
    nb_joueurs_max: parseInt(document.getElementById('max').value),
    age: document.getElementById('age').value,
    duree: document.getElementById('duree').value,
    types: document.getElementById('types').value.split(',').map(t => t.trim()),
    remarque: document.getElementById('remarque').value,
    description: document.getElementById('description').value,
    photo: document.getElementById('photo').files[0]?.name || ''
  };
  console.log('Jeu enregistré', jeu);
  alert('Jeu enregistré (voir console)');
});
