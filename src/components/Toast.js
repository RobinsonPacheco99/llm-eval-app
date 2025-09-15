import React from 'react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.variant || ''}`} role="status">
          {t.message}
          <button onClick={() => onDismiss(t.id)} className="btn btn-ghost small" style={{ marginLeft: 8 }}>Cerrar</button>
        </div>
      ))}
    </div>
  );
}


