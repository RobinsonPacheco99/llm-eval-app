import React, { useState } from 'react';
import { generateQuestions } from '../services/api';

export default function ExamForm({ onCancel, onQuestionsGenerated }) {
  const [topic, setTopic] = useState('');
  const [questionType, setQuestionType] = useState('opcion_multiple');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ topic: false, count: false });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!topic) { setError('Ingrese un tema.'); return; }
    if (count < 1 || count > 50) { setError('Número de preguntas entre 1 y 50.'); return; }
    try {
      setLoading(true);
      const questions = await generateQuestions({ tema: topic, tipo: questionType, cantidad: Number(count) });
      onQuestionsGenerated(questions);
    } catch (err) {
      setError('No se pudieron generar preguntas.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card-hero light" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12 }}>
          <div className="icon-circle" style={{ width: '120px', height: '120px' }}><FormIcon /></div>
          <h2 className="section-title" style={{ color: '#0f172a', margin: 0, fontSize: '28px' }}>Generar Examen</h2>
        </div>
        <p className="desc" style={{ marginTop: 0, fontSize: '18px' }}>Defina el tema, tipo y cantidad de preguntas.</p>
        <form onSubmit={handleSubmit} className="grid" style={{ gap: 24 }}>
          <label className="grid" style={{ gap: 12 }}>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>Tema/Materia</span>
            {loading ? <div className="skeleton skeleton-lg" style={{ height: '56px' }} /> : (
              <>
                <input className="input" value={topic}
                       onBlur={() => setTouched(v => ({ ...v, topic: true }))}
                       onChange={(e) => setTopic(e.target.value)}
                       placeholder="Historia, Física Cuántica"
                       style={{ padding: '16px', fontSize: '16px', height: '56px' }} />
                {touched.topic && !topic && <small className="muted" style={{ color: '#ef4444', fontSize: '14px' }}>Este campo es obligatorio.</small>}
              </>
            )}
          </label>

          <label className="grid" style={{ gap: 12 }}>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>Tipo de Pregunta</span>
            {loading ? <div className="skeleton skeleton-lg" style={{ height: '56px' }} /> : (
              <select className="select" value={questionType} onChange={(e) => setQuestionType(e.target.value)}
                      style={{ padding: '16px', fontSize: '16px', height: '56px' }}>
                <option value="opcion_multiple">Opción Múltiple</option>
                <option value="verdadero_falso">Verdadero/Falso</option>
                <option value="matriz_logica">Matriz de Lógica</option>
              </select>
            )}
          </label>

          <label className="grid" style={{ gap: 12 }}>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>Número de Preguntas</span>
            {loading ? <div className="skeleton skeleton-lg" style={{ height: '56px' }} /> : (
              <>
                <input className="input" type="number" value={count}
                       onBlur={() => setTouched(v => ({ ...v, count: true }))}
                       onChange={(e) => setCount(e.target.value)} min={1} max={50}
                       style={{ padding: '16px', fontSize: '16px', height: '56px' }} />
                {touched.count && (count < 1 || count > 50) && <small className="muted" style={{ color: '#ef4444', fontSize: '14px' }}>Debe estar entre 1 y 50.</small>}
              </>
            )}
          </label>

          {error && <div style={{ color: '#ef4444', fontSize: '16px', padding: '12px' }}>{error}</div>}

          <div style={{ display: 'flex', gap: 16, marginTop: '8px' }}>
            <button type="button" onClick={onCancel} className="btn btn-ghost" 
                    style={{ padding: '16px 24px', fontSize: '16px', fontWeight: '600' }}>Cancelar</button>
            <button type="submit" disabled={loading} className="btn-cta"
                    style={{ padding: '16px 24px', fontSize: '16px', fontWeight: '600' }}>{loading ? 'Generando…' : 'Generar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="16" rx="3" stroke="#1e90ff" strokeWidth="1.5" fill="#eaf2ff"/>
      <path d="M7 9h10M7 13h6" stroke="#1e90ff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}



