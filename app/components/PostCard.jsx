'use client';

import Link from 'next/link';

function formatDate(d) {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function PostCard({ post }) {
  const cover = post.spotifyRef?.imageUrl;
  return (
    <Link href={`/post/${post._id}`} className="post-card">
      <div
        className="post-card__cover"
        style={cover ? { backgroundImage: `url(${cover})` } : undefined}
      >
        {!cover && '♪'}
      </div>
      <div className="post-card__body">
        <h3 className="post-card__title">{post.title}</h3>
        <p className="post-card__excerpt">{post.body}</p>
        <div className="post-card__meta">
          <span className="byline">{post.displayName || 'Anonymous'}</span>
          <span className="dot-sep">·</span>
          <span>{formatDate(post.createdAt)}</span>
          {post.spotifyRef?.name && (
            <>
              <span className="dot-sep">·</span>
              <span className="tag">
                ♪ {post.spotifyRef.name}
                {post.spotifyRef.artist ? ` — ${post.spotifyRef.artist}` : ''}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
