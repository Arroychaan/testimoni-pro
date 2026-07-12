import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FloppyDisk, Storefront, Camera, MapPin, Globe, Phone, Tag } from '@phosphor-icons/react';
import { updateBusiness, uploadFile, getBusinessByUserId, supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import Button from '../components/ui/Button';

const CATEGORIES = [
  'Klinik Kecantikan', 'Coffee Shop', 'Restoran', 'Salon & Barbershop',
  'Laundry', 'Toko Online', 'Kontraktor', 'Wedding Organizer',
  'Gym & Fitness', 'Bengkel', 'Lainnya',
];

export default function EditProfile() {
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: '',
    owner_name: '',
    owner_whatsapp: '',
    location: '',
    website: '',
    description: '',
    custom_domain: '',
    wa_auto_reply_enabled: false,
    wa_auto_reply_template: '',
  });
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'pro'
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const bg = 'var(--color-bg)';
  const bg2 = 'var(--color-bg-secondary)';
  const bgElevated = 'var(--color-bg-elevated)';
  const text = 'var(--color-text)';
  const textSec = 'var(--color-text-secondary)';
  const textMut = 'var(--color-text-muted)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';
  const primaryLight = 'var(--color-primary-light)';

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    async function loadData() {
      if (!supabase) {
        // Simulation mode
        const cached = sessionStorage.getItem('tp_current_business');
        if (!cached) {
          navigate('/dashboard');
          return;
        }
        populateForm(JSON.parse(cached));
        return;
      }

      if (authLoading) return;
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: biz } = await getBusinessByUserId(user.id);
      if (biz) {
        populateForm(biz);
      } else {
        navigate('/dashboard');
      }
    }

    loadData();
  }, [navigate, user, authLoading]);

  const populateForm = (biz) => {
    setBusiness(biz);
    setForm({
      name: biz.name || '',
      category: biz.category || '',
      owner_name: biz.owner_name || '',
      owner_whatsapp: biz.owner_whatsapp || '',
      location: biz.location || '',
      website: biz.website || '',
      description: biz.description || '',
      custom_domain: biz.custom_domain || '',
      wa_auto_reply_enabled: biz.wa_auto_reply_enabled || false,
      wa_auto_reply_template: biz.wa_auto_reply_template || '',
    });
    if (biz.logo_url) setLogoPreview(biz.logo_url);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Nama bisnis wajib diisi.'); return; }

    setLoading(true);
    setError('');

    let logoUrl = business.logo_url;
    if (logoFile) {
      const { data: url } = await uploadFile('logos', `${business.id}-${Date.now()}-${logoFile.name}`, logoFile);
      if (url) logoUrl = url;
    }

    const slug = business.slug; // Keep original slug (name change doesn't change slug during edit)

    const updates = {
      name: form.name.trim(),
      category: form.category,
      owner_name: form.owner_name.trim(),
      owner_whatsapp: form.owner_whatsapp.trim(),
      location: form.location.trim(),
      website: form.website.trim(),
      description: form.description.trim(),
      logo_url: logoUrl,
      custom_domain: form.custom_domain.trim(),
      wa_auto_reply_enabled: form.wa_auto_reply_enabled,
      wa_auto_reply_template: form.wa_auto_reply_template.trim(),
    };

    const { data, error: upError } = await updateBusiness(business.id, updates);
    if (upError) {
      setError('Gagal menyimpan perubahan.');
      setLoading(false);
      return;
    }

    // Update session + localStorage
    sessionStorage.setItem('tp_current_business', JSON.stringify(data));
    setBusiness(data);
    setSaved(true);
    setLoading(false);

    setTimeout(() => setSaved(false), 3000);
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    borderRadius: '0.75rem', fontSize: '0.9375rem',
    backgroundColor: bg, color: text,
    border: `1px solid ${border}`, outline: 'none',
    transition: 'border-color 0.15s',
  };

  if (!business) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: text }}>
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, color: text, fontFamily: 'var(--font-body)', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '5rem 1.5rem 0' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <button
            onClick={() => navigate('/dashboard?biz=' + business.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              fontSize: '0.875rem', color: textMut, background: 'none', border: 'none',
              cursor: 'pointer', marginBottom: '1.5rem',
            }}
          >
            <ArrowLeft size={16} weight="bold" /> Kembali ke Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '0.75rem',
              backgroundColor: primaryLight, color: primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Storefront size={22} weight="duotone" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: text, lineHeight: 1.2 }}>
                Edit Profil Bisnis
              </h1>
              <p style={{ fontSize: '0.875rem', color: textSec }}>{business.name}</p>
            </div>
          </div>
        </div>

        {saved && (
          <div style={{
            padding: '0.75rem 1rem', borderRadius: '0.75rem',
            backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
            marginBottom: '1.25rem', fontSize: '0.875rem', color: '#166534',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            ✅ Profil berhasil diperbarui!
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: `1px solid ${border}` }}>
          <button
            onClick={() => setActiveTab('general')}
            style={{
              padding: '0.75rem 1rem', background: 'none', border: 'none',
              borderBottom: activeTab === 'general' ? `2px solid ${primary}` : '2px solid transparent',
              color: activeTab === 'general' ? primary : textMut, fontWeight: 600, cursor: 'pointer',
              fontSize: '0.9375rem',
            }}
          >
            Profil Umum
          </button>
          <button
            onClick={() => setActiveTab('pro')}
            style={{
              padding: '0.75rem 1rem', background: 'none', border: 'none',
              borderBottom: activeTab === 'pro' ? `2px solid ${primary}` : '2px solid transparent',
              color: activeTab === 'pro' ? primary : textMut, fontWeight: 600, cursor: 'pointer',
              fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.375rem',
            }}
          >
            Fitur Pro <span style={{ fontSize: '0.625rem', backgroundColor: '#fbbf24', color: '#fff', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>PRO</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {activeTab === 'general' && (
            <>

          {/* Logo Upload */}
          <div style={{
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            padding: '1.5rem', borderRadius: '1rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text, marginBottom: '0.75rem' }}>
              <Camera size={16} weight="duotone" style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: '-2px' }} />
              Foto Profil / Logo
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '80px', height: '80px',
                borderRadius: '0.75rem',
                border: `2px dashed ${border}`,
                backgroundColor: bg2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
              }}
                onClick={() => document.getElementById('logo-input').click()}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: textMut }}>{business.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <p style={{ fontSize: '0.8125rem', color: textMut, marginBottom: '0.5rem' }}>
                  Klik untuk mengunggah logo. Format JPG/PNG, maksimum 2MB.
                </p>
                <input
                  id="logo-input"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Nama Bisnis */}
          <div style={{
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            padding: '1.5rem', borderRadius: '1rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
              Nama Bisnis <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text" style={inputStyle}
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = primary}
              onBlur={(e) => e.currentTarget.style.borderColor = border}
            />
          </div>

          {/* Kategori */}
          <div style={{
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            padding: '1.5rem', borderRadius: '1rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
              <Tag size={16} weight="duotone" style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: '-2px' }} />
              Kategori Bisnis
            </label>
            <select
              style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = primary}
              onBlur={(e) => e.currentTarget.style.borderColor = border}
            >
              <option value="">Pilih kategori...</option>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Deskripsi */}
          <div style={{
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            padding: '1.5rem', borderRadius: '1rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
              Deskripsi Singkat
            </label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              placeholder="Jelaskan mengenai bisnis Anda..."
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = primary}
              onBlur={(e) => e.currentTarget.style.borderColor = border}
            />
          </div>

          {/* Lokasi */}
          <div style={{
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            padding: '1.5rem', borderRadius: '1rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
              <MapPin size={16} weight="duotone" style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: '-2px' }} />
              Lokasi
            </label>
            <input
              type="text" style={inputStyle}
              placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
              value={form.location}
              onChange={(e) => updateField('location', e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = primary}
              onBlur={(e) => e.currentTarget.style.borderColor = border}
            />
          </div>

          {/* Website */}
          <div style={{
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            padding: '1.5rem', borderRadius: '1rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
              <Globe size={16} weight="duotone" style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: '-2px' }} />
              Website / Link Sosial Media
            </label>
            <input
              type="url" style={inputStyle}
              placeholder="https://instagram.com/namabisnis"
              value={form.website}
              onChange={(e) => updateField('website', e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = primary}
              onBlur={(e) => e.currentTarget.style.borderColor = border}
            />
          </div>

          {/* WhatsApp */}
          <div style={{
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            padding: '1.5rem', borderRadius: '1rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
              <Phone size={16} weight="duotone" style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: '-2px' }} />
              Nomor WhatsApp
            </label>
            <input
              type="tel" style={inputStyle}
              placeholder="08xxxxxxxxxx"
              value={form.owner_whatsapp}
              onChange={(e) => updateField('owner_whatsapp', e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = primary}
              onBlur={(e) => e.currentTarget.style.borderColor = border}
            />
          </div>
          </>
          )}

          {activeTab === 'pro' && (
            <>
              {!business.is_pro && (
                <div style={{
                  padding: '1.5rem', borderRadius: '1rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a',
                  color: '#92400e', marginBottom: '1rem', textAlign: 'center'
                }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Fitur Terkunci</p>
                  <p style={{ fontSize: '0.875rem' }}>Tingkatkan akun Anda ke versi Pro untuk menggunakan domain kustom dan auto-reply WhatsApp.</p>
                </div>
              )}

              {/* Custom Domain */}
              <div style={{
                backgroundColor: bgElevated, border: `1px solid ${border}`,
                padding: '1.5rem', borderRadius: '1rem',
                opacity: business.is_pro ? 1 : 0.5, pointerEvents: business.is_pro ? 'auto' : 'none',
              }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text, marginBottom: '0.375rem' }}>
                  <Globe size={16} weight="duotone" style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: '-2px' }} />
                  Domain Kustom (Custom Domain)
                </label>
                <p style={{ fontSize: '0.8125rem', color: textMut, marginBottom: '1rem' }}>
                  Gunakan domain Anda sendiri untuk halaman profil bisnis (misal: ulasan.brandanda.com).
                </p>
                <input
                  type="text" style={inputStyle}
                  placeholder="ulasan.brandanda.com"
                  value={form.custom_domain}
                  onChange={(e) => updateField('custom_domain', e.target.value)}
                  onFocus={(e) => e.currentTarget.style.borderColor = primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = border}
                />
              </div>

              {/* WA Auto Reply */}
              <div style={{
                backgroundColor: bgElevated, border: `1px solid ${border}`,
                padding: '1.5rem', borderRadius: '1rem',
                opacity: business.is_pro ? 1 : 0.5, pointerEvents: business.is_pro ? 'auto' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: text }}>
                    <Phone size={16} weight="duotone" style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: '-2px' }} />
                    WhatsApp Auto-Reply
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.wa_auto_reply_enabled}
                      onChange={(e) => updateField('wa_auto_reply_enabled', e.target.checked)}
                      style={{ marginRight: '0.5rem', accentColor: primary, width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: textSec }}>Aktifkan</span>
                  </label>
                </div>
                <p style={{ fontSize: '0.8125rem', color: textMut, marginBottom: '1rem' }}>
                  Sistem akan mengirimkan pesan balasan otomatis (via WhatsApp) ketika pelanggan berhasil mengirimkan testimoni.
                </p>
                <textarea
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                  placeholder="Halo {nama_pelanggan}, terima kasih atas ulasannya! Kami akan terus meningkatkan layanan kami."
                  value={form.wa_auto_reply_template}
                  onChange={(e) => updateField('wa_auto_reply_template', e.target.value)}
                  disabled={!form.wa_auto_reply_enabled}
                  onFocus={(e) => e.currentTarget.style.borderColor = primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = border}
                />
                <p style={{ fontSize: '0.75rem', color: textMut, marginTop: '0.5rem' }}>
                  Gunakan variabel: <code>{'{nama_pelanggan}'}</code>, <code>{'{rating}'}</code>.
                </p>
              </div>
            </>
          )}

          {error && (
            <p style={{
              fontSize: '0.875rem', color: '#ef4444', backgroundColor: '#fef2f2',
              padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #fecaca',
            }}>
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            <FloppyDisk size={18} weight="bold" /> Simpan Perubahan
          </Button>
        </form>
      </div>
    </div>
  );
}