import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Send, CheckCircle2, ArrowLeft, ShieldCheck, Gift, Star, Key, Image as ImageIcon } from 'lucide-react';
import { getBusinessBySlug, submitTestimonial, validateToken, consumeToken, uploadFile, claimLoyaltyPoints } from '../lib/supabase';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import FileUpload from '../components/ui/FileUpload';

// ✅ FIX 2F: Star rating component
function StarRating({ rating, onChange, disabled }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: 'none',
            border: 'none',
            cursor: disabled ? 'default' : 'pointer',
            padding: 0,
            fontSize: '1.75rem',
            lineHeight: 1,
            color: star <= (hover || rating) ? '#f59e0b' : 'var(--color-border)',
            transition: 'color 0.1s ease',
          }}
          aria-label={`Bintang ${star}`}
        >
          ★
        </button>
      ))}
      {rating > 0 && (
        <span style={{
          fontSize: '0.875rem',
          fontWeight: 700,
          color: 'var(--color-text-secondary)',
          marginLeft: '0.5rem',
        }}>
          {rating}/5
        </span>
      )}
    </div>
  );
}

export default function SubmitExperience() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token');

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(null);
  const [loyaltyClaimed, setLoyaltyClaimed] = useState(false);
  const [claimEmail, setClaimEmail] = useState('');
  const [claimingPoints, setClaimingPoints] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');

  const [manualToken, setManualToken] = useState('');
  const [activeToken, setActiveToken] = useState(tokenParam || '');
  const [tokenInputMode, setTokenInputMode] = useState(false);

  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(0); // ✅ FIX 2F: user chooses rating
  const [photos, setPhotos] = useState([]); // Array of File objects

  const bg = 'var(--color-bg)';
  const bg2 = 'var(--color-bg-secondary)';
  const bgElevated = 'var(--color-bg-elevated)';
  const text = 'var(--color-text)';
  const textSec = 'var(--color-text-secondary)';
  const textMut = 'var(--color-text-muted)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';

  useEffect(() => {
    async function init() {
      setLoading(true);
      const { data: biz } = await getBusinessBySlug(slug);
      if (biz) setBusiness(biz);

      if (tokenParam) {
        await verifyToken(tokenParam);
      } else {
        setTokenValid(null);
      }
      setLoading(false);
    }
    init();
  }, [slug, tokenParam]);

  // ✅ FIX 2E: verifyToken hanya validasi, tidak menghanguskan token
  async function verifyToken(tok) {
    if (!tok) return;
    const { data, error: tokenErr } = await validateToken(tok);
    if (tokenErr || !data) {
      setTokenValid(false);
      setError(tokenErr || 'Token tidak valid atau telah digunakan.');
    } else {
      setTokenValid(true);
      setActiveToken(tok);
      setError('');
    }
  }

  async function handleManualTokenSubmit(e) {
    e.preventDefault();
    if (!manualToken.trim()) return;
    setError('');
    await verifyToken(manualToken.trim().toUpperCase());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!q1.trim() && !q2.trim() && !q3.trim()) {
      setError('Harap lengkapi setidaknya satu pertanyaan agar kami dapat menyusun ulasan Anda.');
      return;
    }
    if (!customerName.trim()) {
      setError('Mohon masukkan nama Anda.');
      return;
    }
    // ✅ FIX 2F: validasi rating (tidak lagi hardcoded 5)
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      setError('Mohon berikan rating (1-5 bintang) untuk pengalaman Anda.');
      return;
    }

    if (business.wa_auto_reply_enabled && !customerWhatsapp.trim()) {
      setError('Mohon masukkan nomor WhatsApp Anda.');
      return;
    }

    setSubmitting(true);
    setError('');

    // Upload photos (convert to Object URLs for localStorage mode)
    const photoUrls = [];
    for (const file of photos) {
      const { data: url } = await uploadFile('testimonials', `${Date.now()}-${file.name}`, file);
      if (url) photoUrls.push(url);
    }

    const combinedStory = [q1, q2, q3]
      .filter((q) => q.trim())
      .join('\n\n');

    // ✅ FIX 1B: hanya kirim field yang ada di schema
    const { error: submitError } = await submitTestimonial({
      business_id: business.id,
      customer_name: customerName.trim(),
      is_anonymous: false,
      rating: rating,                  // ✅ FIX 2F: gunakan rating dari user
      review_text: combinedStory,      // ✅ FIX 1B: gunakan review_text (bukan content)
      photo_urls: photoUrls.length > 0 ? photoUrls : null,
      video_url: null,
      verified_token: activeToken || null, // ✅ tetep dikirim untuk tracking
      customer_whatsapp: business.wa_auto_reply_enabled ? customerWhatsapp.trim() : null
    });

    if (submitError) {
      setError(submitError);
      setSubmitting(false);
      return;
    }

    if (business.wa_auto_reply_enabled && customerWhatsapp.trim()) {
      await triggerWhatsAppAutoReply(customerWhatsapp.trim(), customerName.trim(), rating);
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  async function triggerWhatsAppAutoReply(phone, name, ratingScore) {
    if (!business.wa_auto_reply_enabled || !business.wa_auto_reply_template) return;
    
    const msg = business.wa_auto_reply_template
      .replace(/{nama_pelanggan}/g, name)
      .replace(/{rating}/g, ratingScore);

    console.log(`[WhatsApp Auto-Reply Debug] Mengirim pesan ke ${phone}: "${msg}"`);

    const token = import.meta.env.VITE_FONNTE_TOKEN;
    if (token) {
      try {
        const response = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            target: phone,
            message: msg
          })
        });
        const data = await response.json();
        console.log('[WhatsApp Auto-Reply Fonnte Response]', data);
      } catch (err) {
        console.error('[WhatsApp Auto-Reply Error]', err);
      }
    }
  }

  async function claimLoyalty(e) {
    if (e) e.preventDefault();
    if (!claimEmail.trim()) {
      setClaimError('Harap masukkan email Anda.');
      return;
    }
    setClaimingPoints(true);
    setClaimError('');
    
    const { error: claimErr } = await claimLoyaltyPoints(
      business.id,
      customerName,
      claimEmail.trim(),
      activeToken
    );

    if (claimErr) {
      setClaimError(claimErr);
      setClaimingPoints(false);
      return;
    }

    setLoyaltyClaimed(true);
    setClaimingPoints(false);
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    borderRadius: '0.75rem', fontSize: '0.9375rem',
    backgroundColor: bg, color: text,
    border: `1px solid ${border}`, outline: 'none',
    transition: 'border-color 0.15s',
  };

  if (loading) return <LoadingSpinner text="Memverifikasi..." />;

  if (!business) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: text }}>
        <p>Bisnis tidak ditemukan.</p>
      </div>
    );
  }

  if (business.verification_status !== 'approved') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: 'var(--font-body)', color: text }}>
        <div style={{
          maxWidth: '480px', width: '100%',
          backgroundColor: bgElevated, border: `1px solid ${border}`,
          borderRadius: '1.5rem', padding: '2.5rem', textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{
            width: '72px', height: '72px',
            backgroundColor: business.verification_status === 'rejected' ? '#fef2f2' : '#fffbeb',
            color: business.verification_status === 'rejected' ? '#ef4444' : '#f59e0b',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2rem'
          }}>
            {business.verification_status === 'rejected' ? '❌' : '⏳'}
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: text, marginBottom: '0.75rem' }}>
            {business.verification_status === 'rejected' ? 'Pendaftaran Bisnis Ditolak' : 'Bisnis Sedang Ditinjau'}
          </h2>
          <p style={{ color: textSec, fontSize: '0.9375rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {business.verification_status === 'rejected'
              ? 'Maaf, formulir ulasan untuk bisnis ini dinonaktifkan karena pendaftaran ditolak oleh administrator.'
              : 'Formulir ulasan dinonaktifkan sementara karena profil bisnis ini sedang dalam proses verifikasi oleh administrator TestimoniPro.'}
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.75rem', borderRadius: '0.75rem',
              backgroundColor: primary, color: '#fff', fontWeight: 700, fontSize: '0.9375rem',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: 'var(--font-body)' }}>
        <div style={{
          maxWidth: '480px', width: '100%',
          backgroundColor: bgElevated, border: `1px solid ${border}`,
          borderRadius: '1.5rem', padding: '2.5rem', textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{
            width: '72px', height: '72px',
            backgroundColor: 'var(--color-primary-light)',
            color: primary,
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: text, marginBottom: '0.75rem' }}>
            Ulasan Berhasil Dikirimkan! 🎉
          </h2>
          <p style={{ color: textSec, fontSize: '0.9375rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Terima kasih telah berbagi pengalaman Anda dengan <strong style={{ color: text }}>{business.name}</strong>.
          </p>

          {!loyaltyClaimed ? (
            <form onSubmit={claimLoyalty} style={{
              padding: '1.25rem',
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: '1rem',
              border: `1px solid ${border}`,
              marginBottom: '1.5rem',
              textAlign: 'left',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Gift size={20} style={{ color: '#f59e0b' }} />
                <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.9375rem' }}>Klaim 50 Poin Loyalitas Anda!</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                Masukkan alamat email Anda untuk mengkreditkan poin transaksi ke akun loyalitas Anda di bisnis ini.
              </p>
              
              <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', marginBottom: '0.5rem' }}>
                <input
                  type="email"
                  required
                  placeholder="email@anda.com"
                  value={claimEmail}
                  onChange={(e) => setClaimEmail(e.target.value)}
                  style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                />
                <button
                  type="submit"
                  disabled={claimingPoints}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                    padding: '0.625rem 1.25rem', borderRadius: '0.625rem',
                    backgroundColor: '#f59e0b', color: '#fff', fontWeight: 700, fontSize: '0.8125rem',
                    border: 'none', cursor: 'pointer', width: '100%',
                    opacity: claimingPoints ? 0.7 : 1
                  }}
                >
                  <Star size={14} /> {claimingPoints ? 'Mengirim...' : 'Klaim 50 Poin Saya'}
                </button>
              </div>

              {claimError && (
                <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.375rem' }}>{claimError}</p>
              )}
            </form>
          ) : (
            <div style={{
              padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.75rem',
              border: '1px solid #bbf7d0', marginBottom: '1.5rem',
              fontSize: '0.875rem', color: '#166534', fontWeight: 600,
            }}>
              ✅ 50 Poin berhasil dikreditkan ke email {claimEmail}! Kumpulkan ulasan terverifikasi lainnya untuk menukarkan hadiah.
            </div>
          )}

          <Link
            to={`/brand/${slug}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.75rem', borderRadius: '0.75rem',
              backgroundColor: primary, color: '#fff', fontWeight: 700, fontSize: '0.9375rem',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            Lihat Profil Bisnis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, color: text, fontFamily: 'var(--font-body)', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 1.5rem 0' }}>
        <Link to={`/brand/${slug}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          fontSize: '0.875rem', color: textMut, textDecoration: 'none', marginBottom: '2rem',
        }}>
          <ArrowLeft size={16} /> Kembali
        </Link>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: text, marginBottom: '0.5rem' }}>
            Bagikan Pengalaman Anda
          </h1>
          <p style={{ color: textSec, fontSize: '0.9375rem' }}>
            Pengalaman Anda sangat berarti bagi{' '}
            <strong style={{ color: text }}>{business.name}</strong>.
          </p>
        </div>

        {/* === TOKEN SECTION === */}
        {!activeToken && (
          <div style={{
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Key size={20} style={{ color: primary }} />
              <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: text }}>Masukkan Token Verifikasi</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: textMut, marginBottom: '0.75rem' }}>
              Token diperoleh dari pemilik bisnis untuk memverifikasi keabsahan transaksi Anda.
            </p>

            {!tokenInputMode ? (
              <button
                onClick={() => setTokenInputMode(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.625rem 1.25rem', borderRadius: '0.625rem',
                  backgroundColor: primary, color: '#fff', fontWeight: 600, fontSize: '0.875rem',
                  border: 'none', cursor: 'pointer',
                }}
              >
                <Key size={16} /> Masukkan Token
              </button>
            ) : (
              <form onSubmit={handleManualTokenSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'monospace' }}
                  placeholder="TP-XXXXXXXX"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value.toUpperCase())}
                  onFocus={(e) => e.currentTarget.style.borderColor = primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = border}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
                    backgroundColor: primary, color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                    border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  Verifikasi
                </button>
              </form>
            )}
          </div>
        )}

        {/* Token Status */}
        {activeToken && tokenValid === true && (
          <div style={{
            padding: '0.75rem 1rem', borderRadius: '0.75rem',
            backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
            marginBottom: '1.25rem', fontSize: '0.875rem', color: '#166534',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} /> ✅ Transaksi terverifikasi — testimoni Anda akan ditandai sebagai ulasan autentik.
            </div>
            <button
              onClick={() => { setActiveToken(''); setTokenValid(null); setManualToken(''); }}
              style={{
                fontSize: '0.75rem', color: '#dc2626', fontWeight: 600,
                background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Hapus
            </button>
          </div>
        )}
        {activeToken && tokenValid === false && (
          <div style={{
            padding: '0.75rem 1rem', borderRadius: '0.75rem',
            backgroundColor: '#fef2f2', border: '1px solid #fecaca',
            marginBottom: '1.25rem', fontSize: '0.875rem', color: '#dc2626',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚠️ Token tidak valid atau sudah digunakan.
            </div>
            <button
              onClick={() => { setActiveToken(''); setTokenValid(null); setManualToken(''); setError(''); }}
              style={{
                fontSize: '0.75rem', color: '#dc2626', fontWeight: 600,
                background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Coba lagi
            </button>
          </div>
        )}
        {/* === FORM (Hanya dirender jika token valid) === */}
        {tokenValid === true && (
          <form onSubmit={handleSubmit}>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '1rem',
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.25rem',
          }}>
            {/* ✅ FIX 2F: Rating selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text, marginBottom: '0.5rem' }}>
                Rating <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <StarRating rating={rating} onChange={setRating} disabled={submitting} />
            </div>

            <hr style={{ border: 'none', borderTop: `1px solid ${border}`, margin: '0.25rem 0' }} />

            {[
              { label: 'Apa aspek yang paling memuaskan bagi Anda?', placeholder: 'Contoh: Pelayanannya sangat ramah...', value: q1, setter: setQ1 },
              { label: 'Apa perubahan yang Anda rasakan setelah menggunakan produk/layanan ini?', placeholder: 'Contoh: Kulit terasa lebih cerah...', value: q2, setter: setQ2 },
              { label: 'Berikan satu kata yang mendeskripsikan bisnis ini.', placeholder: 'Contoh: Sangat direkomendasikan!', value: q3, setter: setQ3 },
            ].map((field, i) => (
              <div key={i}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
                  {field.label}
                </label>
                <input
                  type="text"
                  style={inputStyle}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  onFocus={(e) => e.currentTarget.style.borderColor = primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = border}
                />
              </div>
            ))}
          </div>

          {/* Photo Upload */}
          <div style={{
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.25rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text, marginBottom: '0.75rem' }}>
              <ImageIcon size={16} style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: '-2px' }} />
              Unggah Bukti (Opsional)
            </label>
            <FileUpload
              accept="image/*"
              multiple={true}
              maxFiles={3}
              files={photos}
              onChange={setPhotos}
              label="Tambah Foto Bukti"
              icon={ImageIcon}
            />
          </div>

          {/* Nama */}
          <div style={{
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            padding: '1.5rem', borderRadius: '1rem', marginBottom: '1rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
              Nama Lengkap <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text" required style={inputStyle}
              placeholder="Nama lengkap atau nama panggilan Anda"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = primary}
              onBlur={(e) => e.currentTarget.style.borderColor = border}
            />
          </div>

          {/* WhatsApp */}
          {business.wa_auto_reply_enabled && (
            <div style={{
              backgroundColor: bgElevated, border: `1px solid ${border}`,
              padding: '1.5rem', borderRadius: '1rem', marginBottom: '1rem',
            }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
                Nomor WhatsApp Anda <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="tel" required style={inputStyle}
                placeholder="Contoh: 08xxxxxxxxxx"
                value={customerWhatsapp}
                onChange={(e) => setCustomerWhatsapp(e.target.value.replace(/[^0-9]/g, ''))}
                onFocus={(e) => e.currentTarget.style.borderColor = primary}
                onBlur={(e) => e.currentTarget.style.borderColor = border}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.375rem', display: 'block' }}>
                Digunakan untuk mengirimkan pesan terima kasih otomatis secara instan.
              </span>
            </div>
          )}

          {error && !error.includes('Token') && (
            <p style={{
              fontSize: '0.875rem', color: '#ef4444', backgroundColor: '#fef2f2',
              padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #fecaca',
              marginBottom: '0.75rem',
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%', padding: '0.875rem',
              borderRadius: '0.75rem',
              backgroundColor: primary,
              color: '#fff',
              fontWeight: 700, fontSize: '1rem',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              opacity: submitting ? 0.7 : 1,
              boxShadow: 'var(--shadow-glow)',
              transition: 'all 0.15s ease',
            }}
          >
            {submitting ? 'Mengirim...' : <><Send size={18} /> Kirim Ulasan</>}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}