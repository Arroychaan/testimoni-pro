import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../../lib/CookieContext';
import { Cookie, ShieldCheck, BarChart3, Megaphone, ChevronDown, X } from 'lucide-react';

export default function CookieBanner() {
  const { showBanner, acceptAll, acceptEssential, dismissBanner } = useCookieConsent();
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!showBanner) return null;

  const bg = 'var(--color-bg-elevated)';
  const text = 'var(--color-text)';
  const textSec = 'var(--color-text-secondary)';
  const textMut = 'var(--color-text-muted)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';

  const cookieTypes = [
    {
      icon: <ShieldCheck size={16} />,
      name: 'Esensial',
      desc: 'Wajib. Diperlukan agar situs web dapat beroperasi secara normal.',
      alwaysOn: true,
      color: '#22c55e',
    },
    {
      icon: <BarChart3 size={16} />,
      name: 'Analitik',
      desc: 'Membantu kami memahami halaman mana yang paling sering dikunjungi.',
      alwaysOn: false,
      color: '#3b82f6',
    },
    {
      icon: <Megaphone size={16} />,
      name: 'Marketing',
      desc: 'Memungkinkan kami memberikan informasi yang relevan untuk Anda.',
      alwaysOn: false,
      color: '#8b5cf6',
    },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      padding: '0 1rem 1.5rem',
      pointerEvents: 'none',
    }}>
      <div style={{
        maxWidth: '560px',
        margin: '0 auto',
        pointerEvents: 'auto',
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: '1.25rem',
        boxShadow: '0 -4px 40px rgba(0,0,0,0.12)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.25rem 0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '0.75rem',
              backgroundColor: 'var(--color-primary-light)',
              color: primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Cookie size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 700,
                color: text,
                marginBottom: '0.25rem',
              }}>
                Situs web ini menggunakan cookie 🍪
              </h3>
              <p style={{
                fontSize: '0.8125rem',
                color: textSec,
                lineHeight: 1.6,
              }}>
                Kami menggunakan cookie untuk memastikan pengalaman yang optimal di TestimoniPro.
                Terdapat cookie esensial dan opsional — Anda memiliki kebebasan untuk mengaturnya.
              </p>
            </div>
            <button
              onClick={dismissBanner}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: textMut,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Expandable Details */}
        {detailsOpen && (
          <div style={{
            padding: '0.5rem 1.25rem 0.75rem',
            borderTop: `1px solid ${border}`,
          }}>
            {cookieTypes.map((type, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.625rem',
                  padding: '0.625rem 0',
                  borderBottom: i < cookieTypes.length - 1 ? `1px solid ${border}` : 'none',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '0.5rem',
                  backgroundColor: `${type.color}15`,
                  color: type.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {type.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: text }}>{type.name}</span>
                    {type.alwaysOn && (
                      <span style={{
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        backgroundColor: '#dcfce7',
                        color: '#16a34a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        Selalu Aktif
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: textMut, lineHeight: 1.5 }}>{type.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <style>{`
          .cookie-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1.25rem 1.25rem;
            gap: 1rem;
          }
          .cookie-buttons {
            display: flex;
            gap: 0.5rem;
            align-items: center;
          }
          @media (max-width: 580px) {
            .cookie-actions {
              flex-direction: column-reverse;
              align-items: stretch;
            }
            .cookie-buttons {
              flex-direction: column;
              width: 100%;
            }
            .cookie-buttons > * {
              width: 100%;
              text-align: center;
              justify-content: center;
            }
            .cookie-detail-btn {
              align-self: center;
              margin-top: 0.5rem;
            }
          }
        `}</style>
        <div className="cookie-actions">
          <button
            className="cookie-detail-btn"
            onClick={() => setDetailsOpen(!detailsOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              color: textSec,
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {detailsOpen ? 'Sembunyikan' : 'Lihat Detail'}
            <ChevronDown
              size={14}
              style={{
                transform: detailsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>

          <div className="cookie-buttons">
            <button
              onClick={acceptEssential}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: `1px solid ${border}`,
                backgroundColor: 'var(--color-bg-secondary)',
                color: text,
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Hanya yang Wajib
            </button>
            <Link
              to="/cookie-settings"
              onClick={dismissBanner}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: `1px solid ${border}`,
                backgroundColor: 'var(--color-bg-secondary)',
                color: text,
                fontSize: '0.8125rem',
                fontWeight: 600,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Atur Sendiri
            </Link>
            <button
              onClick={acceptAll}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: primary,
                color: '#fff',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-glow)',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Oke, Izinkan Semua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}