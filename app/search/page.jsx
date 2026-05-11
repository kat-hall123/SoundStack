'use client';

import { useState } from 'react';
import TrackEmbed from '../components/TrackEmbed';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [type, setType] = useState('track');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [embed, setEmbed] = useState(null);

  async function runSearch(e) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    setEmbed(null);
    try {
      const url = `/api/spotify/search?q=${encodeURIComponent(q)}&type=${type}&limit=24`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed.');
      setResults(data.results || []);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="hero">
        <h1>Find your sound.</h1>
        <p>Search Spotify for tracks, albums, and artists. Preview anything inline.</p>
      </section>

      <form className="form" onSubmit={runSearch}>
        <h2 className="form__title">Search</h2>
        <div className="search-bar">
          <input
            className="form__input"
            placeholder="Try 'Kendrick Lamar' or 'After Hours'..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          <div className="type-toggle">
            {['track', 'album', 'artist', 'playlist'].map((t) => (
              <button
                key={t}
                type="button"
                className={type === t ? 'is-active' : ''}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <div className="form__error" style={{ marginTop: 12 }}>{error}</div>}
      </form>

      {embed && (
        <div style={{ marginBottom: 24 }}>
          <TrackEmbed spotifyRef={embed} />
        </div>
      )}

      {results.length > 0 && (
        <>
          <h2 className="section-title">Results</h2>
          <div className="results-grid">
            {results.map((r) => (
              <div key={r.id} className="result-card">
                <div
                  className="result-card__cover"
                  style={r.imageUrl ? { backgroundImage: `url(${r.imageUrl})` } : undefined}
                />
                <p className="result-card__name" title={r.name}>{r.name}</p>
                <p className="result-card__sub" title={r.artist}>{r.artist || r.type}</p>
                <div className="result-card__actions">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => setEmbed(r)}
                  >
                    Play
                  </button>
                  {r.spotifyUrl && (
                    <a
                      className="btn btn--ghost"
                      href={r.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && q && results.length === 0 && !error && (
        <div className="empty">No results — try a different query.</div>
      )}
    </>
  );
}
