import ForecastCard from './ForecastCard.jsx';

export default function Forecast({ days }) {
  return (
    <section aria-label="5-day forecast">
      <h2 className="section-title">5-Day Forecast</h2>
      <div className="forecast-grid">
        {days.map((day) => (
          <ForecastCard key={day.date} day={day} />
        ))}
      </div>
    </section>
  );
}