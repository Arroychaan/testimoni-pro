import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import {
  getBusinessBySlug, getBusinessById, getBusinessByUserId, getTestimonials, getTokensByBusiness,
  createToken, getApiKeys, generateApiKey, supabase, getCustomerLoyaltyList, deleteTestimonial
} from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import {
  Copy, Check, Plus, ArrowSquareOut, Link as LinkIcon,
  ChatCircleText, TrendUp, Star, PencilSimple,
  ShareNetwork, ChartBar, Key, CaretLeft, CaretRight,
  Clipboard, CheckCircle, Gift, Trash
} from '@phosphor-icons/react';
import '../styles/dashboard.css';

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
  const [copiedToken, setCopiedToken] = useState(null);
  const [tokenPage, setTokenPage] = useState(1);
  const [testiPage, setTestiPage] = useState(1);
  const [newlyCreatedApiKey, setNewlyCreatedApiKey] = useState(null);
  const [copiedApiKey, setCopiedApiKey] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenForm, setTokenForm] = useState({ productName: '', transactionRef: '' });
  const [loyaltyList, setLoyaltyList] = useState([]);

  const TOKENS_PER_PAGE = 5;
  const TESTI_PER_PAGE = 5;

  const loadData = useCallback(async () => {
    if (!supabase) {
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
    const [testiRes, tokenRes, keysRes, loyaltyRes] = await Promise.all([
      getTestimonials(id),
      getTokensByBusiness(id),
      getApiKeys(id),
      getCustomerLoyaltyList(id),
    ]);
    setTestimonials(testiRes.data || []);
    setTokens(tokenRes.data || []);
    setApiKeys(keysRes.data || []);
    setLoyaltyList(loyaltyRes.data || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [loadData]);

  const openTokenModal = () => {
    if (business?.verification_status !== 'approved') return;
    setTokenForm({
      productName: '',
      transactionRef: `TRX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    });
    setIsTokenModalOpen(true);
  };

  const handleGenerateToken = async (e) => {
    if (e) e.preventDefault();
    if (!business || business.verification_status !== 'approved') return;
    setGenerating(true);
    const { data } = await createToken(business.id, {
      productName: tokenForm.productName.trim(),
      transactionRef: tokenForm.transactionRef.trim() || `TRX-${Date.now().toString(36).toUpperCase()}`,
    });
    if (data) {
      setTokens((prev) => [data, ...prev]);
      setJustCreatedToken(data);
      setTokenPage(1);
      setIsTokenModalOpen(false);
    }
    setGenerating(false);
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus ulasan ini secara permanen?')) return;
    const { error } = await deleteTestimonial(id);
    if (error) {
      alert(`Gagal menghapus ulasan: ${error.message}`);
      return;
    }
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const copyTokenLink = (token) => {
    const link = `${window.location.origin}/experience/${business.slug}?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
    return link;
  };

  const handleGenerateApiKey = async () => {
    if (!business) return;
    const { data, rawKey, error } = await generateApiKey(business.id);
    if (error) {
      alert(`Gagal membuat API Key: ${error}`);
      return;
    }
    if (data) {
      setApiKeys((prev) => [data, ...prev]);
      setNewlyCreatedApiKey(rawKey);
      setCopiedApiKey(false);
    }
  };

  const copyApiKey = () => {
    if (!newlyCreatedApiKey) return;
    navigator.clipboard.writeText(newlyCreatedApiKey);
    setCopiedApiKey(true);
    setTimeout(() => setCopiedApiKey(false), 2000);
  };

  const stats = {
    total: testimonials.length,
    unusedTokens: tokens.filter((t) => !t.is_used).length,
    usedTokens: tokens.filter((t) => t.is_used).length,
    conversionRate: tokens.length > 0 ? Math.round((tokens.filter((t) => t.is_used).length / tokens.length) * 100) : 0,
  };

  const getInitials = (name) => {
    if (!name) return 'B';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  };

  const timeAgo = (dateStr) => {
    const now = new Date();
    const d = new Date(dateStr);
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} jam lalu`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay} hari lalu`;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderStars = (rating) => {
    const r = rating || 5;
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} weight={i < r ? 'fill' : 'regular'} style={{ color: i < r ? '#f59e0b' : 'var(--color-border)' }} />
    ));
  };

  const getDaysUntilExpiry = (expiryDateStr) => {
    if (!expiryDateStr) return null;
    const diffMs = new Date(expiryDateStr) - new Date();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  // Pagination logic
  const paginatedTokens = tokens.slice((tokenPage - 1) * TOKENS_PER_PAGE, tokenPage * TOKENS_PER_PAGE);
  const totalTokenPages = Math.ceil(tokens.length / TOKENS_PER_PAGE);
  const paginatedTesti = testimonials.slice((testiPage - 1) * TESTI_PER_PAGE, testiPage * TESTI_PER_PAGE);
  const totalTestiPages = Math.ceil(testimonials.length / TESTI_PER_PAGE);

  // --- LOADING STATE: Skeleton Shimmer ---
  if (loading) {
    return (
      <div className="dash-layout">
        <Navbar />
        <main className="dash-main">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '0.875rem' }} />
            <div>
              <div className="skeleton skeleton-text" style={{ width: 200 }} />
              <div className="skeleton skeleton-text-short" style={{ width: 140 }} />
            </div>
          </div>
          <div className="dash-stats-grid">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton skeleton-card" />)}
          </div>
          <div className="dash-content-grid">
            <div className="skeleton" style={{ height: 300, borderRadius: '1rem' }} />
            <div className="skeleton" style={{ height: 300, borderRadius: '1rem' }} />
          </div>
        </main>
      </div>
    );
  }

  // --- NO BUSINESS STATE ---
  if (!business) {
    return (
      <div className="dash-layout" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
        <div className="dash-empty-icon" style={{ width: 64, height: 64, marginBottom: '0.5rem' }}>
          <ChartBar size={28} weight="duotone" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
          Tidak Ada Bisnis yang Terhubung
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: 400, lineHeight: 1.6, fontSize: '0.9375rem' }}>
          Anda belum memiliki profil bisnis yang aktif. Silakan daftarkan bisnis Anda terlebih dahulu.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/daftar" className="dash-action-btn primary">Daftarkan Bisnis Anda</Link>
          <Link to="/" className="dash-action-btn">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD ---
  return (
    <div className="dash-layout">
      <Navbar />

      <main className="dash-main">
        {/* ====== HEADER ====== */}
        <header className="dash-header">
          <div className="dash-header-left">
            <div className="dash-avatar">{getInitials(business.name)}</div>
            <div className="dash-header-info">
              <h1>{business.name}</h1>
              <p>Berikut performa reputasi bisnis Anda.</p>
            </div>
          </div>
          <div className="dash-header-actions">
            <Link to="/settings" className="dash-action-btn">
              <PencilSimple size={16} weight="bold" /> Edit Profil
            </Link>
            <button
              onClick={openTokenModal}
              disabled={business.verification_status !== 'approved'}
              className="dash-action-btn primary"
              style={{
                opacity: (business.verification_status !== 'approved') ? 0.6 : 1,
                cursor: (business.verification_status !== 'approved') ? 'not-allowed' : 'pointer'
              }}
            >
              <Plus size={16} weight="bold" /> Buat Token
            </button>
          </div>
        </header>

        {/* ====== PROMO EXPIRY BANNER ====== */}
        {business.subscription_tier === 'pro' && business.pro_expires_at && getDaysUntilExpiry(business.pro_expires_at) !== null && getDaysUntilExpiry(business.pro_expires_at) <= 7 && (
          <div className="flash-banner" style={{
            borderLeft: '4px solid #ef4444',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            animation: 'scaleIn 0.2s ease-out'
          }}>
            <div style={{ fontSize: '1.25rem' }}>⚠️</div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.125rem' }}>
                Peringatan: Masa Aktif Pro Segera Berakhir
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#b91c1c', lineHeight: 1.4, margin: 0 }}>
                {getDaysUntilExpiry(business.pro_expires_at) > 0 
                  ? `Paket Pro gratis Anda akan berakhir dalam ${getDaysUntilExpiry(business.pro_expires_at)} hari. Segera perbarui langganan Anda.`
                  : 'Paket Pro gratis Anda telah berakhir. Harap perbarui langganan untuk mempertahankan fitur premium.'}
              </p>
            </div>
          </div>
        )}

        {/* ====== WARNING BANNER (Verifikasi Pending/Rejected) ====== */}
        {business.verification_status !== 'approved' && (
          <div className="flash-banner" style={{
            borderLeft: business.verification_status === 'rejected' ? '4px solid #ef4444' : '4px solid #f59e0b',
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            animation: 'scaleIn 0.2s ease-out'
          }}>
            <div style={{ fontSize: '1.25rem' }}>
              {business.verification_status === 'rejected' ? '❌' : '⏳'}
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: business.verification_status === 'rejected' ? '#dc2626' : '#d97706', marginBottom: '0.125rem' }}>
                {business.verification_status === 'rejected' ? 'Akun Bisnis Ditolak' : 'Akun Bisnis Sedang Ditinjau'}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: 0 }}>
                {business.verification_status === 'rejected'
                  ? 'Verifikasi identitas bisnis Anda ditolak oleh administrator. Silakan hubungi dukungan pelanggan kami untuk informasi lebih lanjut.'
                  : 'Profil bisnis Anda saat ini sedang dalam proses antrean verifikasi oleh administrator TestimoniPro. Pembuatan token dinonaktifkan sementara.'}
              </p>
            </div>
          </div>
        )}

        {/* ====== FLASH BANNER (Token Baru) ====== */}
        {justCreatedToken && (
          <div className="flash-banner">
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <CheckCircle size={16} weight="fill" /> Token Baru Berhasil Dibuat
              </div>
              <code>{`${window.location.origin}/experience/${business.slug}?token=${justCreatedToken.token}`}</code>
            </div>
            <button
              onClick={() => { copyTokenLink(justCreatedToken.token); setJustCreatedToken(null); }}
              className="dash-action-btn primary"
              style={{ fontSize: '0.75rem', padding: '0.375rem 0.875rem' }}
            >
              <Copy size={14} /> Salin Link
            </button>
          </div>
        )}

        {/* ====== FLASH BANNER (API Key Baru) ====== */}
        {newlyCreatedApiKey && (
          <div className="flash-banner" style={{ borderLeft: '4px solid #fbbf24', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '0.75rem', marginBottom: '1.5rem', animation: 'scaleIn 0.2s ease-out' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <CheckCircle size={18} weight="fill" style={{ color: '#fbbf24' }} /> API Key Baru Berhasil Dibuat
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                Simpan API Key ini sekarang. Demi keamanan Anda, kunci ini tidak akan ditampilkan lagi setelah banner ini ditutup.
              </p>
              <code style={{ fontSize: '0.875rem', fontWeight: 700, wordBreak: 'break-all', backgroundColor: 'var(--color-bg-secondary)', padding: '0.375rem 0.625rem', borderRadius: '6px', border: '1px solid var(--color-border)', display: 'block', fontFamily: 'monospace' }}>
                {newlyCreatedApiKey}
              </code>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
              <button
                onClick={copyApiKey}
                className="dash-action-btn primary"
                style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
              >
                {copiedApiKey ? <><Check size={14} /> Tersalin</> : <><Copy size={14} /> Salin Key</>}
              </button>
              <button
                onClick={() => setNewlyCreatedApiKey(null)}
                className="dash-action-btn"
                style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', borderRadius: '0.5rem', cursor: 'pointer' }}
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* ====== STAT CARDS ====== */}
        <section className="dash-stats-grid">
          {[
            { label: 'Total Testimoni', value: stats.total, icon: <ChatCircleText size={20} weight="duotone" />, cls: 'stat-testimoni' },
            { label: 'Token Aktif', value: stats.unusedTokens, icon: <LinkIcon size={20} weight="duotone" />, cls: 'stat-aktif', sub: 'Siap dikirim' },
            { label: 'Token Terpakai', value: stats.usedTokens, icon: <Check size={20} weight="bold" />, cls: 'stat-terpakai' },
            { label: 'Konversi', value: `${stats.conversionRate}%`, icon: <TrendUp size={20} weight="duotone" />, cls: 'stat-konversi' },
          ].map((stat, i) => (
            <div key={i} className={`dash-stat-card ${stat.cls}`} style={{ padding: '1.25rem', borderRadius: '1rem', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                <div className="stat-icon">{stat.icon}</div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{stat.value}</div>
              {stat.sub && <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: '0.375rem' }}>{stat.sub}</div>}
            </div>
          ))}
        </section>

        {/* ====== QUICK LINKS ====== */}
        <section className="dash-quick-links">
          <Link to={`/brand/${business.slug}`} className="quick-link-card">
            <div className="quick-link-icon"><ArrowSquareOut size={20} weight="duotone" /></div>
            <div>
              <div className="quick-link-title">Profil Publik</div>
              <div className="quick-link-desc">Halaman reputasi bisnis Anda</div>
            </div>
          </Link>
          <Link to={`/experience/${business.slug}`} className="quick-link-card">
            <div className="quick-link-icon"><Gift size={20} weight="duotone" /></div>
            <div>
              <div className="quick-link-title">Form Testimoni</div>
              <div className="quick-link-desc">Bagikan ke pelanggan Anda</div>
            </div>
          </Link>
          <a href={`/brand/${business.slug}`} target="_blank" rel="noopener noreferrer" className="quick-link-card">
            <div className="quick-link-icon"><ShareNetwork size={20} weight="duotone" /></div>
            <div>
              <div className="quick-link-title">Bagikan</div>
              <div className="quick-link-desc">Sebar ke media sosial</div>
            </div>
          </a>
        </section>

        {/* ====== 2-COLUMN CONTENT ====== */}
        <div className="dash-content-grid">
          {/* --- TOKEN PANEL --- */}
          <div className="dash-panel">
            <div className="dash-panel-header">
              <h3><LinkIcon size={18} weight="duotone" style={{ color: 'var(--color-primary)' }} /> Daftar Token ({tokens.length})</h3>
              <button
                onClick={openTokenModal}
                disabled={business.verification_status !== 'approved'}
                className="copy-btn"
                style={{
                  fontWeight: 700,
                  opacity: (business.verification_status !== 'approved') ? 0.6 : 1,
                  cursor: (business.verification_status !== 'approved') ? 'not-allowed' : 'pointer'
                }}
              >
                <Plus size={12} weight="bold" /> Buat
              </button>
            </div>
            <div className="dash-panel-body">
              {tokens.length === 0 ? (
                <div className="dash-empty">
                  <div className="dash-empty-icon"><Clipboard size={24} weight="duotone" /></div>
                  <p>Belum ada token. Buat token dan kirimkan ke pelanggan untuk mulai mengumpulkan testimoni.</p>
                </div>
              ) : (
                <>
                  {paginatedTokens.map((t) => (
                    <div key={t.id} className="token-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', minWidth: 0 }}>
                        <span className="token-code">{t.token.substring(0, 8)}...</span>
                        <span className="token-meta">
                          {t.product_name || 'Tanpa produk'} · {timeAgo(t.created_at)}
                        </span>
                      </div>
                      <div className="token-actions">
                        <span className={`token-badge ${t.is_used ? 'terpakai' : 'aktif'}`}>
                          {t.is_used ? 'Terpakai' : 'Aktif'}
                        </span>
                        {!t.is_used && (
                          <button onClick={() => copyTokenLink(t.token)} className="copy-btn">
                            {copiedToken === t.token ? <><Check size={12} /> Tersalin</> : <><Copy size={12} /> Salin</>}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {totalTokenPages > 1 && (
                    <div className="dash-pagination">
                      <button className="page-btn" onClick={() => setTokenPage(p => p - 1)} disabled={tokenPage === 1}><CaretLeft size={12} /></button>
                      {Array.from({ length: totalTokenPages }, (_, i) => (
                        <button key={i} className={`page-btn ${tokenPage === i + 1 ? 'active' : ''}`} onClick={() => setTokenPage(i + 1)}>{i + 1}</button>
                      ))}
                      <button className="page-btn" onClick={() => setTokenPage(p => p + 1)} disabled={tokenPage === totalTokenPages}><CaretRight size={12} /></button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* --- TESTIMONI PANEL --- */}
          <div className="dash-panel">
            <div className="dash-panel-header">
              <h3><ChatCircleText size={18} weight="duotone" style={{ color: 'var(--color-primary)' }} /> Testimoni Terbaru ({testimonials.length})</h3>
            </div>
            <div className="dash-panel-body">
              {testimonials.length === 0 ? (
                <div className="dash-empty">
                  <div className="dash-empty-icon"><ChatCircleText size={24} weight="duotone" /></div>
                  <p>Belum ada testimoni masuk. Hasilkan token dan kirimkan kepada pelanggan Anda untuk mulai mengumpulkan ulasan.</p>
                </div>
              ) : (
                <>
                  {paginatedTesti.map((t) => (
                    <div key={t.id} className="testi-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '0.5rem' }}>
                        <div className="testi-header" style={{ marginBottom: 0 }}>
                          <div className="testi-avatar">{getInitials(t.customer_name)}</div>
                          <div className="testi-info">
                            <div className="testi-name">{t.customer_name?.replace(/<[^>]*>/g, '')}</div>
                            <div className="testi-date">{timeAgo(t.created_at)}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          style={{
                            background: 'none', border: 'none', color: '#ef4444',
                            cursor: 'pointer', padding: '4px', borderRadius: '4px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s', marginTop: '2px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          title="Hapus Testimoni"
                        >
                          <Trash size={16} weight="bold" />
                        </button>
                      </div>
                      <div className="testi-stars">{renderStars(t.rating)}</div>
                      <p className="testi-content">"{ (t.content || t.review_text || '')?.replace(/<[^>]*>/g, '') }"</p>
                      {t.photo_urls && t.photo_urls.length > 0 && (
                        <div className="testi-photos">
                          {t.photo_urls.map((url, i) => (
                            <img key={i} src={url} alt={`Foto ${i + 1}`} className="testi-photo" onClick={() => window.open(url, '_blank')} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {totalTestiPages > 1 && (
                    <div className="dash-pagination">
                      <button className="page-btn" onClick={() => setTestiPage(p => p - 1)} disabled={testiPage === 1}><CaretLeft size={12} /></button>
                      {Array.from({ length: totalTestiPages }, (_, i) => (
                        <button key={i} className={`page-btn ${testiPage === i + 1 ? 'active' : ''}`} onClick={() => setTestiPage(i + 1)}>{i + 1}</button>
                      ))}
                      <button className="page-btn" onClick={() => setTestiPage(p => p + 1)} disabled={testiPage === totalTestiPages}><CaretRight size={12} /></button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ====== CUSTOMER LOYALTY POINTS PANEL (Full-width) ====== */}
        <div className="dash-panel full-width" style={{ marginBottom: '1.5rem' }}>
          <div className="dash-panel-header">
            <h3>
              <Gift size={18} weight="duotone" style={{ color: 'var(--color-primary)' }} /> Pelanggan & Poin Loyalitas
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              {loyaltyList.length} Pelanggan Terdaftar
            </span>
          </div>
          <div className="dash-panel-body">
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Pelanggan mendapatkan 50 poin loyalitas dari setiap ulasan terverifikasi yang mereka kirimkan.
            </p>
            {loyaltyList.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: '400px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Nama Pelanggan</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Email</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Total Poin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loyaltyList.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text)', fontWeight: 600 }}>
                          {item.customer_name}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                          {item.customer_email}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--color-primary)', fontWeight: 700, textAlign: 'right' }}>
                          {item.points} PTS
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="dash-empty" style={{ padding: '1.5rem' }}>
                <div className="dash-empty-icon"><Gift size={24} weight="duotone" /></div>
                <p>Belum ada pelanggan yang mengklaim poin loyalitas.</p>
              </div>
            )}
          </div>
        </div>

        {/* ====== API KEYS PANEL (Full-width) ====== */}
        <div className="dash-panel full-width" style={{ marginBottom: '2rem' }}>
          <div className="dash-panel-header">
            <h3>
              <Key size={18} weight="duotone" style={{ color: 'var(--color-primary)' }} /> Developer API
              <span style={{ fontSize: '0.625rem', backgroundColor: '#fbbf24', color: '#fff', padding: '0.125rem 0.5rem', borderRadius: '4px', marginLeft: '0.5rem', fontWeight: 700 }}>PRO</span>
            </h3>
            <button onClick={handleGenerateApiKey} className="copy-btn" style={{ fontWeight: 700 }}>
              <Plus size={12} weight="bold" /> Buat API Key
            </button>
          </div>
          <div className="dash-panel-body">
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Gunakan API Key untuk mengintegrasikan TestimoniPro ke website atau aplikasi Anda sendiri.
            </p>
            {apiKeys.length > 0 ? (
              apiKeys.map((key) => (
                <div key={key.id} className="token-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="token-code">{key.api_key_hash.substring(0, 8)}...****</span>
                    <span className="token-meta">Dibuat {timeAgo(key.created_at)}</span>
                  </div>
                  <span className="token-badge terpakai">Aktif</span>
                </div>
              ))
            ) : (
              <div className="dash-empty" style={{ padding: '1.5rem' }}>
                <p>Belum ada API Key. Buat API Key untuk mulai mengintegrasikan testimoni ke website Anda.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ====== CREATE TOKEN MODAL DIALOG ====== */}
      {isTokenModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            maxWidth: '440px',
            width: '100%',
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: '1.25rem',
            padding: '1.75rem',
            boxShadow: 'var(--shadow-lg)',
            animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Menerbitkan Token Transaksi
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Tautkan testimoni ke produk/layanan tertentu dan nomor referensi resi/invoice untuk jaminan audit.
            </p>

            <form onSubmit={handleGenerateToken}>
              {/* Nama Produk */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.375rem' }}>
                  Nama Produk / Jasa
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Perawatan Aura Facial, Kopi Arabika"
                  value={tokenForm.productName}
                  onChange={(e) => setTokenForm({ ...tokenForm, productName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    transition: 'border-color 0.15s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                />
              </div>

              {/* Referensi Transaksi */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.375rem' }}>
                  ID Transaksi / Resi / Invoice
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: TRX-102948"
                  value={tokenForm.transactionRef}
                  onChange={(e) => setTokenForm({ ...tokenForm, transactionRef: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    transition: 'border-color 0.15s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsTokenModalOpen(false)}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-glow)',
                    opacity: generating ? 0.7 : 1
                  }}
                >
                  {generating ? 'Membuat...' : 'Terbitkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}