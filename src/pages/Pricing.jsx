import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { useTheme } from '../lib/ThemeContext';
import { Check, Zap, ShieldCheck, Star, ArrowRight, Gift, Clock, Users, MessageCircle, TrendingUp } from 'lucide-react';

export default function Pricing() {
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

  const plans = [
    {
      name: 'Gratis',
      tagline: 'Bagi bisnis yang baru memulai',
      price: 'Rp 0',
      period: '/bulan',
      subInfo: 'Gratis selamanya tanpa batasan waktu.',
      cta: 'Daftar Gratis',
      href: '/daftar',
      highlighted: false,
      features: [
        'Halaman profil bisnis publik',
        'Pembuatan token unik tanpa batas',
        'Kumpulkan ulasan tanpa batasan',
        'TP Trust Grade otomatis',
        'Tema gelap & terang',
        'Dukungan WhatsApp & Email',
      ],
    },
    {
      name: 'Pro',
      tagline: 'Bagi bisnis yang ingin berkembang',
      price: 'Rp 0',
      period: '/bulan',
      originalPrice: 'Rp 150.000',
      subInfo: 'Gratis untuk 100 pendaftar pertama!',
      cta: 'Dapatkan Sekarang — Gratis',
      href: '/daftar',
      highlighted: true,
      features: [
        'Semua fitur Gratis',
        'Hapus branding TestimoniPro',
        'Domain kustom (brandanda.com/ulasan)',
        'Integrasi WhatsApp auto-reply',
        'Analitik lanjutan & laporan bulanan',
        'API akses penuh',
        'Prioritas support < 2 jam',
        'Badge "Verified Pro" di profil',
      ],
    },
    {
      name: 'Enterprise',
      tagline: 'Untuk jaringan & franchise',
      price: 'Hubungi Kami',
      period: '',
      subInfo: 'Harga disesuaikan dengan kebutuhan',
      cta: 'Hubungi Sales',
      href: '/contact',
      highlighted: false,
      features: [
        'Semua fitur Pro',
        'Multi-cabang dashboard',
        'Unlimited admin seats',
        'Dedicated account manager',
        'Custom integration',
        'SLA 99.9% uptime guarantee',
        'Pelatihan tim (online)',
        'White-label penuh',
      ],
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

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '7rem 1.5rem 5rem' }}>
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 1rem',
            borderRadius: '9999px',
            backgroundColor: '#fef3c7',
            border: '1px solid #fcd34d',
            color: '#d97706',
            fontSize: '0.8125rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}>
            <Gift size={14} />
            <span>Promo Launch — PRO gratis untuk 100 pendaftar pertama!</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: text,
            marginBottom: '0.75rem',
          }}>
            Gratis Tanpa Biaya Tersembunyi.
          </h1>
          <p style={{
            fontSize: '1.0625rem',
            color: textSec,
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Paket Gratis berlaku selamanya tanpa batas. Paket Pro juga dapat dinikmati gratis selama kuota 100 pendaftar pertama belum terpenuhi. Daftar sekarang tanpa memerlukan kartu kredit.
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          {plans.map((plan, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem',
                borderRadius: '1.25rem',
                backgroundColor: plan.highlighted ? primaryLight : bgCard,
                border: plan.highlighted
                  ? `2px solid var(--color-primary-border)`
                  : `1px solid ${border}`,
                position: 'relative',
              }}
            >
              {plan.highlighted && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '0.375rem 1.25rem',
                  borderRadius: '9999px',
                  backgroundColor: '#d97706',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4)',
                }}>
                  🚀 Promo Launch — Gratis!
                </div>
              )}

              {/* Plan Header */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: text,
                  marginBottom: '0.25rem',
                }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: textMut }}>{plan.tagline}</p>
              </div>

              {/* Price */}
              <div style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                {plan.originalPrice ? (
                  <>
                    <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      color: '#22c55e',
                      lineHeight: 1,
                    }}>
                      {plan.price}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: textMut,
                      textDecoration: 'line-through',
                      lineHeight: 1,
                    }}>
                      {plan.originalPrice}
                    </span>
                    {plan.period && (
                      <span style={{ fontSize: '0.9375rem', color: textMut }}>
                        {plan.period}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      color: text,
                      lineHeight: 1,
                    }}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span style={{ fontSize: '0.9375rem', color: textMut }}>
                        {plan.period}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Sub Info */}
              {plan.subInfo && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.8125rem',
                  color: plan.originalPrice ? '#f59e0b' : '#22c55e',
                  fontWeight: 600,
                  marginBottom: '1.25rem',
                }}>
                  <Clock size={14} />
                  <span>{plan.subInfo}</span>
                </div>
              )}
              {!plan.subInfo && plan.name === 'Enterprise' && (
                <p style={{ fontSize: '0.75rem', color: textMut, marginBottom: '1.25rem' }}>
                  Harga disesuaikan dengan kebutuhan
                </p>
              )}

              {/* CTA Button */}
              <Link
                to={plan.href}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  backgroundColor: plan.highlighted ? primary : 'var(--color-bg-secondary)',
                  color: plan.highlighted ? '#fff' : text,
                  border: plan.highlighted ? 'none' : `1px solid ${border}`,
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  marginBottom: '1.5rem',
                  transition: 'all 0.15s ease',
                  boxShadow: plan.highlighted ? 'var(--shadow-glow)' : 'none',
                }}
              >
                {plan.cta}
              </Link>

              {/* Divider */}
              <div style={{
                height: '1px',
                backgroundColor: plan.highlighted ? 'var(--color-primary-border)' : border,
                marginBottom: '1.25rem',
              }} />

              {/* Features */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {plan.features.map((feature, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <Check size={16} style={{
                      color: plan.highlighted ? primary : '#22c55e',
                      flexShrink: 0,
                      marginTop: '0.1875rem',
                    }} />
                    <span style={{ fontSize: '0.875rem', color: textSec, lineHeight: 1.5 }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Notice Box */}
        <div style={{
          maxWidth: '700px',
          margin: '0 auto 3rem',
          padding: '1.25rem 1.5rem',
          borderRadius: '1rem',
          backgroundColor: '#fef3c7',
          border: '2px solid #fcd34d',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
        }}>
          <Clock size={20} style={{ color: '#d97706', flexShrink: 0, marginTop: '0.125rem' }} />
          <div style={{ fontSize: '0.875rem', color: '#92400e', lineHeight: 1.7 }}>
            <strong>Setelah 100 bisnis terdaftar:</strong> Paket Pro akan kembali ke harga normal
            Rp 150.000/bulan. Namun Anda tidak perlu khawatir — seluruh pendaftar awal <strong>tetap
            mendapatkan akses gratis selamanya</strong> sesuai paket yang dipilih saat mendaftar. Daftarkan bisnis Anda lebih awal untuk mendapatkan keuntungan ini.
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: '700px', margin: '0 auto 3rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: text,
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}>
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              {
                q: 'Apakah layanan ini benar-benar gratis tanpa syarat tersembunyi?',
                a: 'Ya, layanan ini gratis. Paket Gratis tersedia selamanya dengan biaya Rp 0. Paket Pro juga gratis bagi 100 pendaftar pertama. Kami mendukung komitmen Anda dalam membangun reputasi bisnis yang terpercaya.',
              },
              {
                q: 'Bagaimana jika kuota 100 pendaftar pertama sudah penuh?',
                a: 'Pendaftar ke-101 dan seterusnya akan dikenakan harga normal Paket Pro (Rp 150.000/bulan). Namun, pendaftar sebelum kuota habis akan tetap menikmati layanan secara gratis selamanya sesuai paket masing-masing.',
              },
              {
                q: 'Apakah ada biaya tambahan tersembunyi?',
                a: 'Tidak ada biaya tersembunyi. Harga yang tertera adalah total yang akan Anda bayar, sudah termasuk pajak (PPN 11%).',
              },
              {
                q: 'Apakah saya dapat melakukan peningkatan paket (upgrade) di kemudian hari?',
                a: 'Tentu saja. Anda dapat meningkatkan (upgrade) atau menurunkan (downgrade) paket langganan Anda kapan saja melalui dasbor pengguna.',
              },
              {
                q: 'Metode pembayaran apa saja yang didukung?',
                a: 'Kami menerima pembayaran melalui transfer bank dan dompet digital (GoPay, OVO, Dana). Pembayaran menggunakan kartu kredit dan auto-debit sedang dalam tahap persiapan.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '0.75rem',
                  backgroundColor: bgCard,
                  border: `1px solid ${border}`,
                }}
              >
                <h4 style={{
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: text,
                  marginBottom: '0.375rem',
                }}>
                  {faq.q}
                </h4>
                <p style={{ fontSize: '0.875rem', color: textSec, lineHeight: 1.7 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bottom */}
        <div id="waitlist" style={{
          textAlign: 'center',
          padding: '2.5rem 2rem',
          borderRadius: '1.25rem',
          background: `linear-gradient(135deg, var(--color-primary-light), var(--color-bg-elevated))`,
          border: `1px solid var(--color-primary-border)`,
        }}>
          <Gift size={28} style={{ color: primary, marginBottom: '0.75rem' }} />
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.375rem',
            fontWeight: 700,
            color: text,
            marginBottom: '0.5rem',
          }}>
            Daftar Segera — Selama Promo Berlangsung!
          </h2>
          <p style={{
            fontSize: '0.9375rem',
            color: textSec,
            marginBottom: '1.5rem',
            lineHeight: 1.6,
            maxWidth: '480px',
            margin: '0 auto 1.5rem',
          }}>
            Daftarkan bisnis Anda sekarang, pilih Paket Pro, dan nikmati seluruh fitur premium tanpa biaya. Harga akan kembali normal setelah kuota pendaftar terpenuhi.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
              }}
            >
              Daftar Gratis Sekarang <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 2rem',
                borderRadius: '0.75rem',
                backgroundColor: bgCard,
                color: text,
                border: `1px solid ${border}`,
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
              }}
            >
              Hubungi Tim Penjualan
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
