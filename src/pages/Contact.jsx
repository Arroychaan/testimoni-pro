import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { useTheme } from '../lib/ThemeContext';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Clock } from 'lucide-react';

export default function Contact() {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/Assets/Logo/logo-dark-page.svg' : '/Assets/Logo/logo-white-page.svg';

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const bg = 'var(--color-bg)';
  const bgCard = 'var(--color-bg-elevated)';
  const bgSecondary = 'var(--color-bg-secondary)';
  const text = 'var(--color-text)';
  const textSec = 'var(--color-text-secondary)';
  const textMut = 'var(--color-text-muted)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';
  const primaryLight = 'var(--color-primary-light)';

  const inputStyle = (isTextarea) => ({
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    fontSize: '0.9375rem',
    backgroundColor: bgSecondary,
    color: text,
    border: `1px solid ${border}`,
    outline: 'none',
    fontFamily: 'var(--font-body)',
    resize: isTextarea ? 'vertical' : 'none',
    transition: 'border-color 0.15s',
    minHeight: isTextarea ? '140px' : undefined,
  });

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      return;
    }

    setLoading(true);

    // Build mailto link as fallback
    const mailtoLink = `mailto:support@testimonipro.site?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(
      `Halo Tim TestimoniPro,\n\n${form.message}\n\n---\nDikirim oleh: ${form.name}\nEmail: ${form.email}`
    )}`;

    // Open email client
    setTimeout(() => {
      window.location.href = mailtoLink;
      setSent(true);
      setLoading(false);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 600);
  };

  const contactMethods = [
    {
      icon: <Mail size={22} />,
      title: 'Email',
      value: 'support@testimonipro.site',
      desc: 'Respon dalam 1×24 jam',
      color: '#2563eb',
      bg: '#dbeafe',
      href: 'mailto:support@testimonipro.site',
    },
    {
      icon: <Phone size={22} />,
      title: 'WhatsApp',
      value: '+62 812-XXXX-XXXX',
      desc: 'Sen–Sab, 08:00–20:00 WIB',
      color: '#16a34a',
      bg: '#dcfce7',
      href: 'https://wa.me/62812XXXXXXXX',
    },
    {
      icon: <MessageSquare size={22} />,
      title: 'Formulir',
      value: 'Isi form di bawah',
      desc: 'Langsung dari halaman ini',
      color: primary,
      bg: primaryLight,
      href: '#form',
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
            Hubungi Kami
          </h1>
          <p style={{
            fontSize: '1.0625rem',
            color: textSec,
            maxWidth: '540px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Memiliki pertanyaan, masukan, atau memerlukan bantuan? Kami siap membantu Anda.
            Silakan pilih metode komunikasi yang paling nyaman di bawah ini.
          </p>
        </div>

        {/* Contact Methods */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}>
          {contactMethods.map((method, i) => (
            <a
              key={i}
              href={method.href}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.875rem',
                padding: '1.25rem',
                borderRadius: '1rem',
                backgroundColor: bgCard,
                border: `1px solid ${border}`,
                textDecoration: 'none',
                color: text,
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '0.75rem',
                backgroundColor: method.bg,
                color: method.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {method.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: text,
                  marginBottom: '0.125rem',
                }}>
                  {method.title}
                </h3>
                <p style={{
                  fontSize: '0.8125rem',
                  color: method.color,
                  fontWeight: 600,
                  marginBottom: '0.125rem',
                  wordBreak: 'break-all',
                }}>
                  {method.value}
                </p>
                <p style={{ fontSize: '0.75rem', color: textMut }}>
                  {method.desc}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: border, marginBottom: '2.5rem' }} />

        {/* Form */}
        <div id="form" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.375rem',
            }}>
              Kirim Pesan Langsung
            </h2>
            <p style={{ fontSize: '0.875rem', color: textMut }}>
              Isi form di bawah dan kami akan merespon secepat mungkin. Semua field wajib diisi.
            </p>
          </div>

          {sent ? (
            <div style={{
              padding: '2.5rem 2rem',
              borderRadius: '1rem',
              backgroundColor: '#f0fdf4',
              border: '2px solid #bbf7d0',
              textAlign: 'center',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <CheckCircle size={32} />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#16a34a',
                marginBottom: '0.5rem',
              }}>
                Pesan Terkirim! 🎉
              </h3>
              <p style={{ fontSize: '0.9375rem', color: textSec, lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Klien email Anda akan terbuka secara otomatis. Apabila tidak terbuka, Anda dapat mengirimkan pesan
                secara langsung ke <strong>support@testimonipro.site</strong>. Kami akan merespons dalam waktu 1×24 jam.
              </p>
              <button
                onClick={() => setSent(false)}
                style={{
                  padding: '0.625rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  backgroundColor: primary,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Kirim Pesan Baru
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
                    Nama <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    style={inputStyle(false)}
                    placeholder="Nama lengkap Anda"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                    onFocus={(e) => e.currentTarget.style.borderColor = primary}
                    onBlur={(e) => e.currentTarget.style.borderColor = border}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    style={inputStyle(false)}
                    placeholder="email@anda.com"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                    onFocus={(e) => e.currentTarget.style.borderColor = primary}
                    onBlur={(e) => e.currentTarget.style.borderColor = border}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
                  Subjek <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  style={inputStyle(false)}
                  placeholder="Contoh: Pertanyaan tentang token"
                  value={form.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  required
                  onFocus={(e) => e.currentTarget.style.borderColor = primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = border}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
                  Pesan <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  style={inputStyle(true)}
                  placeholder="Tulis pesan Anda di sini... Jelaskan apa yang dapat kami bantu."
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  required
                  onFocus={(e) => e.currentTarget.style.borderColor = primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = border}
                />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: primaryLight,
                border: `1px solid var(--color-primary-border)`,
                fontSize: '0.75rem',
                color: textSec,
              }}>
                <Clock size={14} style={{ color: primary, flexShrink: 0 }} />
                <span>Saat ini pesan akan dikirimkan melalui klien email Anda (Gmail, Outlook, dll). Fitur integrasi email langsung sedang dalam tahap pengembangan.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 2rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  backgroundColor: primary,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-glow)',
                  transition: 'all 0.15s ease',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <Send size={18} />
                {loading ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          )}
        </div>

        {/* Bottom */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
          }}>
          </div>
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
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  );
}