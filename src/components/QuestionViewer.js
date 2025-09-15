import React, { useState } from 'react';

export default function QuestionViewer({ questions, onBack, onDone }) {
  const [edited, setEdited] = useState(() => questions);
  const invalids = edited.map(q => !q?.pregunta || (Array.isArray(q?.opciones) && q.opciones.some(o => !o)) || !q?.respuesta_correcta);
  const similarities = computeSimilarities(edited);

  function updateQuestion(index, updater) {
    setEdited(prev => prev.map((q, i) => i === index ? updater(q) : q));
  }

  return (
    <div className="container">
      <div className="card-hero light" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="icon-circle"><ListIcon /></div>
          <h2 className="section-title" style={{ color: '#0f172a', margin: 0 }}>Preguntas Generadas</h2>
        </div>
        <p className="desc" style={{ marginTop: 8 }}>Revise y edite el contenido antes de guardar.</p>
      </div>
      {edited.length === 0 && (
        <div className="card-hero light" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div className="icon-circle"><ListIcon /></div>
          </div>
          <div className="title-lg">Aún no hay preguntas</div>
          <p className="desc">Genere preguntas desde “Nuevo Examen” para comenzar.</p>
          <button className="btn-cta" onClick={onBack}>Crear preguntas</button>
        </div>
      )}
      <div className="grid" style={{ gap: 16 }}>
        {edited.map((q, idx) => (
          <div key={idx} className="card-hero light">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#0f172a' }}>Pregunta {idx + 1}</strong>
              {similarities[idx] && similarities[idx].score >= 0.8 && (
                <span className="btn btn-ghost small" title={`Similar a #${similarities[idx].matchIndex + 1} (${Math.round(similarities[idx].score*100)}%)`}>
                  Posible duplicado · {Math.round(similarities[idx].score*100)}%
                </span>
              )}
            </div>
            {invalids[idx] && <small className="muted" style={{ color: '#ef4444' }}>Completa el enunciado, opciones y respuesta.</small>}
            {q.imagenUrl && (
              <div style={{ margin: '12px 0' }}>
                <img src={q.imagenUrl} alt={q.descripcion_logica || 'Imagen de la pregunta'} style={{ maxWidth: '100%', borderRadius: 8 }} />
              </div>
            )}
            <textarea className="textarea" value={q.pregunta} onChange={(e) => updateQuestion(idx, (old) => ({ ...old, pregunta: e.target.value }))} />
            {Array.isArray(q.opciones) && (
              <div className="grid" style={{ gap: 8 }}>
                {q.opciones.map((opt, oi) => (
                  <input key={oi} className="input" value={opt} onChange={(e) => updateQuestion(idx, (old) => ({ ...old, opciones: old.opciones.map((o, j) => j === oi ? e.target.value : o) }))} />
                ))}
              </div>
            )}
            <label className="grid" style={{ gap: 8, marginTop: 12 }}>
              <span>Respuesta correcta</span>
              <input className="input" value={q.respuesta_correcta || ''} onChange={(e) => updateQuestion(idx, (old) => ({ ...old, respuesta_correcta: e.target.value }))} />
            </label>
          </div>
        ))}
      </div>
      <div className="card-hero light" style={{ marginTop: 16 }}>
        <div className="title-lg">Resumen</div>
        <p className="desc" style={{ marginTop: 4 }}>
          {edited.length} preguntas • {invalids.filter(Boolean).length} con campos incompletos
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={onBack} className="btn btn-ghost">Volver</button>
          <button onClick={() => onDone(edited)} className="btn-cta" disabled={invalids.some(Boolean)}>Guardar</button>
          <PrintButton questions={edited} disabled={invalids.some(Boolean)} />
          <DocButton questions={edited} disabled={invalids.some(Boolean)} />
        </div>
      </div>
    </div>
  );
}

function ListIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="5" width="16" height="14" rx="3" stroke="#1e90ff" strokeWidth="1.5" fill="#eaf2ff"/>
      <path d="M7 9h10M7 12h7M7 15h10" stroke="#1e90ff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Simple similarity check using normalized text and Jaccard over word sets
function computeSimilarities(items) {
  const normalize = (t) => (t || '')
    .toLowerCase()
    .replace(/[^a-záéíóúñ0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const wordSets = items.map(q => new Set(normalize(q?.pregunta)));
  const sims = items.map(() => null);
  for (let i = 0; i < items.length; i++) {
    let best = { score: 0, matchIndex: -1 };
    for (let j = 0; j < items.length; j++) {
      if (i === j) continue;
      const a = wordSets[i];
      const b = wordSets[j];
      const inter = [...a].filter(w => b.has(w)).length;
      const union = new Set([...a, ...b]).size || 1;
      const score = inter / union;
      if (score > best.score) best = { score, matchIndex: j };
    }
    sims[i] = best;
  }
  return sims;
}

function PrintButton({ questions, disabled }) {
  function openPrint() {
    const win = window.open('', '_blank');
    if (!win) return;
    const styles = `body{font-family:ui-sans-serif,system-ui;padding:24px;color:#0f172a} h1{margin:0 0 12px 0} .q{margin:12px 0;padding-bottom:8px;border-bottom:1px solid #e2e8f0}`;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Examen</title><style>${styles}</style></head><body>`+
      `<h1>Examen</h1>`+
      questions.map((q,i)=>`<div class="q"><strong>${i+1}. ${escapeHtml(q.pregunta)}</strong>`+
        (Array.isArray(q.opciones)?`<ol type="A">${q.opciones.map(o=>`<li>${escapeHtml(o)}</li>`).join('')}</ol>`:'')+
      `</div>`).join('')+
    `</body></html>`;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }
  return <button className="btn btn-ghost" onClick={openPrint} disabled={disabled}>Exportar PDF</button>;
}

function DocButton({ questions, disabled }) {
  function downloadDoc() {
    const content = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>`+
      `<h1>Examen</h1>`+
      questions.map((q,i)=>`<p><strong>${i+1}. ${escapeHtml(q.pregunta)}</strong></p>`+
        (Array.isArray(q.opciones)?`<ol type="A">${q.opciones.map(o=>`<li>${escapeHtml(o)}</li>`).join('')}</ol>`:'')
      ).join('')+
      `</body></html>`;
    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'examen.doc';
    a.click();
    URL.revokeObjectURL(url);
  }
  return <button className="btn btn-ghost" onClick={downloadDoc} disabled={disabled}>Exportar Word</button>;
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
