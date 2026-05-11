const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
  displayName: { type: String, trim: true, maxlength: 40, default: 'Anonymous' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
