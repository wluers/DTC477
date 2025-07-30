// I'm making a website using mapbox gl js.
//  I want to have a map that shows country border lines but no location labels.
// The website is a guess the country game. On the right side, I want to float a text area with radio buttons.
// I want the site to automatically outline and highlight a polygon of the country the user is supposed to guess, then have four random country name options with radio buttons for the user to try and guess the correct country.
//  If they guess correctly, add one point to their score. Label their score "streak:" 
// Use an array with nested objects indicating 5 countries with their geocoordinates for the user to guess from.
// Randomly select a country from the array for each guess.







// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JhY2l2YW5kZXJ2b3J0IiwiYSI6ImNtOGdsenFsNjA1OGkybnBybXU5ZTE3d3QifQ.Mxus8mWcJHP-c3HdY1JqVg';

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map', // HTML container id
  style: 'mapbox://styles/gracivandervort/cm8f2vr1h00w001soe6zj77v4', // Map style
  center: [0, 20], // Initial map center
  zoom: 2.5, // Initial zoom level
});

// Array of country data with geo-coordinates (simplified for 5 countries)
const countries = [
  { name: 'Brazil', coordinates: [[-74.0, -33.75, -33.75, 0.0]] },
  { name: 'Germany', coordinates: [[6.0, 50.0, 10.0, 51.0]] },
  { name: 'Australia', coordinates: [[112.0, -44.0, 155.0, -10.0]] },
  { name: 'France', coordinates: [[-5.0, 41.0, 9.0, 51.0]] },
  { name: 'Japan', coordinates: [[122.0, 24.0, 153.0, 45.0]] },
];

let score = 0; // User's score

// Function to get a random country
function getRandomCountry() {
  const randomIndex = Math.floor(Math.random() * countries.length);
  return countries[randomIndex];
}

// Function to display options and highlight the correct country
function displayQuestion() {
  const correctCountry = getRandomCountry();
  const options = [correctCountry.name];

  // Add three random countries to the options array
  while (options.length < 4) {
    const randomCountry = getRandomCountry().name;
    if (!options.includes(randomCountry)) {
      options.push(randomCountry);
    }
  }

  // Shuffle options
  options.sort(() => Math.random() - 0.5);

  // Display options as radio buttons
  const optionsContainer = document.querySelector('.options');
  optionsContainer.innerHTML = '';
  options.forEach((option) => {
    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.name = 'country';
    radioButton.value = option;
    const label = document.createElement('label');
    label.textContent = option;
    optionsContainer.appendChild(radioButton);
    optionsContainer.appendChild(label);
    optionsContainer.appendChild(document.createElement('br'));
  });

  // Set the correct answer
  const correctAnswer = correctCountry.name;

  // Add event listener to radio buttons
  document.querySelectorAll('input[name="country"]').forEach((button) => {
    button.addEventListener('change', (event) => {
      const selectedCountry = event.target.value;
      if (selectedCountry === correctAnswer) {
        score++;
        document.getElementById('score').textContent = score;
      }
      // Highlight the country polygon
      highlightCountry(correctCountry);
    });
  });
}

// Function to highlight the country polygon
function highlightCountry(country) {
  // Clear any previous highlights
  if (map.getSource('highlight')) {
    map.removeLayer('highlight');
    map.removeSource('highlight');
  }

  // Create polygon for the country
  const countryBounds = country.coordinates;
  const geoJson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [countryBounds],
        },
      },
    ],
  };

  // Add the country polygon to the map
  map.addSource('highlight', {
    type: 'geojson',
    data: geoJson,
  });

  map.addLayer({
    id: 'highlight',
    type: 'fill',
    source: 'highlight',
    paint: {
      'fill-color': '#f00',
      'fill-opacity': 0.5,
    },
  });
}

// Initialize the game
displayQuestion();
