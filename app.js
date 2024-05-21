var nbrbar = 0;

function updateValueDisplay() {
            var rangeInput = document.getElementById('rangeInput');
            var valueDisplay = document.getElementById('valueDisplay');
            valueDisplay.textContent = rangeInput.value + "m";
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; 
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; 
}

function getNearbyPlaces(userLocation, data) {
    return data.filter(place => {
        const distance = calculateDistance(
            userLocation.latitude, userLocation.longitude,
            place.location.lat, place.location.lng
        );
        return distance <= document.getElementById('rangeInput').value;
    });
}

function getRandomPlace(data) {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
}

function displayPlaceDetails(place) {
    const placeDetailsDiv = document.getElementById('place-details');

    placeDetailsDiv.innerHTML = `
        <center><h2>${place.title}</h2></center>
        <hr>
        <p><strong>Adresse :</strong> ${place.address}</p>
        <p><strong>Note :</strong> ${place.totalScore} (${place.reviewsCount} avis)</p>
        <p><strong>URL :</strong> <a href="${place.url}" target="_blank">${place.url}</a></p>
        <hr><p><strong>Nombre de bar dans la zone : </strong>${nbrbar}</p>`;
}

let placesData = null;

function loadPlacesData() {
    return fetch('bar.json')
        .then(response => response.json())
        .then(data => {
            placesData = data;
            return data;
        })
        .catch(error => {
            console.error('Erreur lors du chargement du fichier JSON:', error);
            throw error;
        });
}

function loadAndDisplayRandomNearbyPlace() {
    if (!placesData) {
        console.error('Les données des bars ne sont pas encore chargées.');
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        console.log(userLocation)
        const nearbyPlaces = getNearbyPlaces(userLocation, placesData);
        nbrbar = nearbyPlaces.length
        if (nbrbar > 0) {
            const randomPlace = getRandomPlace(nearbyPlaces);
            displayPlaceDetails(randomPlace);
        } else {
            console.warn('Aucun bar trouvé dans le rayon defini.');
            document.getElementById('place-details').innerHTML = '<center><p>Aucun bar trouvé dans le rayon défini.</p></center>';
        }
    }, error => {
        console.error('Erreur de géolocalisation:', error);
        document.getElementById('place-details').innerHTML = '<center><p>Erreur de géolocalisation. Impossible de trouver votre position.</p></center>';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadPlacesData().then(loadAndDisplayRandomNearbyPlace);
});

document.getElementById('reload-btn').addEventListener('click', loadAndDisplayRandomNearbyPlace);
