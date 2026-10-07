# Weather Dashboard

A small web app that shows current weather for any city. Built with plain HTML, CSS and JavaScript (async/await + `fetch`).

## Features
- Search by city name
- Current temperature, feels-like, humidity, wind and pressure
- Input validation (empty, too short/long, invalid characters)
- Error handling: city not found, network failure, timeout, HTTP errors
- Loading state; light and dark themes follow the system setting

## APIs used (free, no key required)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api): city name to latitude/longitude
- [Open-Meteo Forecast API](https://open-meteo.com/en/docs): current weather for those coordinates

## How it works
1. `validateCity()` checks the input.
2. `getCoordinates()` calls the geocoding API.
3. `getWeather()` calls the forecast API with those coordinates.
4. `render()` fills the page using `textContent` (avoids HTML injection).

## Run locally
Open `index.html` in a browser, or serve the folder: `python -m http.server 8000` and visit `http://localhost:8000`.

## Project structure
```
index.html   page structure
style.css    styling
script.js    API calls, validation, error handling
```

## AI-assisted workflow (for the report)
- **API integration:** prompt the AI with the API docs and ask for the two-step geocode-then-forecast flow.
- **Debugging:** paste the console error, the failing URL and the JSON response; ask for root cause before the fix.
- **Docs and commits:** give the AI your `git diff` and ask for a conventional-commit message.
Review and test all AI output yourself before committing.

## Test cases
| Input | Expected result |
|---|---|
| `Chennai` | Weather card shown |
| (empty) | "Enter a city name." |
| `a` | Length error |
| `12345` | Invalid-characters error |
| `Asdfghjkl` | "No city found" |
| Offline | "Could not reach the weather service" |

## Possible extensions
Unit toggle (°C/°F), 5-day forecast, recent searches saved in `localStorage`, geolocation button.
