import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { runDebugTest } from './debug-algorithms';
import './index.css';
// import { testAlgorithmCompliance } from './test-algorithm-compliance';
import { runComprehensiveTest } from './test-algorithms';

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Make debug functions available in browser console for development
(window as any).runDebugTest = runDebugTest;
(window as any).runComprehensiveTest = runComprehensiveTest;
