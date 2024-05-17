// Fonction pour sélectionner un objet aléatoirement
function getRandomPlace(data) {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
}

// Fonction pour afficher les données sur la page web
function displayPlaceDetails(place) {
    const placeDetailsDiv = document.getElementById('place-details');

    placeDetailsDiv.innerHTML = `
        <h2>${place.title}</h2>
        <p><strong>Adresse :</strong> ${place.address}</p>
        <p><strong>Catégories :</strong> ${place.categoryName}</p>
        <p><strong>Note :</strong> ${place.totalScore} (${place.reviewsCount} avis)</p>
        <p><strong>URL :</strong> <a href="${place.url}" target="_blank">${place.url}</a></p>`;
}

function loadAndDisplayRandomPlace() {
    fetch('bar.json')
        .then(response => response.json())
        .then(data => {
            const randomPlace = getRandomPlace(data);
            displayPlaceDetails(randomPlace);
        })
        .catch(error => console.error('Erreur lors du chargement du fichier JSON:', error));
}

// Appeler la fonction pour charger et afficher les données lors du chargement de la page
document.addEventListener('DOMContentLoaded', loadAndDisplayRandomPlace);