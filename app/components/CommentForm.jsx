'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CommentForm({ postId }) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, body, displayName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to comment.');
      setBody('');
      setDisplayName('');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2 className="form__title">Leave a comment</h2>

      <div className="form__row">
        <label className="form__label" htmlFor="comment-body">Comment</label>
        <textarea
          id="comment-body"
          className="form__textarea"
          value={body}
          maxLength={2000}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What do you think?"
          required
        />
      </div>

      <div className="form__row">
        <label className="form__label" htmlFor="comment-name">Display name (optional)</label>
        <input
          id="comment-name"
          className="form__input"
          type="text"
          value={displayName}
          maxLength={40}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Anonymous"
        />
      </div>

      <div className="form__actions">
        <button type="submit" className="btn btn--primary" disabled={submitting || !body.trim()}>
          {submitting ? 'Posting...' : 'Comment'}
        </button>
      </div>

      {error && <div className="form__error">{error}</div>}
    </form>
  );
}
