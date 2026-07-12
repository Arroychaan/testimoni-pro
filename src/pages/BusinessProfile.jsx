import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, ChatCircle, Star } from '@phosphor-icons/react';
import { getBusinessBySlug, getTestimonials } from '../lib/supabase';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function BusinessProfile() {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const bg = 'var(--color-bg)';
  const bg2 = 'var(--color-bg-secondary)';
  const bgElevated = 'var(--color-bg-elevated)';
  const text = 'var(--color-text)';
  const textSec = 'var(--color-text-secondary)';
  const textMut = 'var(--color-text-muted)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';
  const primaryLight = 'var(--color-primary-light)';

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: biz } = await getBusinessBySlug(slug);
      if (biz) {
        setBusiness(biz);
        const { data: reviews } = await getTestimonials(biz.id, { ratingFilter: 0 });
        setTestimonials(reviews || []);
      }
      setLoading(false);
    }
    loadData();
  }, [slug]);

  function getTrustColor(score) {
    if (score >= 90) return '#16a34a';
    if (score >= 75) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  }

  const trustGrade = {
    score: business.trust_score || 0,
    label: business.trust_label || 'Belum ada data',
    color: getTrustColor(business.trust_score || 0)
  };

  // ✅ FIX K1: Cek apakah testimoni memiliki verified_token
  function isVerified(testi) {
    return !!(testi.verified_token && testi.verified_token.trim() !== '');
  }

  // Rating stars helper
  function renderStars(rating) {
    return '★'.repeat(Math.round(rating || 0)) + '☆'.repeat(5 - Math.round(rating || 0));
  }

  if (loading) return <LoadingSpinner text="Memverifikasi Identitas Bisnis..." />;

  if (!business) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: text, fontFamily: 'var(--font-body)' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1rem' }}>Profil Tidak Ditemukan</h1>
          <Link to="/" style={{ color: primary, fontWeight: 600 }}>Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, color: text, fontFamily: 'var(--font-body)', paddingBottom: '6rem' }}>
      {/* Top Bar */}
      {!business.is_pro && (
        <div style={{
          width: '100%', padding: '0.625rem 1rem', textAlign: 'center',
          backgroundColor: bg2, borderBottom: `1px solid ${border}`,
          fontSize: '0.75rem', color: textMut,
        }}>
          Verified Public Trust Profile by TestimoniPro
        </div>
      )}

      <div style={{ maxWidth: '672px', margin: '0 auto', padding: '2.5rem 1rem' }}>

        {/* Header */}
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: primary, fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                <ShieldCheck size={18} weight="duotone" /> Verified Business
                {business.is_pro && (
                  <span style={{ backgroundColor: '#fbbf24', color: '#fff', padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.625rem', marginLeft: '0.25rem' }}>PRO</span>
                )}
              </div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: text, lineHeight: 1.15, marginBottom: '0.25rem' }}>
                {business.name}
              </h1>
              {business.category && <p style={{ color: textSec, fontSize: '0.9375rem' }}>{business.category}</p>}
              {/* ✅ FIX 1A: tampilkan lokasi jika ada */}
              {business.location && (
                <p style={{ color: textMut, fontSize: '0.8125rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={14} weight="duotone" /> {business.location}
                </p>
              )}
            </div>
            {business.logo_url ? (
              <img
                src={business.logo_url}
                alt={business.name}
                style={{
                  width: '64px', height: '64px',
                  borderRadius: '0.75rem', objectFit: 'cover',
                  border: `1px solid ${border}`,
                }}
              />
            ) : (
              <div style={{
                width: '64px', height: '64px',
                backgroundColor: bg2, borderRadius: '0.75rem',
                border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem', fontWeight: 800, color: textMut,
                fontFamily: 'var(--font-heading)',
              }}>
                {business.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem',
            padding: '1.25rem 0', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`,
            fontSize: '0.875rem',
          }}>
            <div>
              <div style={{ color: textMut, marginBottom: '0.25rem' }}>Business ID</div>
              <div style={{ color: text, fontWeight: 600 }}>#B-{business.id.substring(0, 8).toUpperCase()}</div>
            </div>
            <div>
              <div style={{ color: textMut, marginBottom: '0.25rem' }}>Location</div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={16} weight="duotone" /> {business.location || 'Semarang, ID'}
              </span>
            </div>
            <div>
              <div style={{ color: textMut, marginBottom: '0.25rem' }}>Total Testimoni</div>
              <div style={{ color: text, fontWeight: 600 }}>{testimonials.length}</div>
            </div>
            <div>
              <div style={{ color: textMut, marginBottom: '0.25rem' }}>Trust Grade</div>
              {/* ✅ FIX K2: Trust Grade dinamis berbasis rating + jumlah + verifikasi */}
              <div style={{ 
                color: trustGrade.color, 
                fontWeight: 700, 
                fontFamily: 'var(--font-heading)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}>
                TP-{trustGrade.score}
                <span style={{ 
                  fontSize: '0.6875rem', 
                  fontWeight: 600,
                  backgroundColor: trustGrade.color + '20',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '4px',
                }}>
                  {trustGrade.label}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Testimonials Timeline */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${border}`, paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, color: text }}>
              Pengalaman Pelanggan
            </h2>
            <span style={{ fontSize: '0.8125rem', color: textMut }}>{testimonials.length} Testimoni</span>
          </div>

          {testimonials.length === 0 ? (
            <div style={{
              padding: '2.5rem', textAlign: 'center',
              borderRadius: '1rem', border: `1px dashed ${border}`,
              backgroundColor: bg2,
            }}>
              <p style={{ color: textMut, marginBottom: '1rem' }}>Belum ada pengalaman yang dibagikan.</p>
              <Link
                to={`/experience/${slug}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.625rem 1.25rem', borderRadius: '0.625rem',
                  backgroundColor: primary, color: '#fff', fontWeight: 600, fontSize: '0.875rem',
                  textDecoration: 'none',
                }}
              >
                Jadilah yang pertama untuk membagikan ulasan
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {testimonials.map((testi, idx) => (
                <div key={testi.id} style={{
                  position: 'relative', paddingLeft: '1.5rem', paddingBottom: '2rem',
                  borderLeft: idx !== testimonials.length - 1 ? `1px solid ${border}` : 'none',
                }}>
                  <div style={{
                    position: 'absolute', left: '-4.5px', top: '4px',
                    width: '9px', height: '9px',
                    borderRadius: '50%', backgroundColor: primary,
                    border: `2px solid ${bg}`,
                  }} />
                  <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: text }}>{testi.customer_name}</span>
                    {/* ✅ FIX 2F: tampilkan rating */}
                    <span style={{ fontSize: '0.875rem', color: '#f59e0b', letterSpacing: '0.05em' }}>
                      {renderStars(testi.rating)}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: textMut }}>
                      {new Date(testi.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p style={{ color: textSec, lineHeight: 1.7, fontSize: '0.9375rem', marginBottom: '0.75rem' }}>
                    "{testi.review_text || testi.content || ''}"
                  </p>

                  {/* Photo Grid */}
                  {testi.photo_urls && testi.photo_urls.length > 0 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${Math.min(testi.photo_urls.length, 3)}, 1fr)`,
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                    }}>
                      {testi.photo_urls.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`Foto testimoni ${i + 1}`}
                          style={{
                            width: '100%',
                            aspectRatio: '1',
                            objectFit: 'cover',
                            borderRadius: '0.75rem',
                            border: `1px solid ${border}`,
                            cursor: 'pointer',
                          }}
                          onClick={() => window.open(url, '_blank')}
                        />
                      ))}
                    </div>
                  )}

                  {/* ✅ FIX K1: badge verifikasi hanya jika token tersedia */}
                  {isVerified(testi) ? (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                      padding: '0.375rem 0.75rem',
                      backgroundColor: primaryLight, borderRadius: '0.5rem',
                      border: `1px solid var(--color-primary-border)`,
                      fontSize: '0.75rem', color: primary, fontWeight: 600,
                    }}>
                      <ShieldCheck size={14} weight="duotone" /> Transaksi Terverifikasi
                    </div>
                  ) : (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                      padding: '0.375rem 0.75rem',
                      backgroundColor: bg2, borderRadius: '0.5rem',
                      border: `1px solid ${border}`,
                      fontSize: '0.75rem', color: textMut, fontWeight: 500,
                    }}>
                      <Star size={14} weight="duotone" /> Ulasan Publik
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '1rem', backgroundColor: bg, borderTop: `1px solid ${border}`,
        backdropFilter: 'blur(12px)', zIndex: 40,
      }}>
        <div style={{ maxWidth: '672px', margin: '0 auto', display: 'flex', gap: '0.75rem' }}>
          <a
            href={`https://wa.me/62${business.owner_whatsapp?.replace(/^0/, '') || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.75rem', borderRadius: '0.75rem',
              backgroundColor: '#22c55e', color: '#fff', fontWeight: 700, fontSize: '0.9375rem',
              textDecoration: 'none',
            }}
          >
            <ChatCircle size={20} weight="duotone" /> Hubungi via WhatsApp
          </a>
          <Link
            to={`/experience/${slug}`}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
              padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
              backgroundColor: bgElevated, color: text, fontWeight: 600, fontSize: '0.9375rem',
              textDecoration: 'none', border: `1px solid ${border}`,
            }}
          >
            Bagikan Pengalaman
          </Link>
        </div>
      </div>
    </div>
  );
}