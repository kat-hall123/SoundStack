require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const next = require('next');

const connectDB = require('./lib/db');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const spotifyRouter = require('./routes/spotify');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 3000;

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

async function bootstrap() {
  await nextApp.prepare();

  connectDB().catch((err) => {
    console.warn('[server] MongoDB unavailable — DB routes will return 503 until fixed.');
    console.warn('[server]', err.message);
  });

  const app = express();

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, ts: Date.now() });
  });

  function requireDB(req, res, nextFn) {
    if (mongoose.connection.readyState === 1) return nextFn();
    res.status(503).json({
      error: 'Database not connected. Set a valid MONGODB_URI in soundstack/.env and restart.',
    });
  }

  app.use('/api/posts', requireDB, postsRouter);
  app.use('/api/comments', requireDB, commentsRouter);
  app.use('/api/spotify', spotifyRouter);

  app.use((req, res) => handle(req, res));

  app.use((err, _req, res, _next) => {
    console.error('[server] unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  app.listen(port, () => {
    console.log(`> SoundStack ready on http://localhost:${port}  (mode: ${dev ? 'dev' : 'prod'})`);
  });
}

bootstrap().catch((err) => {
  console.error('[server] failed to start:', err);
  process.exit(1);
});
