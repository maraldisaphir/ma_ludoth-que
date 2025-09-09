async function loadGames() {
  const response = await fetch('data/jeux/collection.json');
  const jeux = await response.json();
  const container = document.getElementById('games');
  const search = document.getElementById('search');
  function render(list) {
    container.innerHTML = '';
    list.forEach(j => {
      const card = document.createElement('div');
      card.className = 'bg-white dark:bg-gray-800 p-4 rounded shadow';
      card.innerHTML = `
        <img src="${j.photo}" alt="${j.nom}" class="w-full h-32 object-cover mb-2 rounded">
        <h2 class="font-bold text-lg">${j.nom}</h2>
        <p>${j.nb_joueurs_min}-${j.nb_joueurs_max} joueurs | ${j.age} | ${j.duree}</p>
        <p class="italic">${j.types.join(', ')}</p>
        <p>${j.description}</p>
      `;
      container.appendChild(card);
    });
  }
  render(jeux);
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    render(jeux.filter(j => j.nom.toLowerCase().includes(q) || j.description.toLowerCase().includes(q)));
  });
}
loadGames();
