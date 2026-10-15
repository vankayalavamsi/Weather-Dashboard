export default function SearchBar({
  city,
  onCityChange,
  onSearch,
  isLoading,
  recentCities,
  onClearRecent,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = city.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <section aria-label="City search">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Enter a city name, e.g. London"
          value={city}
          onChange={(event) => onCityChange(event.target.value)}
          aria-label="City name"
        />
        <button type="submit" className="search-button" disabled={isLoading || !city.trim()}>
          {isLoading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {recentCities.length > 0 && (
        <div className="recent">
          <span className="recent-label">Recent:</span>
          {recentCities.map((name) => (
            <button
              key={name}
              type="button"
              className="recent-chip"
              onClick={() => onSearch(name)}
              disabled={isLoading}
            >
              {name}
            </button>
          ))}
          <button type="button" className="recent-clear" onClick={onClearRecent}>
            Clear
          </button>
        </div>
      )}
    </section>
  );
}