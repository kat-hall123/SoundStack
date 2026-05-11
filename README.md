# SoundStack

> Placeholder README — final submission README (per CMSC335 rubric) will replace this content.

## Run locally

```bash
cd soundstack
npm install
cp .env.example .env   # fill in MongoDB URI + Spotify creds if needed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production

```bash
npm run build
npm start
```

## Required environment variables

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `SPOTIFY_CLIENT_ID` | Spotify Web API Client ID (developer.spotify.com/dashboard) |
| `SPOTIFY_CLIENT_SECRET` | Spotify Web API Client Secret |
| `PORT` | Local port (defaults to 3000) |

## Deploy on Render

1. Push this repo to GitHub.
2. On render.com create a new **Web Service** from the repo.
3. **Build command:** `npm install && npm run build`
4. **Start command:** `npm start`
5. Add the env vars above under Environment.
