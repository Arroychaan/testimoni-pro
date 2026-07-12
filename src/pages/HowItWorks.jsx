import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { useTheme } from '../lib/ThemeContext';
import { 
  Key, Send, Edit3, ShieldCheck, Star, ArrowRight, 
  ClipboardCheck, Zap, MousePointerClick 
} from 'lucide-react';

export default function HowItWorks() {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/Assets/Logo/logo-dark-page.svg' : '/Assets/Logo/logo-white-page.svg';

  const bg = 'var(--color-bg)';
  const bgCard = 'var(--color-bg-elevated)';
  const text = 'var(--color-text)';
  const textSec = 'var(--color-text-secondary)';
  const textMut = 'var(--color-text-muted)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';
  const primaryLight = 'var(--color-primary-light)';

  const steps = [
    {
      number: '1',
      icon: <Key size={36} />,
      title: 'Pihak Bisnis Membuat Token Unik',
      desc: 'Setiap terdapat transaksi, Anda dapat membuat satu token unik melalui dasbor. Satu token mewakili satu transaksi untuk satu ulasan. Proses ini sangat praktis.',
      color: '#3b82f6',
    },
    {
      number: '2',
      icon: <Send size={36} />,
      title: 'Mengirimkan Token kepada Pelanggan',
      desc: 'Silakan bagikan token tersebut kepada pelanggan Anda melalui WhatsApp, surel, atau secara langsung. Token ini bersifat sekali pakai untuk menjaga keaslian ulasan.',
      color: '#8b5cf6',
    },
    {
      number: '3',
      icon: <Edit3 size={36} />,
      title: 'Pelanggan Menulis Ulasan',
      desc: 'Pelanggan akan membuka tautan yang Anda kirim, memasukkan token, dan menulis pengalaman mereka. Pelanggan juga dapat menambahkan foto pendukung.',
      color: '#ec4899',
    },
    {
      number: '4',
      icon: <ShieldCheck size={36} />,
      title: 'Sistem Verifikasi Otomatis',
      desc: 'Sistem kami akan memverifikasi validitas token dan transaksi. Setelah tervalidasi, ulasan akan langsung tayang pada profil bisnis Anda.',
      color: '#22c55e',
    },
    {
      number: '5',
      icon: <Star size={36} />,
      title: 'Ulasan Tampil & Reputasi Meningkat',
      desc: 'Seluruh ulasan akan terkumpul pada halaman profil publik bisnis Anda, memberikan bukti nyata bagi calon pelanggan baru.',
      color: '#f59e0b',
    },
  ];

  const benefits = [
    {
      icon: <Zap size={20} />,
      text: 'Gratis untuk 100 pendaftar pertama (berlaku 1 tahun)',
    },
    {
      icon: <MousePointerClick size={20} />,
      text: 'Pembuatan token cukup dalam 3 klik',
    },
    {
      icon: <ClipboardCheck size={20} />,
      text: 'Menjamin ulasan asli, bukan bot atau berbayar',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bg,
      color: text,
      fontFamily: 'var(--font-body)',
    }}>
      <Navbar />

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '7rem 1.5rem 5rem' }}>
        {/* Logo Center */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
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
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: text,
            marginBottom: '0.75rem',
          }}>
            Bagaimana Cara Kerjanya?
          </h1>
          <p style={{
            fontSize: '1.0625rem',
            color: textSec,
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Langkah sederhana untuk mulai mengumpulkan ulasan asli dari pelanggan Anda.
          </p>
        </div>

        {/* Steps - Vertical Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '3rem' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
              {/* Timeline line + circle */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: `${step.color}15`,
                  border: `2px solid ${step.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: step.color,
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {step.icon}
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    width: '2px',
                    flex: 1,
                    minHeight: '40px',
                    backgroundColor: border,
                    marginTop: '0.5rem',
                    marginBottom: '0.5rem',
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{
                flex: 1,
                paddingTop: '0.25rem',
                paddingBottom: i < steps.length - 1 ? '2.5rem' : '0',
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                  backgroundColor: `${step.color}15`,
                  color: step.color,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                }}>
                  Langkah {step.number}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: text,
                  marginBottom: '0.5rem',
                  lineHeight: 1.3,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '0.9375rem',
                  color: textSec,
                  lineHeight: 1.7,
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: border, marginBottom: '2.5rem' }} />

        {/* Benefit badges */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'center',
          marginBottom: '2.5rem',
        }}>
          {benefits.map((b, i) => (
            <div key={i} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.125rem',
              borderRadius: '9999px',
              backgroundColor: primaryLight,
              border: `1px solid var(--color-primary-border)`,
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: primary,
            }}>
              {b.icon}
              <span>{b.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          textAlign: 'center',
          padding: '2.5rem 2rem',
          borderRadius: '1.25rem',
          backgroundColor: bgCard,
          border: `1px solid ${border}`,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.375rem',
            fontWeight: 700,
            color: text,
            marginBottom: '0.5rem',
          }}>
            Apakah Anda Siap Memulai?
          </h2>
          <p style={{
            fontSize: '0.9375rem',
            color: textSec,
            marginBottom: '1.5rem',
            lineHeight: 1.6,
          }}>
            Daftarkan bisnis Anda sekarang juga. Tanpa perlu kartu kredit untuk memulai.
          </p>
          <Link
            to="/daftar"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              borderRadius: '0.75rem',
              backgroundColor: primary,
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-glow)',
              transition: 'all 0.2s ease',
            }}
          >
            Daftar Gratis Sekarang <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    </div>
  );
}