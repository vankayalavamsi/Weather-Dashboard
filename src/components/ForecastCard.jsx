export default function ForecastCard({ day }) {
  return (
    <div className="card forecast-card">
      <p className="forecast-day">{day.dayLabel}</p>

      {day.icon ? (
        <img
          className="forecast-icon"
          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
          alt={day.condition}
        />
      ) : (
        <div className="forecast-icon forecast-icon-placeholder" aria-hidden="true">—</div>
      )}

      <p className="forecast-condition">{day.condition}</p>
      <p className="forecast-temps">
        <span className="temp-max">{day.max != null ? `${day.max}°` : '--'}</span>
        {' / '}
        <span className="temp-min">{day.min != null ? `${day.min}°` : '--'}</span>
      </p>
    </div>
  );
}