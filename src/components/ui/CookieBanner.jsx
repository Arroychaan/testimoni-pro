import { useCookieConsent } from '../../lib/CookieContext';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const { showBanner, acceptAll, acceptEssential, dismissBanner } = useCookieConsent();

  if (!showBanner) return null;

  const bg = 'var(--color-bg-elevated)';
  const text = 'var(--color-text)';
  const textSec = 'var(--color-text-secondary)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '1.5rem',
      zIndex: 9999,
      maxWidth: '320px',
      backgroundColor: bg,
      border: `1px solid ${border}`,
      borderRadius: '1rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      animation: 'slideUpToast 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <style>{`
        @keyframes slideUpToast {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 600px) {
          .cookie-toast {
            left: 1rem !important;
            right: 1rem !important;
            bottom: 1rem !important;
            maxWidth: none !important;
          }
        }
      `}</style>
      
      <div className="cookie-toast" style={{ display: 'contents' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ 
              backgroundColor: 'var(--color-primary-light)', 
              color: primary, 
              padding: '0.375rem', 
              borderRadius: '0.5rem',
              display: 'flex'
            }}>
              <Cookie size={16} />
            </div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: text, margin: 0 }}>
              Privasi & Cookie
            </h3>
          </div>
          <button
            onClick={dismissBanner}
            style={{
              background: 'none',
              border: 'none',
              color: textSec,
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              borderRadius: '0.25rem',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.8125rem', color: textSec, lineHeight: 1.6, margin: 0 }}>
          Kami menggunakan cookie untuk menganalisis trafik dan memberikan Anda pengalaman terbaik.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
          <button
            onClick={acceptEssential}
            style={{
              flex: 1,
              padding: '0.625rem',
              borderRadius: '0.5rem',
              border: `1px solid ${border}`,
              backgroundColor: 'var(--color-bg-secondary)',
              color: text,
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = textSec}
            onMouseOut={(e) => e.currentTarget.style.borderColor = border}
          >
            Tolak
          </button>
          <button
            onClick={acceptAll}
            style={{
              flex: 1,
              padding: '0.625rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: primary,
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = 0.9}
            onMouseOut={(e) => e.currentTarget.style.opacity = 1}
          >
            Terima Semua
          </button>
        </div>
      </div>
    </div>
  );
}