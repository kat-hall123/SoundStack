'use client';

export default function TrackEmbed({ spotifyRef }) {
  if (!spotifyRef?.id || !spotifyRef?.type) return null;
  const src = `https://open.spotify.com/embed/${spotifyRef.type}/${spotifyRef.id}?utm_source=soundstack`;
  return (
    <div className="post-detail__embed">
      <iframe
        title={`Spotify ${spotifyRef.type}: ${spotifyRef.name}`}
        src={src}
        width="100%"
        height={spotifyRef.type === 'track' ? 152 : 352}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
