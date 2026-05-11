const express = require('express');
const mongoose = require('mongoose');

const Comment = require('../models/Comment');
const Post = require('../models/Post');

const router = express.Router();

router.get('/:postId', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.postId)) {
      return res.status(400).json({ error: 'Invalid post id.' });
    }
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: 1 })
      .lean();
    res.json({ comments });
  } catch (err) {
    console.error('[comments] list error:', err);
    res.status(500).json({ error: 'Failed to load comments.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { postId, body, displayName } = req.body || {};

    if (!postId || !mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ error: 'Valid postId is required.' });
    }
    if (!body || typeof body !== 'string' || !body.trim()) {
      return res.status(400).json({ error: 'Comment body is required.' });
    }

    const post = await Post.exists({ _id: postId });
    if (!post) return res.status(404).json({ error: 'Post not found.' });

    const comment = await Comment.create({
      postId,
      body: body.trim().slice(0, 2000),
      displayName: (displayName && String(displayName).trim().slice(0, 40)) || 'Anonymous',
    });

    res.status(201).json({ comment });
  } catch (err) {
    console.error('[comments] create error:', err);
    res.status(500).json({ error: 'Failed to create comment.' });
  }
});

module.exports = router;
