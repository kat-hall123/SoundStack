import NewPostForm from './components/NewPostForm';
import PostCard from './components/PostCard';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getPosts() {
  try {
    const h = await headers();
    const host = h.get('host');
    const protocol = h.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
    const base = host ? `${protocol}://${host}` : `http://localhost:${process.env.PORT || 3000}`;
    const res = await fetch(`${base}/api/posts?limit=30`, { cache: 'no-store' });
    if (!res.ok) return { posts: [] };
    return res.json();
  } catch (err) {
    console.error('home: fetch posts failed', err);
    return { posts: [] };
  }
}

export default async function HomePage() {
  const { posts = [] } = await getPosts();

  return (
    <>
      <section className="hero">
        <h1>The anonymous music forum.</h1>
        <p>
          Drop a thought, tag a track, start a debate. No accounts, no logins —
          just sound and the people who love it.
        </p>
      </section>

      <NewPostForm />

      <div className="section-row">
        <h2 className="section-title">Latest discussions</h2>
        <span className="byline">{posts.length} post{posts.length === 1 ? '' : 's'}</span>
      </div>

      {posts.length === 0 ? (
        <div className="empty">No posts yet — be the first to start a discussion.</div>
      ) : (
        <div className="feed">
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      )}
    </>
  );
}
