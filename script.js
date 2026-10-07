// Weather Dashboard — uses the free Open-Meteo APIs (no API key needed)
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const TIMEOUT_MS = 8000;

const WEATHER_CODES = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Freezing fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow",
  80: "Rain showers", 81: "Heavy showers", 82: "Violent showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Severe thunderstorm with hail",
};

const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const button = document.getElementById("search-btn");
const message = document.getElementById("message");
const result = document.getElementById("result");
const $ = (id) => document.getElementById(id);

class UserError extends Error {}  // errors we can show to the user as-is

// Fetch JSON with a timeout and HTTP status check
async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new UserError(`The weather service returned an error (${res.status}). Try again later.`);
    return await res.json();
  } catch (err) {
    if (err instanceof UserError) throw err;
    if (err.name === "AbortError") throw new UserError("The request timed out. Check your connection and try again.");
    throw new UserError("Could not reach the weather service. Check your internet connection.");
  } finally {
    clearTimeout(timer);
  }
}

// Step 1: city name -> coordinates
async function getCoordinates(city) {
  const data = await fetchJson(`${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  if (!data.results || data.results.length === 0) {
    throw new UserError(`No city found for "${city}". Check the spelling and try again.`);
  }
  const { name, admin1, country, latitude, longitude } = data.results[0];
  return { label: [name, admin1, country].filter(Boolean).join(", "), latitude, longitude };
}

// Step 2: coordinates -> current weather
async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude, longitude, timezone: "auto",
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,surface_pressure,weather_code",
  });
  const data = await fetchJson(`${WEATHER_URL}?${params}`);
  if (!data.current) throw new UserError("Weather data is unavailable for this location.");
  return data.current;
}

// Input validation: letters, spaces, hyphens, apostrophes, periods; 2-60 chars
function validateCity(raw) {
  const city = raw.trim().replace(/\s+/g, " ");
  if (!city) throw new UserError("Enter a city name.");
  if (city.length < 2 || city.length > 60) throw new UserError("City name must be 2 to 60 characters.");
  if (!/^[\p{L}\s.'-]+$/u.test(city)) throw new UserError("City names can only contain letters, spaces, hyphens and apostrophes.");
  return city;
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? "error" : "";
  message.hidden = false;
}

function render(label, w) {
  $("place").textContent = label;
  $("condition").textContent = WEATHER_CODES[w.weather_code] ?? "Unknown conditions";
  $("temp").textContent = Math.round(w.temperature_2m);
  $("feels").textContent = `${Math.round(w.apparent_temperature)}°C`;
  $("humidity").textContent = `${w.relative_humidity_2m}%`;
  $("wind").textContent = `${w.wind_speed_10m} km/h`;
  $("pressure").textContent = `${Math.round(w.surface_pressure)} hPa`;
  $("stamp").textContent = `Local time of observation: ${w.time.replace("T", " ")}`;
  result.hidden = false;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  result.hidden = true;
  message.hidden = true;
  try {
    const city = validateCity(input.value);
    button.disabled = true;
    showMessage("Loading weather…");
    const place = await getCoordinates(city);
    const weather = await getWeather(place.latitude, place.longitude);
    message.hidden = true;
    render(place.label, weather);
  } catch (err) {
    if (!(err instanceof UserError)) console.error(err);  // unexpected bug: log for debugging
    showMessage(err instanceof UserError ? err.message : "Something went wrong. Please try again.", true);
  } finally {
    button.disabled = false;
  }
});
