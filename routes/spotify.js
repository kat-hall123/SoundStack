const express = require('express');
const { getAccessToken } = require('../lib/spotifyAuth');

const router = express.Router();

const ALLOWED_TYPES = new Set(['track', 'album', 'artist', 'playlist']);

function mapTrack(t) {
  return {
    type: 'track',
    id: t.id,
    name: t.name,
    artist: (t.artists || []).map((a) => a.name).join(', '),
    album: t.album?.name || '',
    imageUrl: t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || '',
    previewUrl: t.preview_url || null,
    spotifyUrl: t.external_urls?.spotify || '',
  };
}

function mapAlbum(a) {
  return {
    type: 'album',
    id: a.id,
    name: a.name,
    artist: (a.artists || []).map((x) => x.name).join(', '),
    imageUrl: a.images?.[1]?.url || a.images?.[0]?.url || '',
    spotifyUrl: a.external_urls?.spotify || '',
  };
}

function mapArtist(a) {
  return {
    type: 'artist',
    id: a.id,
    name: a.name,
    artist: a.name,
    imageUrl: a.images?.[1]?.url || a.images?.[0]?.url || '',
    spotifyUrl: a.external_urls?.spotify || '',
  };
}

function mapPlaylist(p) {
  return {
    type: 'playlist',
    id: p.id,
    name: p.name,
    artist: p.owner?.display_name ? `by ${p.owner.display_name}` : '',
    imageUrl: p.images?.[0]?.url || '',
    spotifyUrl: p.external_urls?.spotify || '',
  };
}

router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    const rawType = (req.query.type || 'track').toString().trim();
    const type = ALLOWED_TYPES.has(rawType) ? rawType : 'track';
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 10);

    if (!q) return res.json({ results: [] });

    const token = await getAccessToken();
    const url = new URL('https://api.spotify.com/v1/search');
    url.searchParams.set('q', q);
    url.searchParams.set('type', type);
    url.searchParams.set('limit', String(limit));

    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      console.error('[spotify] search failed', r.status, text);
      return res.status(502).json({ error: 'Spotify search failed.' });
    }

    const data = await r.json();
    let results = [];
    if (type === 'track') results = (data.tracks?.items || []).map(mapTrack);
    else if (type === 'album') results = (data.albums?.items || []).map(mapAlbum);
    else if (type === 'artist') results = (data.artists?.items || []).map(mapArtist);
    else if (type === 'playlist') results = (data.playlists?.items || []).filter(Boolean).map(mapPlaylist);

    res.json({ results, type, q });
  } catch (err) {
    console.error('[spotify] error:', err);
    res.status(500).json({ error: err.message || 'Spotify request failed.' });
  }
});

module.exports = router;
