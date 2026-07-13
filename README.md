# ☀️ WEATHER APP

**Name:** Cyril Meshach

**Student ID:** ALT/SOE/BAR/026/0256

## PROJECT DESCRIPTION

I built a fully functional Weather App that fetches and displays live weather data from a Public API. I used HTML for my structure, CSS for visualization, responsiveness and styling and JS for interactivity. The App allows users to search for any city in the world and instantly see current weather conditions along with a 5-day Forecast.

---

## FEATURES
- Search any city in the world
- Displays Current Temperature in C or F
- Shows humidity, wind speed & UV Index
- Shows Weather Description and Icon indicating visuals 
- 5-day Forecast with high & low temperature
- Geolocation that automatically detects local weather data on Page Load
- Unit Toggle
- Search History saves last 5 searched cities as uick access buttons

---

## TECHNOLOGIES USED
| Technology | Purpose |
|---|---|
| HTML | Semantic page structure |
| CSS | Styling, layout, animations, responsiveness |
| JS | DOM manipulation, event handling, API calls |
| Open-Meteo Geocoding API | Converting city names to coordinates |
| Open-Meteo Weather API | Fetching live weather and forecast data |
| localStorage | Persisting search history across sessions |
| navigator.geolocation | Detecting user's location automatically |

---

## API Reference
This project uses Open-Meteo - A free, open-source weather API requiring no API key.

**Step 1 - Geocoding (city name - coordinates):**
```
https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json
```

**Step 2 - Weather data (coordinates - forecast):**
```
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto
```

---

## PROJECT STRUCTURE
```
weather-app/

index.html      → HTML structure — search form, weather display, forecast grid
styles.css      → All styling — colours, layout, responsiveness, animations
script.js       → All JavaScript — API calls, DOM updates, error handling
README.md       → Project documentation
```

---

## HOW IT WORKS

```
User searches a city
     ↓
getCoordinates() → fetches lat & lon from Geocoding API
     ↓
getWeather() → fetches weather data using coordinates 
     ↓
displayCurrentWeather() → updates current weather on page
     ↓
displayForecast() → builds and injects 5 forecast cards
     ↓
getLocation() → requests user's location access for current weather data display
```

---

## How to Run Locally

1. Clone the repository:
```
git clone https://github.com/MONCLERO/weather_app.git
```

2. Open the project folder
```
cd weather_app
```

3. code index.html & run through LiveServer

---

## Concepts learnt in building project

Building this project taught me some of the most important concepts in modern Javascript:

- **Fetch API & async/await** - How to talk to the internet and handle delayed responses

- **Two Step API calls** - converting city names to coordinates before fetching weather

- **DOM Manipulation** - Dynamically crating and updating HTML elements with Javascript

- **Seperation of Concerns** - Learnt this term in the course of my research and it involves breaking code into small focused functions each with one job

- **localStorage** - persisting data across browser sessions using JSON.stringify and JSON.parse

- **Geolocation API** - accessing the browser's built-in location detection

- **Error Handling** - gracefully managing failed API calls and invalid user input

- **Responsive Design** - building layouts that work on both desktop and mobile

---

## Author 
Cyril Meshach - [@monclero]