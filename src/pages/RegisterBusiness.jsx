import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Storefront, ArrowLeft, RocketLaunch, MapPin, Globe, Phone, NotePencil } from '@phosphor-icons/react';
import { registerBusiness, generateSlug, supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import Button from '../components/ui/Button';
import { useTheme } from '../lib/ThemeContext';

const CATEGORIES = [
  'Klinik Kecantikan', 'Coffee Shop', 'Restoran', 'Salon & Barbershop',
  'Laundry', 'Toko Online', 'Kontraktor', 'Wedding Organizer',
  'Gym & Fitness', 'Bengkel', 'Lainnya',
];

export default function RegisterBusiness() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  
  const [form, setForm] = useState({
    name: '', category: '', owner_name: '', owner_whatsapp: '',
    location: '', website: '', description: '',
  });
  const [customCategory, setCustomCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOptional, setShowOptional] = useState(false); // toggle untuk field opsional

  const bg = 'var(--color-bg)';
  const bg2 = 'var(--color-bg-secondary)';
  const text = 'var(--color-text)';
  const textSec = 'var(--color-text-secondary)';
  const textMut = 'var(--color-text-muted)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';
  const primaryLight = 'var(--color-primary-light)';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.name.trim()) {
      setError('Nama bisnis wajib diisi.');
      return;
    }
    
    const finalCategory = form.category === 'Lainnya' ? customCategory.trim() : form.category;
    if (form.category === 'Lainnya' && !finalCategory) {
      setError('Kategori kustom wajib diisi jika Anda memilih "Lainnya".');
      return;
    }

    setLoading(true);

    if (supabase) {
      if (!user) {
        setError('Sesi telah berakhir. Silakan login kembali.');
        setLoading(false);
        navigate('/login');
        return;
      }

      // Register business using the active user's ID
      const slug = generateSlug(form.name);
      const { data, error: regError } = await registerBusiness({
        name: form.name.trim(),
        category: finalCategory,
        slug,
        owner_name: form.owner_name.trim(),
        owner_whatsapp: form.owner_whatsapp.trim(),
        location: form.location.trim(),
        website: form.website.trim(),
        description: form.description.trim(),
        user_id: user.id,
      });

      if (regError) {
        setError(typeof regError === 'string' ? regError : 'Gagal menyimpan profil. Coba variasi nama lain.');
        setLoading(false);
        return;
      }

      navigate('/dashboard');
    } else {
      // Simulation mode
      const slug = generateSlug(form.name);
      const { data, error: regError } = await registerBusiness({
        ...form,
        name: form.name.trim(),
        category: finalCategory,
        slug,
        owner_name: form.owner_name.trim(),
        owner_whatsapp: form.owner_whatsapp.trim(),
        location: form.location.trim(),
        website: form.website.trim(),
        description: form.description.trim(),
      });

      if (regError) {
        setError('Gagal mendaftar. Coba variasi nama lain.');
        setLoading(false);
        return;
      }
      sessionStorage.setItem('tp_current_business', JSON.stringify(data));
      navigate(`/dashboard?biz=${data.id}`);
    }
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const inputStyle = {
    width: '100%', padding: '0.625rem 0.875rem',
    borderRadius: '0.5rem', fontSize: '0.875rem',
    backgroundColor: bg, color: text,
    border: `1px solid ${border}`, outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '70px',
    resize: 'vertical',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: text, marginBottom: '0.375rem'
  };

  const focusStyle = (e) => {
    e.currentTarget.style.borderColor = primary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryLight}`;
  };

  const blurStyle = (e) => {
    e.currentTarget.style.borderColor = border;
    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', backgroundColor: 'var(--color-bg-secondary)', padding: '0.5rem 1rem', overflowY: 'auto' }}>
      
      <div style={{ position: 'absolute', top: '1rem', left: '1.5rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: textMut, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = primary} onMouseLeave={(e) => e.currentTarget.style.color = textMut}>
          <ArrowLeft size={16} weight="bold" /> Kembali
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <img src={theme === 'dark' ? '/Assets/Logo/logo-dark-page.svg' : '/Assets/Logo/logo-white-page.svg'} alt="TestimoniPro Logo" style={{ width: '220px', height: 'auto', objectFit: 'contain' }} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: text, textAlign: 'center', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
          Daftar Akun Bisnis
        </h1>
        <p style={{ fontSize: '0.875rem', color: textSec, textAlign: 'center', margin: 0 }}>
          Lengkapi data di bawah ini untuk memulai.
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: bg, padding: '1.5rem 2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: `1px solid ${border}` }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          
          <h3 style={{ fontSize: '1rem', fontWeight: 700, paddingBottom: '0.5rem', borderBottom: `1px solid ${border}` }}>Detail Bisnis</h3>
          
          {/* Nama Bisnis */}
          <div>
            <label style={labelStyle}>
              Nama Bisnis <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Misal: Kopi Sederhana"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
              maxLength={100}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            {form.name.trim() && (
              <div style={{ fontSize: '0.75rem', color: textMut, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Slug: <span style={{ color: primary, fontWeight: 600 }}>testimonipro.site/brand/{generateSlug(form.name)}</span>
              </div>
            )}
          </div>

          {/* Kategori */}
          <div>
            <label style={labelStyle}>Kategori Industri</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              onFocus={focusStyle}
              onBlur={blurStyle}
            >
              <option value="" disabled>Pilih industri yang sesuai...</option>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            {form.category === 'Lainnya' && (
              <div style={{ marginTop: '0.75rem', animation: 'fadeIn 0.2s ease-in' }}>
                <label style={{ ...labelStyle, fontSize: '0.8125rem', color: textSec }}>
                  Tuliskan Kategori Spesifik <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  style={inputStyle}
                  placeholder="Masukkan kategori industri Anda..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
            )}
          </div>

          {/* Nama Pemilik */}
          <div>
            <label style={labelStyle}>Nama Lengkap Pengelola</label>
            <input
              type="text" style={inputStyle}
              placeholder="Nama Anda"
              value={form.owner_name}
              onChange={(e) => updateField('owner_name', e.target.value)}
              maxLength={100}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label style={labelStyle}>
              <Phone size={14} weight="duotone" style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: '-2px' }} />
              Nomor WhatsApp Bisnis
            </label>
            <input
              type="tel" style={inputStyle}
              placeholder="Contoh: 08123456789"
              value={form.owner_whatsapp}
              onChange={(e) => updateField('owner_whatsapp', e.target.value.replace(/[^0-9+]/g, ''))}
              maxLength={18}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          {/* ✅ K6: Toggle untuk field opsional */}
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            style={{
              background: 'none',
              border: `1px dashed ${border}`,
              borderRadius: '0.5rem',
              padding: '0.625rem 1rem',
              fontSize: '0.8125rem',
              color: textMut,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              width: '100%',
            }}
          >
            <NotePencil size={14} />
            {showOptional ? 'Sembunyikan' : 'Informasi Tambahan (Opsional)'}
          </button>

          {showOptional && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', animation: 'fadeIn 0.2s ease-in' }}>
              {/* ✅ K6: Lokasi */}
              <div>
                <label style={labelStyle}>
                  <MapPin size={14} weight="duotone" style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: '-2px' }} />
                  Lokasi Bisnis
                </label>
                <input
                  type="text" style={inputStyle}
                  placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  maxLength={200}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>

              {/* ✅ K6: Website */}
              <div>
                <label style={labelStyle}>
                  <Globe size={14} weight="duotone" style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: '-2px' }} />
                  Website / Link Sosial Media
                </label>
                <input
                  type="url" style={inputStyle}
                  placeholder="https://instagram.com/namabisnis"
                  value={form.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  maxLength={300}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>

              {/* ✅ K6: Deskripsi */}
              <div>
                <label style={labelStyle}>
                  Deskripsi Singkat
                </label>
                <textarea
                  style={textareaStyle}
                  placeholder="Ceritakan tentang bisnis Anda dalam beberapa kalimat..."
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  maxLength={500}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '0.875rem', borderRadius: '0.5rem', color: '#dc2626', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>Error:</span> {error}
            </div>
          )}

          <div style={{ marginTop: '0.25rem' }}>
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              <RocketLaunch size={20} weight="bold" /> Daftar Sekarang
            </Button>
          </div>
          
          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: textMut, marginTop: '0.25rem' }}>
            Dengan mendaftar, Anda menyetujui{' '}
            <Link to="/terms" style={{ color: primary, textDecoration: 'none', fontWeight: 600 }}>
              Ketentuan Layanan
            </Link> kami.
          </p>
        </form>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}