import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
// Check for localStorage availability
const checkStorage = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);
root.render(<React.StrictMode>
    <ErrorBoundary>
      {!checkStorage() ? <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Lagring inte tillgänglig
            </h1>
            <p className="text-gray-600">
              Din webbläsare har begränsad åtkomst till lokal lagring. Detta kan
              bero på privat surfläge eller cookie-inställningar.
            </p>
          </div>
        </div> : <App />}
    </ErrorBoundary>
  </React.StrictMode>);