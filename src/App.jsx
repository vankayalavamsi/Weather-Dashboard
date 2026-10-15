import { useState } from 'react';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import CurrentWeather from './components/CurrentWeather.jsx';
import Forecast from './components/Forecast.jsx';
import useTheme from './hooks/useTheme.js';
import { buildDailyForecast } from './utils/weather.js';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const API_BASE = 'https://api.openweathermap.org/data/2.5';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const [city, setCity] = useState('');          // text in the search input
  const [weather, setWeather] = useState(null);  // current weather API response
  const [forecast, setForecast] = useState([]);  // processed 5-day summary
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentCities, setRecentCities] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentCities')) ?? [];
    } catch {
      return [];
    }
  });

  // Fetches current weather + 5-day forecast for the given city.
  async function fetchWeather(cityName) {
    if (!API_KEY) {
      setError(
        'Missing API key. Add VITE_OPENWEATHER_API_KEY to your .env file, then restart the dev server.'
      );
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${API_BASE}/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`),
        fetch(`${API_BASE}/forecast?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`),
      ]);

      if (currentRes.status === 404 || forecastRes.status === 404) {
        throw new Error('not-found');
      }
      if (currentRes.status === 401 || forecastRes.status === 401) {
        throw new Error('auth');
      }
      if (!currentRes.ok || !forecastRes.ok) {
        throw new Error('network');
      }

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      setWeather(currentData);
      setForecast(buildDailyForecast(forecastData));
      saveRecentCity(currentData.name || cityName);
    } catch (err) {
      setWeather(null);
      setForecast([]);

      if (err.message === 'not-found') {
        setError(`City "${cityName}" was not found. Please check the spelling and try again.`);
      } else if (err.message === 'auth') {
        setError(
          'The OpenWeather API key is invalid or not active yet. New keys can take up to a couple of hours to activate.'
        );
      } else {
        setError('Could not load the weather data. Please check your internet connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Search helper that also keeps the input in sync (used by recent-city chips).
  function searchCity(cityName) {
    setCity(cityName);
    fetchWeather(cityName);
  }

  // Keeps the last 5 searched cities in localStorage.
  function saveRecentCity(cityName) {
    setRecentCities((prev) => {
      const updated = [
        cityName,
        ...prev.filter((name) => name.toLowerCase() !== cityName.toLowerCase()),
      ].slice(0, 5);

      localStorage.setItem('recentCities', JSON.stringify(updated));
      return updated;
    });
  }

  function clearRecentCities() {
    setRecentCities([]);
    localStorage.removeItem('recentCities');
  }

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="container">
        <SearchBar
          city={city}
          onCityChange={setCity}
          onSearch={searchCity}
          isLoading={isLoading}
          recentCities={recentCities}
          onClearRecent={clearRecentCities}
        />

        {error && (
          <p className="message message-error" role="alert">
            {error}
          </p>
        )}

        {isLoading && <p className="message">Loading weather data, please wait…</p>}

        {!isLoading && !error && !weather && (
          <p className="message">
            Search for a city above to see its current weather and 5-day forecast.
          </p>
        )}

        {!isLoading && weather && <CurrentWeather weather={weather} />}
        {!isLoading && forecast.length > 0 && <Forecast days={forecast} />}
      </main>

      <footer className="footer">Weather data provided by OpenWeather</footer>
    </div>
  );
}