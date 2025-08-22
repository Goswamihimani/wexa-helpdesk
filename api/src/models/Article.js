
import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: String,
  body: String,
  tags: [String],
  status: { type: String, enum: ['draft','published'], default: 'draft' },
}, { timestamps: true });

articleSchema.index({ title: 'text', body: 'text', tags: 'text' });

export default mongoose.model('Article', articleSchema);
