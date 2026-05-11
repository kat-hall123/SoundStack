const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/Post');
const Comment = require('../models/Comment');

const router = express.Router();

function sanitizeSpotifyRef(ref) {
  if (!ref || typeof ref !== 'object') return null;
  const allowed = ['track', 'album', 'artist', 'playlist'];
  if (!allowed.includes(ref.type)) return null;
  return {
    type: ref.type,
    id: String(ref.id || '').slice(0, 64),
    name: String(ref.name || '').slice(0, 200),
    artist: String(ref.artist || '').slice(0, 200),
    imageUrl: String(ref.imageUrl || '').slice(0, 500),
  };
}

router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Post.countDocuments(),
    ]);

    res.json({ posts, page, limit, total });
  } catch (err) {
    console.error('[posts] list error:', err);
    res.status(500).json({ error: 'Failed to list posts.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid post id.' });
    }
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    res.json({ post });
  } catch (err) {
    console.error('[posts] get error:', err);
    res.status(500).json({ error: 'Failed to load post.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, body, displayName, spotifyRef } = req.body || {};

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    if (!body || typeof body !== 'string' || !body.trim()) {
      return res.status(400).json({ error: 'Body is required.' });
    }

    const post = await Post.create({
      title: title.trim().slice(0, 140),
      body: body.trim().slice(0, 5000),
      displayName: (displayName && String(displayName).trim().slice(0, 40)) || 'Anonymous',
      spotifyRef: sanitizeSpotifyRef(spotifyRef),
    });

    res.status(201).json({ post });
  } catch (err) {
    console.error('[posts] create error:', err);
    res.status(500).json({ error: 'Failed to create post.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid post id.' });
    }
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Post not found.' });
    await Comment.deleteMany({ postId: req.params.id });
    res.json({ ok: true });
  } catch (err) {
    console.error('[posts] delete error:', err);
    res.status(500).json({ error: 'Failed to delete post.' });
  }
});

module.exports = router;
