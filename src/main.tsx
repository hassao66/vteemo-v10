import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { validateEnv } from './config/env';
import './index.css';

try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error);
  document.getElementById('root')!.innerHTML = `
    <div style="display: flex; align-items: center; justify-center; min-height: 100vh; padding: 1rem; background: #f9fafb;">
      <div style="max-width: 32rem; padding: 2rem; background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h1 style="color: #dc2626; font-size: 1.5rem; margin-bottom: 1rem;">خطای پیکربندی</h1>
        <p style="color: #4b5563; margin-bottom: 1rem;">متغیرهای محیطی به درستی تنظیم نشده‌اند.</p>
        <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.25rem; overflow-x: auto; font-size: 0.875rem;">${error}</pre>
      </div>
    </div>
  `;
  throw error;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);