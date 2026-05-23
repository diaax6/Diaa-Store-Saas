// Demo data and helpers for inventory system
export const demoCategories = [
  { id:'cat1', name:'Gmail Accounts (New)', type:'accounts', icon:'👤', linkedProduct:'', tags:[], items:[
    { id:'i1', email:'chapanya318@gmail.com', password:'chapanya3181!22', twoFA:'https://2fa.diaa.store/F4I3M4ABRCGW', status:'used', maxUses:1, usedCount:1, costUSD:0.5, addedAt:'2025-05-20T10:00:00Z', soldTo:'Ahmed', expiresAt:'' },
    { id:'i2', email:'marilynmoco1370@gmail.com', password:'osbgvmwtt', twoFA:'https://2fa.diaa.store/K4R2L6NKRV', status:'used', maxUses:1, usedCount:1, costUSD:0.5, addedAt:'2025-05-20T10:05:00Z', soldTo:'Sara', expiresAt:'' },
    { id:'i3', email:'debojyotipatgiri@gmail.com', password:'RDW-vebzpjZD4EoCg', twoFA:'https://2fa.diaa.store/ZSX2KEBBD04', status:'available', maxUses:1, usedCount:0, costUSD:0.5, addedAt:'2025-05-21T09:00:00Z', soldTo:'', expiresAt:'' },
  ]},
  { id:'cat2', name:'ChatGPT Plus Accounts', type:'accounts', icon:'🤖', linkedProduct:'ChatGPT Plus', tags:['AI'], items:[
    { id:'i4', email:'gpt_user1@outlook.com', password:'SecurePass!99', twoFA:'', status:'available', maxUses:1, usedCount:0, costUSD:8, addedAt:'2025-05-19T08:00:00Z', soldTo:'', expiresAt:'2025-06-19T08:00:00Z' },
    { id:'i5', email:'gpt_user2@outlook.com', password:'AiPass#2024', twoFA:'', status:'available', maxUses:1, usedCount:0, costUSD:8, addedAt:'2025-05-20T12:00:00Z', soldTo:'', expiresAt:'2025-06-20T12:00:00Z' },
    { id:'i6', email:'gpt_sold@outlook.com', password:'OldPass123', twoFA:'', status:'used', maxUses:1, usedCount:1, costUSD:8, addedAt:'2025-05-15T10:00:00Z', soldTo:'Omar Hassan', expiresAt:'2025-06-15T10:00:00Z' },
  ]},
  { id:'cat3', name:'Adobe CC (30 Days)', type:'accounts', icon:'🎨', linkedProduct:'Adobe Creative Cloud', tags:['Design'], items:[
    { id:'i7', email:'adobe1@mail.com', password:'Adobe@2025', twoFA:'', status:'available', maxUses:1, usedCount:0, costUSD:15, addedAt:'2025-05-22T06:00:00Z', soldTo:'', expiresAt:'2025-06-22T06:00:00Z' },
  ]},
  { id:'cat4', name:'Spotify Premium Keys', type:'codes', icon:'🎵', linkedProduct:'Spotify Premium', tags:['Music'], items:[
    { id:'i8', email:'SPT-XXXX-YYYY-ZZZZ-1111', password:'', twoFA:'', status:'available', maxUses:1, usedCount:0, costUSD:3, addedAt:'2025-05-21T09:00:00Z', soldTo:'', expiresAt:'' },
    { id:'i9', email:'SPT-AAAA-BBBB-CCCC-2222', password:'', twoFA:'', status:'available', maxUses:1, usedCount:0, costUSD:3, addedAt:'2025-05-21T09:05:00Z', soldTo:'', expiresAt:'' },
    { id:'i10', email:'SPT-DDDD-EEEE-FFFF-3333', password:'', twoFA:'', status:'used', maxUses:1, usedCount:1, costUSD:3, addedAt:'2025-05-18T12:00:00Z', soldTo:'Khaled', expiresAt:'' },
  ]},
  { id:'cat5', name:'Netflix Premium', type:'accounts', icon:'🎬', linkedProduct:'Netflix Premium', tags:['Streaming'], items:[] },
  { id:'cat6', name:'US Cards (Nikocards)', type:'codes', icon:'💳', linkedProduct:'', tags:['Cards'], items:[
    { id:'i11', email:'NIKO-US-CARD-001', password:'CVV:445', twoFA:'', status:'available', maxUses:5, usedCount:2, costUSD:1, addedAt:'2025-05-20T14:00:00Z', soldTo:'', expiresAt:'' },
    { id:'i12', email:'NIKO-US-CARD-002', password:'CVV:312', twoFA:'', status:'available', maxUses:5, usedCount:0, costUSD:1, addedAt:'2025-05-20T14:05:00Z', soldTo:'', expiresAt:'' },
  ]},
];

export const statusColors = { available:'#10B981', used:'#6366F1', reserved:'#F59E0B', expired:'#EF4444' };
export const statusLabels = { available:['Available','متاح'], used:['Used','مكتمل'], reserved:['Reserved','محجوز'], expired:['Expired','منتهي'] };
export const allProducts = ['ChatGPT Plus','Adobe Creative Cloud','Spotify Premium','Netflix Premium','Gemini Advanced','Microsoft 365','YouTube Premium','Canva Pro','Grammarly Premium'];

export function timeAgo(d) {
  if (!d) return '—';
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 0) return 'future';
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
}

export function daysUntil(d) {
  if (!d) return null;
  const diff = Math.floor((new Date(d).getTime() - Date.now()) / 86400000);
  return diff;
}

export function getCatStats(cat) {
  const total = cat.items.length;
  const available = cat.items.filter(i => i.status === 'available').length;
  const used = cat.items.filter(i => i.status === 'used').length;
  const reserved = cat.items.filter(i => i.status === 'reserved').length;
  const expired = cat.items.filter(i => i.status === 'expired').length;
  const totalCost = cat.items.reduce((s, i) => s + (i.costUSD || 0), 0);
  const soldRevenue = cat.items.filter(i => i.status === 'used').reduce((s, i) => s + (i.costUSD || 0), 0);
  return { total, available, used, reserved, expired, totalCost, soldRevenue };
}

export function detectDelimiter(text) {
  const line = text.split('\n')[0] || '';
  if (line.includes('|')) return '|';
  if (line.includes('\t')) return '\t';
  if (line.includes(':')) return ':';
  return '|';
}

export function parseBulkData(text, delimiter) {
  return text.trim().split('\n').filter(l => l.trim()).map(line => {
    const parts = line.trim().split(delimiter);
    return { email: parts[0]?.trim() || '', password: parts[1]?.trim() || '', twoFA: parts[2]?.trim() || '' };
  });
}

export function findDuplicates(newItems, existingItems) {
  const existing = new Set(existingItems.map(i => i.email.toLowerCase()));
  return newItems.filter(i => existing.has(i.email.toLowerCase()));
}

export function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }
