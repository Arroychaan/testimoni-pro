import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './lib/ThemeContext';
import { CookieProvider } from './lib/CookieContext';
import App from './App';

// Global listener to update mouse coordinates for background spotlight glows
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <CookieProvider>
        <App />
      </CookieProvider>
    </ThemeProvider>
  </StrictMode>
);
