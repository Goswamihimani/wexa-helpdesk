
import mongoose from 'mongoose';

const agentSuggestionSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  predictedCategory: { type: String, enum: ['billing','tech','shipping','other'] },
  articleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  draftReply: String,
  confidence: Number,
  autoClosed: Boolean,
  modelInfo: {
    provider: String,
    model: String,
    promptVersion: String,
    latencyMs: Number
  }
}, { timestamps: true });

export default mongoose.model('AgentSuggestion', agentSuggestionSchema);
