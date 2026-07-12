import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { ArrowRight, ShieldCheck, Play, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

const LandingPage = () => {
  const { theme } = useTheme();
  const footerLogo = theme === 'dark' ? '/Assets/Logo/logo-dark-page.svg' : '/Assets/Logo/logo-white-page.svg';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        position: 'relative',
        padding: '9rem 0 6rem',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at top, var(--color-primary-light), var(--color-bg) 60%)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

            {/* Left */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.375rem 1rem', borderRadius: '9999px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                fontSize: '0.875rem', fontWeight: 600,
                border: '1px solid var(--color-primary-border)',
                marginBottom: '1.5rem',
              }}>
                <ShieldCheck size={16} />
                <span>Infrastruktur Kepercayaan Bisnis Digital</span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.12,
                marginBottom: '1.5rem',
                color: 'var(--color-text)',
              }}>
                Jadikan Setiap Pengalaman Pelanggan Sebagai{' '}
                <span style={{ color: 'var(--color-primary)' }}>Bukti Kredibilitas.</span>
              </h1>

              <p style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '2rem',
                maxWidth: '500px',
                lineHeight: 1.7,
              }}>
                Bangun reputasi digital yang kuat untuk bisnis Anda. Setiap transaksi diverifikasi
                dengan Token Unik sekali pakai — menghasilkan ulasan autentik dan terpercaya.
              </p>

              <div className="hero-cta" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href="/daftar"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.875rem 1.75rem',
                    borderRadius: '0.75rem',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff', fontWeight: 700, fontSize: '0.9375rem',
                    textDecoration: 'none',
                    border: 'none',
                    boxShadow: 'var(--shadow-glow)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Daftar Gratis Sekarang <ArrowRight size={18} />
                </a>
                <Link to="/cara-kerja" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 1.75rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--color-bg-elevated)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  fontWeight: 600, fontSize: '0.9375rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}>
                  <Play size={18} />
                  Pelajari Cara Kerja
                </Link>
              </div>
            </div>

            {/* Right: Mockup */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'var(--color-primary-light)',
                filter: 'blur(64px)', borderRadius: '3rem',
                transform: 'scale(1.1)', zIndex: 0,
              }} />
              <div style={{
                position: 'relative', zIndex: 1,
                backgroundColor: 'var(--color-bg-elevated)',
                borderRadius: '1.5rem',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden',
              }}>
                {/* Card Header */}
                <div style={{
                  padding: '1.5rem', borderBottom: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                      color: 'var(--color-primary)', fontWeight: 700,
                      fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                      marginBottom: '0.375rem',
                    }}>
                      <ShieldCheck size={14} /> Verified Profile
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
                      Klinik Aura Beauty
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      📍 Semarang, ID &nbsp;|&nbsp; ID: #B-AURA88
                    </p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
                    color: '#fff', borderRadius: '0.75rem', padding: '0.75rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    boxShadow: 'var(--shadow-glow)',
                  }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.1em', opacity: 0.8, textTransform: 'uppercase' }}>Grade</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>TP-98</span>
                  </div>
                </div>
                {/* Card Body */}
                <div style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                    Laporan Integritas Transaksi
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '0.75rem', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>128</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Transaksi Diaudit</div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '0.75rem', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>100%</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Keaslian Ulasan</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      'Token unik untuk setiap transaksi',
                      'Pemindaian Anti-Sybil perangkat unik',
                      'Poin loyalitas untuk pemilik ulasan asli',
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} style={{ color: 'var(--color-primary)', marginTop: '0.125rem', flexShrink: 0 }} />
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '4rem 0',
        backgroundColor: 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-muted)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem' }}>
          <div>
            <div style={{ width: '140px', height: '28px', overflow: 'hidden', position: 'relative', marginBottom: '1rem', marginLeft: '-8px' }}>
              <img
                src={footerLogo}
                alt="TestimoniPro"
                style={{ position: 'absolute', left: '-32px', top: '-90px', width: '200px', height: '200px', maxWidth: 'none' }}
              />
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
              Infrastruktur reputasi digital untuk bisnis di era social commerce.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Produk & Layanan
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/trust-grade" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>TP Trust Grade (0–100)</Link></li>
              <li><Link to="/pricing" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Harga Layanan</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Bantuan & Dukungan
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/help" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Pusat Bantuan</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Hubungi Kami</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
              Kepercayaan & Hukum
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/privacy" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Kebijakan Privasi</Link></li>
              <li><Link to="/terms" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Ketentuan Layanan</Link></li>
              <li><Link to="/cookie-settings" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Pengaturan Cookies</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;