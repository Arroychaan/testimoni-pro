import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { useTheme } from '../lib/ThemeContext';
import { MessageCircle, Phone, Mail, ArrowRight, Sparkles, X, ChevronRight, Clock, MapPin } from 'lucide-react';

export default function HelpCenter() {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/Assets/Logo/logo-dark-page.svg' : '/Assets/Logo/logo-white-page.svg';

  const bg = 'var(--color-bg)';
  const bgCard = 'var(--color-bg-elevated)';
  const bgSecondary = 'var(--color-bg-secondary)';
  const text = 'var(--color-text)';
  const textSec = 'var(--color-text-secondary)';
  const textMut = 'var(--color-text-muted)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';
  const primaryLight = 'var(--color-primary-light)';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bg,
      color: text,
      fontFamily: 'var(--font-body)',
    }}>
      <Navbar />

      <main style={{ maxWidth: '880px', margin: '0 auto', padding: '7rem 1.5rem 5rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-block',
            width: '140px',
            height: '28px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <img
              src={logoSrc}
              alt="TestimoniPro"
              style={{
                position: 'absolute',
                left: '-32px',
                top: '-90px',
                width: '200px',
                height: '200px',
                maxWidth: 'none',
              }}
            />
          </div>
        </div>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: text,
            marginBottom: '0.75rem',
          }}>
            Pusat Bantuan
          </h1>
          <p style={{
            fontSize: '1.0625rem',
            color: textSec,
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Kami siap membantu Anda. Silakan pilih metode yang paling nyaman untuk menghubungi tim dukungan kami.
          </p>
        </div>

        {/* AI Assistant - Disabled */}
        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          borderRadius: '1rem',
          backgroundColor: bgCard,
          border: `1px solid ${border}`,
          opacity: 0.5,
          position: 'relative',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: text,
                marginBottom: '0.125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                AI Assistance
                <span style={{
                  display: 'inline-block',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: '#fef3c7',
                  color: '#d97706',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Akan Datang
                </span>
              </h3>
              <p style={{ fontSize: '0.8125rem', color: textMut }}>
                Ajukan pertanyaan kepada asisten AI kami kapan saja untuk mendapatkan jawaban instan.
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            backgroundColor: bgSecondary,
            border: `1px solid ${border}`,
          }}>
            <input
              type="text"
              placeholder="Ketik pertanyaan Anda di sini..."
              disabled
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: text,
                fontSize: '0.9375rem',
                cursor: 'not-allowed',
              }}
            />
            <div style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--color-primary-light)',
              color: primary,
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              flexShrink: 0,
            }}>
              <X size={12} />
              <span>Segera</span>
            </div>
          </div>
        </div>

        {/* Contact Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          {/* WhatsApp */}
          <a
            href="https://wa.me/62812XXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '1.5rem',
              borderRadius: '1rem',
              backgroundColor: bgCard,
              border: `1px solid ${border}`,
              textDecoration: 'none',
              color: text,
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '0.75rem',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Phone size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: text,
                marginBottom: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                WhatsApp
                <span style={{
                  display: 'inline-block',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Cepat
                </span>
              </h3>
              <p style={{ fontSize: '0.875rem', color: textSec, lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Berkomunikasi langsung dengan tim dukungan kami melalui WhatsApp. Dapatkan respons dalam hitungan menit.
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: primary,
              }}>
                +62 812-XXXX-XXXX
                <ArrowRight size={14} />
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: textMut,
                marginTop: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}>
                <Clock size={12} />
                Sen–Sab, 08:00–20:00 WIB
              </p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:support@testimonipro.site"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '1.5rem',
              borderRadius: '1rem',
              backgroundColor: bgCard,
              border: `1px solid ${border}`,
              textDecoration: 'none',
              color: text,
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '0.75rem',
              backgroundColor: '#dbeafe',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Mail size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: text,
                marginBottom: '0.375rem',
              }}>
                Email
              </h3>
              <p style={{ fontSize: '0.875rem', color: textSec, lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Kirimkan pertanyaan terperinci Anda melalui email. Kami akan merespons dalam waktu 1×24 jam.
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: primary,
              }}>
                support@testimonipro.site
                <ArrowRight size={14} />
              </div>
            </div>
          </a>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: border, marginBottom: '2rem' }} />

        {/* FAQ Quick Links */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.125rem',
            fontWeight: 700,
            color: text,
            marginBottom: '1rem',
          }}>
            Pertanyaan Umum
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            {[
              { q: 'Bagaimana cara mendaftarkan bisnis?', to: '/cara-kerja' },
              { q: 'Apa itu TP Trust Grade?', to: '/trust-grade' },
              { q: 'Apakah data saya aman?', to: '/privacy' },
              { q: 'Bagaimana cara kerja token unik?', to: '/cara-kerja' },
            ].map((faq, i) => (
              <Link
                key={i}
                to={faq.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 1.125rem',
                  borderRadius: '0.75rem',
                  backgroundColor: bgCard,
                  border: `1px solid ${border}`,
                  textDecoration: 'none',
                  color: text,
                  transition: 'border-color 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <MessageCircle size={16} style={{ color: primary, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{faq.q}</span>
                </div>
                <ChevronRight size={16} style={{ color: textMut, flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          borderRadius: '1rem',
          backgroundColor: bgCard,
          border: `1px solid ${border}`,
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
          }}>
            <MapPin size={18} style={{ color: textMut }} />
            <span style={{ fontSize: '0.875rem', color: textMut }}>
              Semarang, Indonesia
            </span>
          </div>
          <p style={{ fontSize: '0.9375rem', color: textSec, marginBottom: '1rem', lineHeight: 1.6 }}>
            Tim dukungan kami selalu siap membantu dalam membangun reputasi digital bisnis Anda.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.5rem',
              borderRadius: '0.75rem',
              backgroundColor: primary,
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  );
}