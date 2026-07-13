// GRAB HTML ELEMENTS BY ID - Global Scope

// Search Bar
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const searchHistory = document.getElementById('search-history');
const errorMsg = document.getElementById('error-msg');
const loadingMsg = document.getElementById('loading-msg');

// Hero
const weatherIcon = document.getElementById('weather-icon');
const cityName = document.getElementById('city-name');
const temperatureReading = document.getElementById('temperature');
const weatherDescription = document.getElementById('description');
const unitToggleBtn = document.getElementById('unit-toggle');
let isCelsius = true;
let currentTempC = null;

// Stats Row
const humiditystats = document.getElementById('humidity');
const windstats = document.getElementById('wind-speed');
const uvIndexStats = document.getElementById('uv-index');
const forecastRow = document.getElementById('forecast-container');

function showError(message) {
    errorMsg.textContent = message;
    loadingMsg.textContent = '';
}

function clearError() {
    errorMsg.textContent = '';
    loadingMsg.textContent = '';
}

// Get Coordinates for a Particular City
async function getCoordinates(city) {
    try {
        clearError();

        loadingMsg.textContent = 'Loading...';

        let response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);

        let data = await response.json();

        // Validation - Check if the particular city was found
        if (!data.results || data.results.length === 0) {
            showError('City not found. Please try again');
            return null;
        }

        let locationData = {
            name: data.results[0].name,
            country: data.results[0].country,
            latitude: data.results[0].latitude,
            longitude: data.results[0].longitude
        };

        return locationData;

    } catch (error) {
        showError('Something went wrong. Check your connection.');
        return null;
    }
}

// Fetch Weather Data
async function getWeather(lat, lon) {
    try {
        clearError();

        let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`);

        let data = await response.json();

        return data;
    
    } catch (error) {
        showError('Failed to fetch weather data.');
        return null;
    }
}

// Convert Weather Code to Description & Icon
function getWeatherDescription(code) {
    if (code === 0) return { desc: 'Clear Sky', icon: '☀️' };
    if (code <= 3) return { desc: 'Partly Cloudy', icon: '⛅' };
    if (code <= 48) return { desc: 'Foggy', icon: '🌁' };
    if (code <= 55) return { desc: 'Drizzle', icon: '🌧️🌦️' };
    if (code <= 65) return { desc: 'Rain', icon: '🌧️' };
    if (code <= 75) return { desc: 'Snow', icon: '❄️' };
    if (code <= 82) return { desc: 'Rain showers', icon: '🌦️' };
    if (code === 95) return { desc: 'Thunderstorm', icon: '⛈️' };
    return { desc: 'Unknown', icon: '🌡️' };
}

// This handles anything linked to searching - MAIN ENGINE
async function handleSearch() {

    let city = cityInput.value.trim();

    // Validate - Don't search if empty
    if (city === '') {
        showError('Please enter a city name.');
        return;
    }

    clearError();

    // Get Coordinates
    let location = await getCoordinates(city);
    if (!location) return;

    // Get Weather
    let weatherData = await getWeather(location.latitude, location.longitude);
    if (!weatherData) return;

    // Display on page 
    displayCurrentWeather(weatherData, location.name, location.country);
    displayForecast(weatherData.daily);
    saveToHistory(location.name);
}

searchBtn.addEventListener('click', handleSearch);

// Display Current Weather
function displayCurrentWeather(data, name, country) {

    currentTempC = data.current.temperature_2m;

    isCelsius = true;
    unitToggleBtn.textContent = 'Switch to °F';
    
    let weatherInfo = getWeatherDescription(data.current.weather_code);

    // Update all the HTML Elements
    cityName.textContent = `${name}, ${country}`;
    temperatureReading.textContent = `${data.current.temperature_2m}°C`;
    weatherDescription.textContent = weatherInfo.desc;
    weatherIcon.textContent = weatherInfo.icon;
    humiditystats.textContent = `${data.current.relative_humidity_2m}%`;
    windstats.textContent = `${data.current.wind_speed_10m} km/h`;
    uvIndexStats.textContent = `${data.current.uv_index}`;

    loadingMsg.textContent = '';
}

// Display 5 day Forecast
function displayForecast(daily) {

    forecastRow.innerHTML = '';

    // Loop through 5 days
    for (let i = 0; i < 5; i++) {

        let weatherInfo = getWeatherDescription(daily.weather_code[i]);

        let date = new Date(daily.time[i]);
        let dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        let card = document.createElement('div');
        card.className = 'forecast-card';

        card.innerHTML = `
          <p class="forecast-day">${dayName}</p>
          <p class="forecast-icon">${weatherInfo.icon}</p>
          <p class="forecast-high">H: ${daily.temperature_2m_max[i]}°C</p>
          <p class="forecast-low">L: ${daily.temperature_2m_min[i]}°C</p>
        `;

        // Inject card into the forecast container
        forecastRow.appendChild(card);
    }
}

// Building Geolocation Function
function getLocation() {

    // Check if browser supports geolocation
    if (navigator.geolocation) {

        // Ask browser for user's location
        navigator.geolocation.getCurrentPosition(

            // Success - browser delivers coordinates
            async function(position) {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;

                loadingMsg.textContent = 'Loading...';

                let weatherData = await getWeather(lat, lon);
                if (!weatherData) return;

                displayCurrentWeather(weatherData, 'My Location', '');
                displayForecast(weatherData.daily);
            },

            // Failure - user denied location access
            function(error) {
                showError('Location access denied. Please search manually.');
            }
        );

    } else {
        // Browser doesn't support geolocation
        showError('Geolocation is not supported by your browser.');
    }
}

// Unit Toggle
function toggleUnit() {

    // Flip the temp unit
    isCelsius = !isCelsius;

    // If no temp loaded yet, do nothing
    if (currentTempC === null) return;

    // Convert and Display
    if (isCelsius) {
        temperatureReading.textContent = `${currentTempC}°C`;
        unitToggleBtn.textContent = 'Switch to °F';
    } else {
        let fahrenheit = ((currentTempC * 9/5) + 32).toFixed(1);
        temperatureReading.textContent = `${fahrenheit}°F`;
        unitToggleBtn.textContent = 'Switch to °C';
    }
}

unitToggleBtn.addEventListener('click', toggleUnit);

// Save City to History
function saveToHistory(city) {

    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];

    history = history.filter(function(item) {
        return item.toLowerCase() !== city.toLowerCase();
    });

    history.unshift(city);

    if (history.length > 5) {
        history = history.slice(0, 5);
    }

    localStorage.setItem('searchHistory', JSON.stringify(history));

    displayHistory();
}

// Display History Buttons
function displayHistory() {

    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];

    searchHistory.innerHTML = '';

    // Build a button for each city
    history.forEach(function(city) {
        let btn = document.createElement('button');
        btn.textContent = city;
        btn.className = 'history-btn';

        // Clicking button searches that city
        btn.addEventListener('click', function() {
            cityInput.value = city;
            handleSearch();
        });

        searchHistory.appendChild(btn);
    });
}

// Load History when page opens 
displayHistory();
getLocation();