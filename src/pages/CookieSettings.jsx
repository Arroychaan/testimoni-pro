import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { useTheme } from '../lib/ThemeContext';
import { useCookieConsent } from '../lib/CookieContext';
import { ShieldCheck, BarChart3, Megaphone, Cookie, ToggleLeft, ToggleRight, Info, ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';

export default function CookieSettings() {
  const { theme } = useTheme();
  const { preferences, savePreferences } = useCookieConsent();
  const [localPrefs, setLocalPrefs] = useState({ ...preferences });
  const [saved, setSaved] = useState(false);

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

  const cookieTypes = [
    {
      key: 'essential',
      icon: <ShieldCheck size={28} />,
      title: 'Cookies Esensial',
      subtitle: 'Diperlukan untuk memastikan situs web berfungsi dengan baik',
      description:
        'Cookie ini mutlak diperlukan agar situs web dapat beroperasi secara normal. Tanpa cookie ini, navigasi halaman tidak akan berjalan, preferensi tema (gelap/terang) tidak dapat disimpan, dan fungsionalitas dasar lainnya akan terganggu. Cookie ini tidak dapat dinonaktifkan, karena TestimoniPro tidak akan berfungsi tanpa kehadirannya.',
      details: [
        'Menyimpan preferensi tampilan tema (gelap/terang)',
        'Menjaga agar sesi dasbor bisnis Anda tetap aktif',
        'Memastikan keamanan token dan transaksi',
      ],
      alwaysOn: true,
      color: '#22c55e',
      bgColor: '#f0fdf4',
      borderColor: '#bbf7d0',
    },
    {
      key: 'analytics',
      icon: <BarChart3 size={28} />,
      title: 'Cookies Analitik',
      subtitle: 'Membantu kami meningkatkan kualitas layanan',
      description:
        'Cookie ini membantu kami menganalisis perilaku pengunjung di platform TestimoniPro, seperti mengidentifikasi halaman yang paling sering dikunjungi, fitur yang banyak digunakan, serta sumber lalu lintas pengunjung. Seluruh data bersifat anonim (tidak dapat mengidentifikasi Anda secara personal) dan semata-mata digunakan untuk meningkatkan pengalaman dan kualitas layanan.',
      details: [
        'Melihat halaman mana yang paling banyak dikunjungi',
        'Memahami berapa lama pengunjung menggunakan platform',
        'Mengidentifikasi bug atau error di halaman tertentu',
      ],
      alwaysOn: false,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
    },
    {
      key: 'marketing',
      icon: <Megaphone size={28} />,
      title: 'Cookies Marketing',
      subtitle: 'Menyajikan informasi yang relevan dan tepat sasaran',
      description:
        'Cookie ini memungkinkan kami untuk menyajikan informasi yang relevan dengan kebutuhan bisnis Anda. Sebagai contoh, jika Anda sering menggunakan fitur token, kami akan memberikan panduan untuk mengoptimalkan penggunaannya. Apabila Anda sering memantau laporan, kami akan merekomendasikan fitur analitik tingkat lanjut. Kami berkomitmen untuk tidak mengirimkan pesan promosi (spam) yang tidak bermanfaat.',
      details: [
        'Memberikan rekomendasi fitur berdasarkan pola penggunaan Anda',
        'Menyampaikan pemberitahuan terkait pembaruan yang relevan untuk bisnis Anda',
        'Menyediakan penawaran khusus yang disesuaikan dengan profil bisnis Anda',
      ],
      alwaysOn: false,
      color: '#8b5cf6',
      bgColor: '#faf5ff',
      borderColor: '#e9d5ff',
    },
  ];

  const togglePref = (key) => {
    if (key === 'essential') return; // Can't toggle
    setLocalPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    savePreferences(localPrefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bg,
      color: text,
      fontFamily: 'var(--font-body)',
    }}>
      <Navbar />

      <main style={{ maxWidth: '740px', margin: '0 auto', padding: '7rem 1.5rem 5rem' }}>
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

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '0.75rem',
              backgroundColor: primaryLight,
              color: primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Cookie size={22} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              color: text,
            }}>
              Pengaturan Cookies
            </h1>
          </div>
          <p style={{
            fontSize: '0.9375rem',
            color: textSec,
            lineHeight: 1.7,
          }}>
            Anda memiliki kebebasan penuh untuk menentukan kategori cookie mana yang diizinkan. Jika Anda ingin mengubah preferensi tersebut, Anda dapat kembali ke halaman ini kapan saja melalui tautan di bagian bawah situs. Kami menghormati dan akan menyimpan setiap preferensi yang Anda tentukan.
          </p>
        </div>

        {/* Info Box */}
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '0.75rem',
          backgroundColor: primaryLight,
          border: `1px solid var(--color-primary-border)`,
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.625rem',
        }}>
          <Info size={18} style={{ color: primary, flexShrink: 0, marginTop: '0.125rem' }} />
          <p style={{ fontSize: '0.8125rem', color: textSec, lineHeight: 1.6 }}>
            <strong style={{ color: text }}>Transparansi Penuh.</strong> Kami tidak menyimpan informasi pribadi yang sensitif di dalam cookie. Penggunaan cookie sepenuhnya ditujukan untuk meningkatkan kenyamanan pengalaman Anda — bukan untuk melacak privasi. Silakan pelajari lebih lanjut di{' '}
            <Link to="/privacy" style={{ color: primary, fontWeight: 600, textDecoration: 'underline' }}>
              Kebijakan Privasi
            </Link>.
          </p>
        </div>

        {/* Cookie Type Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
          {cookieTypes.map((type) => (
            <div
              key={type.key}
              style={{
                padding: '1.5rem',
                borderRadius: '1rem',
                backgroundColor: bgCard,
                border: `1px solid ${type.alwaysOn ? type.borderColor : border}`,
                opacity: type.alwaysOn ? 1 : (localPrefs[type.key] ? 1 : 0.75),
              }}
            >
              {/* Header Row */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '0.75rem',
                  backgroundColor: type.bgColor,
                  color: type.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {type.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: text,
                    }}>
                      {type.title}
                    </h3>
                    {type.alwaysOn && (
                      <span style={{
                        display: 'inline-block',
                        padding: '0.125rem 0.625rem',
                        borderRadius: '9999px',
                        backgroundColor: type.bgColor,
                        color: type.color,
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        border: `1px solid ${type.borderColor}`,
                      }}>
                        Selalu Aktif
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: textMut, marginBottom: '0.75rem' }}>
                    {type.subtitle}
                  </p>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => togglePref(type.key)}
                  disabled={type.alwaysOn}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: type.alwaysOn ? 'default' : 'pointer',
                    padding: 0,
                    flexShrink: 0,
                    opacity: type.alwaysOn ? 0.6 : 1,
                  }}
                >
                  {localPrefs[type.key] ? (
                    <ToggleRight size={36} style={{ color: type.alwaysOn ? '#22c55e' : primary }} />
                  ) : (
                    <ToggleLeft size={36} style={{ color: 'var(--color-border)' }} />
                  )}
                </button>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '0.875rem',
                color: textSec,
                lineHeight: 1.75,
                marginTop: '0.75rem',
              }}>
                {type.description}
              </p>

              {/* Detail List */}
              <ul style={{
                marginTop: '0.75rem',
                paddingLeft: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
              }}>
                {type.details.map((detail, i) => (
                  <li key={i} style={{
                    fontSize: '0.8125rem',
                    color: textMut,
                    lineHeight: 1.5,
                  }}>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Save Button + Feedback */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.5rem',
          borderRadius: '1rem',
          backgroundColor: bgCard,
          border: `1px solid ${border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {saved ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: '1px solid #bbf7d0',
              }}>
                <Check size={16} />
                Preferensi disimpan!
              </div>
            ) : (
              <p style={{ fontSize: '0.8125rem', color: textMut }}>
                Pastikan untuk menyimpan setelah menyesuaikan preferensi Anda.
              </p>
            )}
          </div>
          <button
            onClick={handleSave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 2rem',
              borderRadius: '0.75rem',
              border: 'none',
              backgroundColor: primary,
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-glow)',
              transition: 'all 0.15s ease',
            }}
          >
            Simpan Pilihan
          </button>
        </div>

        {/* Bottom Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
        }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              color: textMut,
              fontSize: '0.875rem',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={14} />
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  );
}