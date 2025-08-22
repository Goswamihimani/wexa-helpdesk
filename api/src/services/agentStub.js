
import Article from '../models/Article.js';
import AgentSuggestion from '../models/AgentSuggestion.js';
import Ticket from '../models/Ticket.js';
import AuditLog from '../models/AuditLog.js';
import Config from '../models/Config.js';
import { newTraceId } from '../utils/trace.js';

const STUB = process.env.STUB_MODE === 'true';

function classify(text){
  const t = text.toLowerCase();
  let predictedCategory = 'other', confidence = 0.4;
  const rules = [
    { cat: 'billing', kws: ['refund','invoice','payment','charged','billing']},
    { cat: 'tech',    kws: ['error','bug','stack','crash','500','login']},
    { cat: 'shipping',kws: ['delivery','shipment','tracking','package','courier']},
  ];
  for(const r of rules){
    const hits = r.kws.filter(k => t.includes(k)).length;
    if(hits>=1){ predictedCategory = r.cat; confidence = 0.6 + Math.min(0.3, hits*0.15); break; }
  }
  return { predictedCategory, confidence };
}

async function retrieveKB(query){
  const results = await Article.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" }}).limit(3).lean().catch(()=>[]);
  if(results.length>0) return results;
  const rx = new RegExp(query.split(' ').join('|'),'i');
  return await Article.find({ $or: [{title: rx},{body: rx},{tags: rx}] }).limit(3).lean();
}

function draftReply(ticket, articles){
  const refs = articles.map((a,i)=>`${i+1}) ${a.title}`).join('\n');
  const ids = articles.map(a=>a._id.toString());
  const draft = `Hi, thanks for reaching out about "${ticket.title}". Based on your issue, please check:\n${refs}\nIf this doesn’t solve it, an agent will assist you shortly.`;
  return { draftReply: draft, citations: ids };
}

export async function triageTicket(ticketId){
  const traceId = newTraceId();
  const ticket = await Ticket.findById(ticketId).lean();
  if(!ticket) throw new Error('Ticket not found');

  await AuditLog.create({ ticketId, traceId, actor:'system', action:'TICKET_TRIAGE_STARTED', meta:{ ticketId } });

  await AuditLog.create({ ticketId, traceId, actor:'system', action:'PLAN_BUILT', meta:{ plan:['classify','retrieve','draft','decide'] } });

  const { predictedCategory, confidence } = classify(`${ticket.title} ${ticket.description}`);
  await AuditLog.create({ ticketId, traceId, actor:'system', action:'AGENT_CLASSIFIED', meta:{ predictedCategory, confidence } });

  const articles = await retrieveKB(ticket.description || ticket.title);
  await AuditLog.create({ ticketId, traceId, actor:'system', action:'KB_RETRIEVED', meta:{ articleIds: articles.map(a=>a._id) } });

  const { draftReply, citations } = draftReply(ticket, articles);
  await AuditLog.create({ ticketId, traceId, actor:'system', action:'DRAFT_GENERATED', meta:{ draftReply, citations } });

  const cfg = await Config.findOne() || { autoCloseEnabled: true, confidenceThreshold: 0.78 };
  const autoClose = !!cfg.autoCloseEnabled && confidence >= (cfg.confidenceThreshold ?? 0.78);

  const suggest = await AgentSuggestion.create({
    ticketId, predictedCategory, articleIds: citations, draftReply, confidence, autoClosed: autoClose,
    modelInfo: { provider: STUB?'stub':'unknown', model: 'rule-based-0', promptVersion: 'v1', latencyMs: Math.floor(Math.random()*200)+50 }
  });

  if(autoClose){
    await Ticket.findByIdAndUpdate(ticketId, { status:'resolved', agentSuggestionId: suggest._id, category: predictedCategory });
    await AuditLog.create({ ticketId, traceId, actor:'system', action:'AUTO_CLOSED', meta:{ suggestionId: suggest._id } });
  } else {
    await Ticket.findByIdAndUpdate(ticketId, { status:'waiting_human', agentSuggestionId: suggest._id, category: predictedCategory });
    await AuditLog.create({ ticketId, traceId, actor:'system', action:'ASSIGNED_TO_HUMAN', meta:{ suggestionId: suggest._id } });
  }

  return { suggestionId: suggest._id, autoClose, confidence, predictedCategory };
}
