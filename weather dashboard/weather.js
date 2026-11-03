const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");

// Get weather information
async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name!";
        return;
    }

    try {
        searchBtn.disabled = true;
        message.textContent = "Loading weather data...";

        // Step 1: Get city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to find location.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found! Try another city.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get live weather data
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        // Step 3: Extract JSON data
        const current = weatherData.current;

        const temperature = current.temperature_2m;
        const humidity = current.relative_humidity_2m;
        const wind = current.wind_speed_10m;
        const feelsLike = current.apparent_temperature;
        const code = current.weather_code;

        // Step 4: Display weather information
        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country}`;

        document.getElementById("temperature").textContent =
            `${temperature}°C`;

        document.getElementById("humidity").textContent =
            `${humidity}%`;

        document.getElementById("wind").textContent =
            `${wind} km/h`;

        document.getElementById("feelsLike").textContent =
            `${feelsLike}°C`;

        // Step 5: Weather description
        const weather = getWeatherDescription(code);

        document.getElementById("description").textContent =
            weather.description;

        document.getElementById("weatherIcon").textContent =
            weather.icon;

        message.textContent = "";

    } catch (error) {

        message.textContent = error.message;

    } finally {

        searchBtn.disabled = false;

    }
}

// Convert weather codes into descriptions
function getWeatherDescription(code) {

    if (code === 0) {
        return { description: "Clear Sky", icon: "☀️" };
    }

    if (code <= 3) {
        return { description: "Partly Cloudy", icon: "🌤️" };
    }

    if (code <= 48) {
        return { description: "Foggy", icon: "🌫️" };
    }

    if (code <= 57) {
        return { description: "Drizzle", icon: "🌦️" };
    }

    if (code <= 67) {
        return { description: "Rainy", icon: "🌧️" };
    }

    if (code <= 77) {
        return { description: "Snowy", icon: "❄️" };
    }

    if (code <= 82) {
        return { description: "Rain Showers", icon: "🌧️" };
    }

    if (code <= 86) {
        return { description: "Snow Showers", icon: "🌨️" };
    }

    if (code <= 99) {
        return { description: "Thunderstorm", icon: "⛈️" };
    }

    return { description: "Unknown Weather", icon: "🌍" };
}

// Search using Enter key
cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});

// Load Chennai weather when website opens
window.addEventListener("DOMContentLoaded", function() {

    cityInput.value = "Chennai";
    getWeather();

});