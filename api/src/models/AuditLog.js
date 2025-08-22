
import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  traceId: String,
  actor: { type: String, enum: ['system','agent','user'] },
  action: String,
  meta: Object,
  timestamp: { type: Date, default: () => new Date() }
}, { timestamps: false });

export default mongoose.model('AuditLog', auditLogSchema);
