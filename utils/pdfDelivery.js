function ascii(value) {
  return String(value ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'").replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-').replace(/…/g, '...')
    .replace(/[^\x20-\x7E]/g, '?');
}

function escapePdf(value) {
  return ascii(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString('fr-FR');
}

function wrap(text, max = 82) {
  const words = ascii(text).split(/\s+/).filter(Boolean);
  if (!words.length) return ['-'];
  const lines = [];
  let current = '';
  for (const word of words) {
    if (!current) current = word;
    else if ((current + ' ' + word).length <= max) current += ' ' + word;
    else { lines.push(current); current = word; }
  }
  if (current) lines.push(current);
  return lines;
}

function field(lines, label, value) {
  const wrapped = wrap(`${label} : ${value || '-'}`);
  lines.push(...wrapped);
}

function historyLines(delivery) {
  const result = [];
  for (const item of delivery.history || []) {
    result.push(`${formatDate(item.date)} - ${item.status || '-'}` + (item.comment ? ` - ${item.comment}` : ''));
  }
  return result;
}

function buildLines(delivery, kind, extra = {}) {
  const title = kind === 'handoff' ? 'FICHE DE REMISE' : 'FICHE DE RECEPTION';
  const lines = [title, `Reference : ${delivery.reference || '-'}`, ''];
  field(lines, 'Statut', delivery.status);
  field(lines, 'Client', `${delivery.client?.firstName || ''} ${delivery.client?.lastName || ''}`.trim());
  field(lines, 'Telephone client', delivery.client?.phone);
  field(lines, 'Commercant', delivery.merchantName || delivery.merchant || delivery.commercantName);
  field(lines, 'Point relais', delivery.relayPoint || delivery.relayName);
  field(lines, 'Livreur / transporteur', delivery.carrierName);
  field(lines, 'Contenu', delivery.contents || delivery.type);
  field(lines, 'Quantite', delivery.quantity ?? 1);
  field(lines, 'Poids', `${delivery.weight ?? 0} kg`);
  field(lines, 'Reception prevue', formatDate(delivery.date || delivery.expectedReceptionDate));
  field(lines, 'Reception reelle', formatDate(delivery.receivedAt));
  field(lines, 'Date limite de retrait', formatDate(delivery.pickupDeadline));
  if (kind === 'receipt') {
    field(lines, 'Observation reception', extra.comment || delivery.receptionComment || delivery.refusalReason);
  }
  if (kind === 'handoff') {
    const proof = extra.proof || delivery.handoffProof || {};
    field(lines, 'Remis a', proof.recipientName);
    field(lines, "Mode d'identification", String(proof.identification || '').replaceAll('_', ' '));
    field(lines, 'Reference de preuve', proof.proofReference);
    field(lines, 'Remis le', formatDate(delivery.handedOffAt));
  }
  const history = historyLines(delivery);
  if (history.length) {
    lines.push('', 'HISTORIQUE');
    for (const h of history) lines.push(...wrap(h));
  }
  lines.push('', `Document genere le ${new Date().toLocaleString('fr-FR')}`);
  return lines;
}

function pageStream(lines) {
  const commands = ['BT', '/F1 11 Tf', '48 790 Td', '15 TL'];
  lines.forEach((line, index) => {
    if (index === 0) commands.push('/F1 16 Tf');
    if (index === 1) commands.push('/F1 11 Tf');
    commands.push(`(${escapePdf(line)}) Tj`, 'T*');
  });
  commands.push('ET');
  return commands.join('\n');
}

function buildPdf(lines) {
  const maxLines = 45;
  const pages = [];
  for (let i = 0; i < lines.length; i += maxLines) pages.push(lines.slice(i, i + maxLines));

  const objects = [];
  // 1 catalog, 2 pages tree, 3 font; page/content objects start at 4.
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  const kids = [];
  let obj = 4;
  for (const pageLines of pages) {
    const pageObj = obj++;
    const contentObj = obj++;
    kids.push(`${pageObj} 0 R`);
    objects[pageObj] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObj} 0 R >>`;
    const stream = pageStream(pageLines);
    objects[contentObj] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  }
  objects[2] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`;
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let i = 1; i < objects.length; i++) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objects.length; i++) pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return pdf;
}

export function downloadDeliveryPdf(delivery, kind = 'receipt', extra = {}) {
  const lines = buildLines(delivery, kind, extra);
  const pdf = buildPdf(lines);
  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${kind === 'handoff' ? 'fiche-remise' : 'fiche-reception'}-${delivery.reference || delivery.id || 'colis'}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
