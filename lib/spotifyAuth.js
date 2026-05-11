let cachedToken = null;
let cachedExpiry = 0;

async function fetchAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials missing. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.');
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Spotify token request failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  cachedExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedExpiry) return cachedToken;
  return fetchAccessToken();
}

module.exports = { getAccessToken };
