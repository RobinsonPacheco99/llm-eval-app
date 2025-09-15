import './App.css';
import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ExamForm from './components/ExamForm';
import QuestionViewer from './components/QuestionViewer';
import Toast from './components/Toast';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function AppShell() {
  const [activeView, setActiveView] = useState('examForm');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const { user, logout } = useAuth();

  if (!user) {
    return (
      <AuthRoutes theme={theme} setTheme={setTheme} onAuthed={() => setActiveView('examForm')} />
    );
  }

  return (
    <div className="App app-shell">
      <header className="app-header">
        <h1>LLM Exam Builder</h1>
        <div className="nav-actions">
          <button 
            className="btn btn-ghost" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="btn btn-ghost" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <nav className="topnav">
        <div className="brand">LLM Exam Builder</div>
        <div className="nav-actions">
          <button className="btn btn-ghost">Panel</button>
          <button className="btn btn-ghost">Nuevo Examen</button>
          <button className="btn btn-ghost">Banco</button>
          <button className="btn btn-ghost">Pertinencia 🎯</button>
        </div>
      </nav>

      {activeView === 'examForm' && (
        <ExamForm 
          onCancel={() => {}}
          onQuestionsGenerated={(questions) => { 
            setGeneratedQuestions(questions); 
            setActiveView('viewer'); 
          }} 
        />
      )}

      {activeView === 'viewer' && (
        <QuestionViewer 
          questions={generatedQuestions}
          onBack={() => setActiveView('examForm')}
          onDone={(edited) => { 
            setGeneratedQuestions(edited); 
            setToasts(t => [...t, { 
              id: Date.now().toString(), 
              message: 'Preguntas guardadas correctamente', 
              variant: 'success' 
            }]); 
            setActiveView('examForm'); 
          }} 
        />
      )}
      
      <Toast toasts={toasts} onDismiss={(id) => setToasts(ts => ts.filter(t => t.id !== id))} />
    </div>
  );
}

function AuthRoutes({ theme, setTheme, onAuthed }) {
  const [mode, setMode] = useState('login');

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        {mode === 'login' ? (
          <Login onRegister={() => setMode('register')} onSuccess={onAuthed} />
        ) : (
          <Register onLogin={() => setMode('login')} onSuccess={onAuthed} />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;