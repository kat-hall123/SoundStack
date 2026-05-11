'use client';

import { useEffect, useState } from 'react';

export default function SpotifyPicker({ onSelect, onClose }) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('track');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function runSearch(e) {
    if (e) e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    try {
      const url = `/api/spotify/search?q=${encodeURIComponent(q)}&type=${type}&limit=12`;
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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '60px 16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          padding: 24,
          width: '100%',
          maxWidth: 760,
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Tag music</h3>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Close</button>
        </div>

        <form className="search-bar" onSubmit={runSearch}>
          <input
            className="form__input"
            placeholder="Search Spotify..."
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
            {loading ? '...' : 'Search'}
          </button>
        </form>

        {error && <div className="form__error" style={{ marginTop: 12 }}>{error}</div>}

        {results.length > 0 && (
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
                    onClick={() => onSelect(r)}
                  >
                    Tag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && q && results.length === 0 && !error && (
          <div className="empty" style={{ marginTop: 16 }}>No results yet — try a search.</div>
        )}
      </div>
    </div>
  );
}
