import { capitalize, formatTemp, formatWind } from '../utils/weather.js';

export default function CurrentWeather({ weather }) {
  const condition = weather.weather?.[0];
  const main = weather.main ?? {};
  const wind = weather.wind ?? {};

  return (
    <section className="card current-weather" aria-label="Current weather">
      <div className="current-main">
        <div>
          <h2 className="city-name">
            {weather.name || 'Unknown city'}
            {weather.sys?.country && <span className="country">, {weather.sys.country}</span>}
          </h2>
          <p className="condition">{capitalize(condition?.description)}</p>
          <p className="temperature">{formatTemp(main.temp)}</p>
        </div>

        {condition?.icon && (
          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${condition.icon}@2x.png`}
            alt={condition.description || 'Current weather icon'}
          />
        )}
      </div>

      <div className="stats-grid">
        <Stat label="Feels like" value={formatTemp(main.feels_like)} />
        <Stat label="Humidity" value={main.humidity != null ? `${main.humidity}%` : '—'} />
        <Stat label="Wind" value={formatWind(wind.speed)} />
        <Stat label="Min temp" value={formatTemp(main.temp_min)} />
        <Stat label="Max temp" value={formatTemp(main.temp_max)} />
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}