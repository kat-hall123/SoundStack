const mongoose = require('mongoose');

const SpotifyRefSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['track', 'album', 'artist', 'playlist'] },
    id: String,
    name: String,
    artist: String,
    imageUrl: String,
  },
  { _id: false },
);

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  body: { type: String, required: true, trim: true, maxlength: 5000 },
  displayName: { type: String, trim: true, maxlength: 40, default: 'Anonymous' },
  spotifyRef: { type: SpotifyRefSchema, default: null },
  createdAt: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);
