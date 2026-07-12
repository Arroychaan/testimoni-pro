import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import {
  getBusinessBySlug, getBusinessById, getBusinessByUserId, getTestimonials, getTokensByBusiness,
  createToken, getApiKeys, generateApiKey, updateBusiness, supabase
} from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { Copy, Check, Plus, ArrowSquareOut, Link as LinkIcon, Users, ChatCircleText, TrendUp, Gift } from '@phosphor-icons/react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bizId = searchParams.get('biz');

  const [business, setBusiness] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [justCreatedToken, setJustCreatedToken] = useState(null);

  const loadData = useCallback(async () => {
    if (!supabase) {
      // Simulation mode
      let biz = null;
      if (bizId) {
        const res = await getBusinessById(bizId);
        biz = res.data;
      } else {
        const cached = sessionStorage.getItem('tp_current_business');
        if (cached) biz = JSON.parse(cached);
      }
      
      if (biz) {
        setBusiness(biz);
        loadTestimonialsAndTokens(biz.id);
      } else {
        setLoading(false);
      }
      return;
    }

    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: biz, error } = await getBusinessByUserId(user.id);
    if (biz) {
      setBusiness(biz);
      sessionStorage.setItem('tp_current_business', JSON.stringify(biz));
      loadTestimonialsAndTokens(biz.id);
    } else {
      if (error) console.error(error);
      setLoading(false);
    }
  }, [bizId, user, authLoading]);

  const loadTestimonialsAndTokens = async (id) => {
    const [testiRes, tokenRes, keysRes] = await Promise.all([
      getTestimonials(id),
      getTokensByBusiness(id),
      getApiKeys(id),
    ]);
    setTestimonials(testiRes.data || []);
    setTokens(tokenRes.data || []);
    setApiKeys(keysRes.data || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [loadData]);

  const handleGenerateToken = async () => {
    if (!business) return;
    setGenerating(true);
    const { data } = await createToken(business.id, {
      productName: '',
      transactionRef: `TRX-${Date.now().toString(36).toUpperCase()}`,
    });
    if (data) {
      setTokens((prev) => [data, ...prev]);
      setJustCreatedToken(data);
    }
    setGenerating(false);
  };

  const copyTokenLink = (token) => {
    const link = `${window.location.origin}/experience/${business.slug}?token=${token}`;
    navigator.clipboard.writeText(link);
    return link;
  };

  const handleGenerateApiKey = async () => {
    if (!business) return;
    const { data, rawKey } = await generateApiKey(business.id);
    if (data) {
      setApiKeys((prev) => [data, ...prev]);
      alert(`API Key berhasil dibuat!\n\nSimpan kunci ini karena tidak akan ditampilkan lagi secara penuh:\n\n${rawKey}`);
    }
  };

  const handleTogglePro = async () => {
    const newVal = !business.is_pro;
    const { data } = await updateBusiness(business.id, { is_pro: newVal });
    if (data) {
      setBusiness(data);
    }
  };

  const stats = {
    total: testimonials.length,
    unusedTokens: tokens.filter((t) => !t.is_used).length,
    usedTokens: tokens.filter((t) => t.is_used).length,
    conversionRate: tokens.length > 0 ? Math.round((tokens.filter((t) => t.is_used).length / tokens.length) * 100) : 0,
  };

  const bg = 'var(--color-bg)';
  const bg2 = 'var(--color-bg-secondary)';
  const bgElevated = 'var(--color-bg-elevated)';
  const text = 'var(--color-text)';
  const textSec = 'var(--color-text-secondary)';
  const textMut = 'var(--color-text-muted)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: text }}>
        <p>Memuat Dashboard...</p>
      </div>
    );
  }

  if (!business) {
    // ✅ FIX 2G: session trap — tampilkan pesan yang jelas & link yang membantu
    return (
      <div style={{ minHeight: '100vh', backgroundColor: bg, color: text, fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '0.5rem',
          fontSize: '1.75rem',
        }}>
          📋
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: text }}>
          Tidak Ada Bisnis yang Terhubung
        </h2>
        <p style={{ color: textSec, maxWidth: '400px', lineHeight: 1.6, fontSize: '0.9375rem' }}>
          Anda belum memiliki sesi bisnis yang aktif.
          Silakan daftarkan bisnis Anda atau gunakan URL dashboard yang valid.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/daftar" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
            backgroundColor: primary, color: '#fff', fontWeight: 700, fontSize: '0.9375rem',
            textDecoration: 'none',
          }}>
            Daftarkan Bisnis Anda
          </Link>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
            backgroundColor: bgElevated, color: text, fontWeight: 600, fontSize: '0.9375rem',
            textDecoration: 'none', border: `1px solid ${border}`,
          }}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, color: text, fontFamily: 'var(--font-body)' }}>
      <Navbar />

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        {/* Header */}
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: text, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              👋 Selamat datang, {business.name}
              {business.is_pro && (
                <span style={{ fontSize: '0.75rem', backgroundColor: '#fbbf24', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', verticalAlign: 'middle' }}>PRO</span>
              )}
            </h1>
            <p style={{ color: textSec, fontSize: '0.9375rem' }}>Berikut performa reputasi bisnis Anda hari ini.</p>
          </div>
          <button
            onClick={handleTogglePro}
            style={{
              padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600,
              backgroundColor: business.is_pro ? bg2 : '#fbbf24',
              color: business.is_pro ? textSec : '#fff',
              border: `1px solid ${border}`, cursor: 'pointer',
            }}
          >
            [Dev] Simulasi Mode: {business.is_pro ? 'Matikan Pro' : 'Aktifkan Pro'}
          </button>
        </header>

        {/* Stat Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Testimoni Masuk', value: stats.total, icon: <ChatCircleText size={20} weight="duotone" />, trend: null },
            { label: 'Token Aktif', value: stats.unusedTokens, icon: <LinkIcon size={20} weight="duotone" />, trend: 'Siap dikirim' },
            { label: 'Token Terpakai', value: stats.usedTokens, icon: <Check size={20} weight="duotone" />, trend: null },
            { label: 'Konversi', value: `${stats.conversionRate}%`, icon: <TrendUp size={20} weight="duotone" />, trend: null },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '1.25rem', borderRadius: '1rem',
              backgroundColor: bgElevated, border: `1px solid ${border}`,
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: primary, marginBottom: '0.75rem' }}>
                {stat.icon}
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: textMut, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: text, lineHeight: 1 }}>
                {stat.value}
              </div>
              {stat.trend && <div style={{ fontSize: '0.75rem', color: textMut, marginTop: '0.25rem' }}>{stat.trend}</div>}
            </div>
          ))}
        </section>

        {/* Generate Token Section */}
        <section style={{
          padding: '1.5rem', borderRadius: '1rem',
          backgroundColor: bgElevated, border: `1px solid ${border}`,
          marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, color: text, marginBottom: '0.25rem' }}>
                🔗 Generate Token Unik
              </h3>
              <p style={{ fontSize: '0.875rem', color: textSec }}>
                Satu token mewakili satu transaksi dan satu ulasan. Kirimkan kepada pelanggan melalui WhatsApp, email, atau secara langsung.
              </p>
            </div>
            <button
              onClick={handleGenerateToken}
              disabled={generating}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
                backgroundColor: primary, color: '#fff', fontWeight: 700, fontSize: '0.9375rem',
                border: 'none', cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
                transition: 'all 0.15s ease',
                opacity: generating ? 0.7 : 1,
              }}
            >
              <Plus size={18} weight="bold" />
              {generating ? 'Membuat...' : 'Buat Token Baru'}
            </button>
          </div>

          {/* Just created token flash */}
          {justCreatedToken && (
            <div style={{
              marginTop: '1rem', padding: '1rem',
              backgroundColor: 'var(--color-primary-light)',
              borderRadius: '0.75rem', border: `1px solid var(--color-primary-border)`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
            }}>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: primary, marginBottom: '0.25rem' }}>Token Baru Dibuat! 🎉</div>
                <code style={{ fontSize: '1rem', fontWeight: 700, color: text }}>
                  {`${window.location.origin}/experience/${business.slug}?token=${justCreatedToken.token}`}
                </code>
              </div>
              <button
                onClick={() => { copyTokenLink(justCreatedToken.token); setJustCreatedToken(null); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 1rem', borderRadius: '0.5rem',
                  backgroundColor: primary, color: '#fff', fontWeight: 600, fontSize: '0.8125rem',
                  border: 'none', cursor: 'pointer',
                }}
              >
                <Copy size={14} /> Salin Link
              </button>
            </div>
          )}
        </section>

        {/* Token List */}
        {tokens.length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: text, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LinkIcon size={18} weight="duotone" style={{ color: primary }} />
              Daftar Token ({tokens.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tokens.slice(0, 10).map((t) => (
                <div key={t.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
                  padding: '0.875rem 1rem', borderRadius: '0.75rem',
                  backgroundColor: bgElevated, border: `1px solid ${border}`,
                }}>
                  <div>
                    <code style={{ fontSize: '0.875rem', fontWeight: 700, color: text }}>{t.token}</code>
                    <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: textMut }}>
                      {t.product_name || 'Tanpa produk'} · {new Date(t.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {t.is_used ? (
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#22c55e', backgroundColor: '#f0fdf4', padding: '0.25rem 0.625rem', borderRadius: '9999px', border: '1px solid #bbf7d0' }}>✓ Terpakai</span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: primary, backgroundColor: 'var(--color-primary-light)', padding: '0.25rem 0.625rem', borderRadius: '9999px', border: '1px solid var(--color-primary-border)' }}>Aktif</span>
                    )}
                    {!t.is_used && (
                      <button
                        onClick={() => copyTokenLink(t.token)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                          padding: '0.375rem 0.75rem', borderRadius: '0.5rem',
                          backgroundColor: bg2, color: textSec, fontWeight: 600, fontSize: '0.75rem',
                          border: `1px solid ${border}`, cursor: 'pointer',
                        }}
                      >
                        <Copy size={12} /> Salin
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Developer API (Pro Feature) */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, color: text, marginBottom: '1rem' }}>
            Developer API
            <span style={{ fontSize: '0.625rem', backgroundColor: '#fbbf24', color: '#fff', padding: '0.125rem 0.375rem', borderRadius: '4px', marginLeft: '0.5rem', verticalAlign: 'middle' }}>PRO</span>
          </h3>
          
          <div style={{
            padding: '1.5rem', borderRadius: '1rem',
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            opacity: business.is_pro ? 1 : 0.5, pointerEvents: business.is_pro ? 'auto' : 'none',
          }}>
            {!business.is_pro && (
              <div style={{ color: '#92400e', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
                Tingkatkan ke Pro untuk mendapatkan akses API penuh.
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: text, marginBottom: '0.25rem' }}>API Keys</h4>
                <p style={{ fontSize: '0.875rem', color: textSec }}>Gunakan API Key ini untuk mengintegrasikan TestimoniPro dengan website atau aplikasi Anda sendiri.</p>
              </div>
              <button
                onClick={handleGenerateApiKey}
                style={{
                  padding: '0.625rem 1.25rem', borderRadius: '0.5rem',
                  backgroundColor: bg2, color: text, fontWeight: 600, fontSize: '0.875rem',
                  border: `1px solid ${border}`, cursor: 'pointer',
                }}
              >
                Buat API Key Baru
              </button>
            </div>

            {apiKeys.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {apiKeys.map((key) => (
                  <div key={key.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 1rem', borderRadius: '0.5rem', backgroundColor: bg, border: `1px solid ${border}`
                  }}>
                    <div>
                      <code style={{ fontSize: '0.875rem', color: text }}>{key.api_key_hash.substring(0, 8)}...****************</code>
                      <div style={{ fontSize: '0.75rem', color: textMut }}>Dibuat pada: {new Date(key.created_at).toLocaleDateString('id-ID')}</div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#22c55e' }}>Aktif</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: textMut, fontStyle: 'italic' }}>Belum ada API Key yang dibuat.</p>
            )}
          </div>
        </section>

        {/* Quick Links */}
        <section style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem',
          marginBottom: '2rem',
        }}>
          <Link to={`/brand/${business.slug}`} style={{
            padding: '1.25rem', borderRadius: '1rem',
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            textDecoration: 'none', color: text,
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            transition: 'border-color 0.15s',
          }}>
            <ArrowSquareOut size={20} weight="duotone" style={{ color: primary }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Lihat Profil Publik</div>
              <div style={{ fontSize: '0.75rem', color: textMut }}>testimonipro.site/brand/{business.slug}</div>
            </div>
          </Link>
          <Link to="/settings" style={{
            padding: '1.25rem', borderRadius: '1rem',
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            textDecoration: 'none', color: text,
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: primary }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Edit Profil Bisnis</div>
              <div style={{ fontSize: '0.75rem', color: textMut }}>Perbarui foto, lokasi, & informasi</div>
            </div>
          </Link>
          <Link to={`/experience/${business.slug}`} style={{
            padding: '1.25rem', borderRadius: '1rem',
            backgroundColor: bgElevated, border: `1px solid ${border}`,
            textDecoration: 'none', color: text,
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <Gift size={20} weight="duotone" style={{ color: primary }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Halaman Submit Testimoni</div>
              <div style={{ fontSize: '0.75rem', color: textMut }}>Untuk disematkan atau dibagikan secara langsung</div>
            </div>
          </Link>
        </section>

        {/* Recent Testimonials */}
        <section>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: text, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ChatCircleText size={18} weight="duotone" style={{ color: primary }} />
            Testimoni Terbaru ({testimonials.length})
          </h3>

          {testimonials.length === 0 ? (
            <div style={{
              padding: '2rem', textAlign: 'center',
              borderRadius: '1rem', border: `1px dashed ${border}`,
              backgroundColor: bg2,
            }}>
              <p style={{ color: textMut, marginBottom: '0.5rem' }}>Belum ada testimoni masuk.</p>
              <p style={{ fontSize: '0.8125rem', color: textMut }}>Hasilkan token dan kirimkan kepada pelanggan Anda untuk mulai mengumpulkan ulasan.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {testimonials.slice(0, 10).map((t) => (
                <div key={t.id} style={{
                  padding: '1rem', borderRadius: '0.75rem',
                  backgroundColor: bgElevated, border: `1px solid ${border}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: text }}>{t.customer_name}</span>
                    <span style={{ fontSize: '0.75rem', color: textMut }}>{new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: textSec, lineHeight: 1.6 }}>"{t.content || t.review_text}"</p>

                  {t.photo_urls && t.photo_urls.length > 0 && (
                    <div style={{
                      display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap',
                    }}>
                      {t.photo_urls.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`Foto ${i + 1}`}
                          style={{
                            width: '80px', height: '80px',
                            objectFit: 'cover', borderRadius: '0.5rem',
                            border: `1px solid ${border}`, cursor: 'pointer',
                          }}
                          onClick={() => window.open(url, '_blank')}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}