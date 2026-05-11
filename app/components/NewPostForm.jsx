'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SpotifyPicker from './SpotifyPicker';

export default function NewPostForm({ onCreated }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [spotifyRef, setSpotifyRef] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          displayName,
          spotifyRef,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post.');
      setTitle('');
      setBody('');
      setDisplayName('');
      setSpotifyRef(null);
      if (onCreated) onCreated(data.post);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
    <form className="form" onSubmit={handleSubmit}>
      <h2 className="form__title">Start a discussion</h2>

      <div className="form__row">
        <label className="form__label" htmlFor="title">Title</label>
        <input
          id="title"
          className="form__input"
          type="text"
          value={title}
          maxLength={140}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's on your turntable?"
          required
        />
      </div>

      <div className="form__row">
        <label className="form__label" htmlFor="body">Body</label>
        <textarea
          id="body"
          className="form__textarea"
          value={body}
          maxLength={5000}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share a thought, ask a question, drop a recommendation..."
          required
        />
      </div>

      <div className="form__row">
        <label className="form__label" htmlFor="displayName">Display name (optional)</label>
        <input
          id="displayName"
          className="form__input"
          type="text"
          value={displayName}
          maxLength={40}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Anonymous"
        />
        <span className="form__hint">Leave blank to post anonymously.</span>
      </div>

      {spotifyRef && (
        <div className="spotify-chip">
          <div
            className="spotify-chip__cover"
            style={spotifyRef.imageUrl ? { backgroundImage: `url(${spotifyRef.imageUrl})` } : undefined}
          />
          <div className="spotify-chip__text">
            <div className="spotify-chip__name">{spotifyRef.name}</div>
            <div className="spotify-chip__artist">
              {spotifyRef.artist} · {spotifyRef.type}
            </div>
          </div>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setSpotifyRef(null)}
          >
            Remove
          </button>
        </div>
      )}

      <div className="form__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setPickerOpen(true)}
        >
          ♪ {spotifyRef ? 'Change track' : 'Tag a track'}
        </button>
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </div>

      {error && <div className="form__error">{error}</div>}
    </form>

    {pickerOpen && (
      <SpotifyPicker
        onSelect={(ref) => {
          setSpotifyRef(ref);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    )}
    </>
  );
}
