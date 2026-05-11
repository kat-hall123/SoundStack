import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

import TrackEmbed from '../../components/TrackEmbed';
import CommentForm from '../../components/CommentForm';

export const dynamic = 'force-dynamic';

async function baseUrl() {
  const h = await headers();
  const host = h.get('host');
  const protocol = h.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
  return host ? `${protocol}://${host}` : `http://localhost:${process.env.PORT || 3000}`;
}

async function getPost(id) {
  const res = await fetch(`${await baseUrl()}/api/posts/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load post.');
  const data = await res.json();
  return data.post;
}

async function getComments(id) {
  const res = await fetch(`${await baseUrl()}/api/comments/${id}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.comments || [];
}

function formatDate(d) {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

export default async function PostDetailPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  const comments = await getComments(id);

  return (
    <>
      <Link href="/" className="nav__link" style={{ display: 'inline-block', marginBottom: 16 }}>
        ← Back to feed
      </Link>

      <article className="post-detail">
        <h1 className="post-detail__title">{post.title}</h1>
        <div className="post-detail__meta">
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
        <div className="post-detail__body">{post.body}</div>
        {post.spotifyRef?.id && <TrackEmbed spotifyRef={post.spotifyRef} />}
      </article>

      <CommentForm postId={String(post._id)} />

      <div className="section-row">
        <h2 className="section-title">Comments</h2>
        <span className="byline">{comments.length} comment{comments.length === 1 ? '' : 's'}</span>
      </div>

      {comments.length === 0 ? (
        <div className="empty">No comments yet — start the conversation.</div>
      ) : (
        <div className="comment-list">
          {comments.map((c) => (
            <div key={c._id} className="comment">
              <div className="comment__head">
                <span className="comment__author">{c.displayName || 'Anonymous'}</span>
                <span className="dot-sep">·</span>
                <span>{formatDate(c.createdAt)}</span>
              </div>
              <div className="comment__body">{c.body}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
