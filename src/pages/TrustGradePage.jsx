import { useState } from 'react';
import Navbar from '../components/ui/Navbar';
import { useTheme } from '../lib/ThemeContext';
import { ShieldCheck, Star, TrendingUp, BadgeCheck, Heart, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  {
    id: 'apa-itu',
    title: 'Apa Itu TP Trust Grade?',
    content: `TP Trust Grade adalah <strong>skor kepercayaan</strong> yang diberikan TestimoniPro kepada setiap produk atau bisnis, dalam skala <strong>0 sampai 100</strong>.

Angka ini bukan sekadar rating bintang biasa. Ini adalah hasil dari <strong>audit nyata</strong> terhadap transaksi yang benar-benar terjadi. Bukan opini, bukan perkiraan — tapi <strong>data.</strong>

Semakin tinggi angkanya, semakin bisa dipercaya produk atau bisnis tersebut. Sederhana.`,
  },
  {
    id: 'kenapa-penting',
    title: 'Kenapa Ini Penting?',
    content: `Bayangkan Anda hendak membeli produk di toko daring. Anda melihat ribuan ulasan, namun sulit untuk membedakan ulasan asli dengan ulasan palsu atau berbayar.

<strong>Seringkali, pembeli kesulitan untuk mengetahuinya.</strong>

TP Trust Grade hadir untuk memberikan kepastian. Kami <strong>memverifikasi setiap transaksi</strong> satu per satu. Anda tidak perlu lagi menduga-duga — cukup dengan melihat skor yang tertera. Skor yang tinggi menandakan tingkat kepercayaan yang tinggi.

Ini seperti <strong>KTP untuk reputasi digital.</strong>`,
  },
  {
    id: 'bagaimana-cara-kerja',
    title: 'Bagaimana Cara Kerjanya?',
    content: `<strong>Sederhana:</strong>

1. Setiap kali ada transaksi, penjual membuat <strong>token unik</strong> sekali pakai dari dashboard mereka.
2. Token itu dikirim ke pembeli — seperti <strong>kode rahasia</strong> yang cuma berlaku sekali.
3. Pembeli menggunakan token tersebut untuk memberikan ulasan.
4. Sistem kami akan memvalidasi bahwa transaksi tersebut benar-benar terjadi.

Setelah terkumpul, kami audit secara berkala. Jika semua ulasan asli dan konsisten, skor akan meningkat. Jika terdapat indikasi mencurigakan, skor akan menurun.`,
  },
  {
    id: 'skala',
    title: 'Apa Arti Skala 0-100?',
    content: `Kami menyusun skala yang mudah dipahami:

• <strong>0–29 (Merah)</strong> — Data belum mencukupi atau terdapat aktivitas yang mencurigakan. Diperlukan kehati-hatian.
• <strong>30–59 (Kuning)</strong> — Mulai terlihat konsisten, tapi masih perlu waktu.
• <strong>60–79 (Hijau)</strong> — Bisnis yang bisa dipercaya. Trader yang serius.
• <strong>80–100 (Emas)</strong> — Kualitas dan reputasi yang sudah terbukti. Ini <strong>premium.</strong>

Skor yang tinggi diperoleh melalui <strong>konsistensi dan transaksi nyata</strong> yang tervalidasi dari waktu ke waktu.`,
  },
  {
    id: 'manfaat-untuk-pembeli',
    title: 'Manfaat Bagi Anda Sebagai Pembeli',
    content: `• <strong>Tidak perlu ragu</strong> — skor akan membantu Anda menilai kredibilitas suatu bisnis secara instan.
• <strong>Hemat waktu riset</strong> — bandingkan skor antar bisnis untuk melihat perbedaannya dengan cepat.
• <strong>Terhindar dari penipuan</strong> — karena skor rendah dapat menjadi indikator awal untuk lebih waspada.

TP Trust Grade berfungsi sebagai <strong>indikator kepercayaan utama</strong> yang memandu Anda dalam melakukan transaksi secara daring.`,
  },
  {
    id: 'manfaat-untuk-penjual',
    title: 'Manfaat Bagi Penjual',
    content: `• <strong>Bedakan bisnis Anda dari pesaing</strong> — skor tinggi adalah bukti bahwa Anda menjalankan bisnis dengan serius.
• <strong>Meningkatkan kepercayaan pelanggan</strong> — reputasi yang terverifikasi akan meningkatkan kepercayaan calon pembeli.
• <strong>Meningkatkan konversi penjualan</strong> — ulasan terverifikasi sangat efektif dalam mendorong keputusan pembelian pelanggan.

Ini bukan sekadar lencana, melainkan <strong>aset bisnis</strong> yang efektif meyakinkan calon pelanggan baru sejak pandangan pertama.`,
  },
  {
    id: 'siapa-yang-menilai',
    title: 'Siapa yang Menilai?',
    content: `<strong>Sistem Kami, Secara Otomatis.</strong>

Penilaian tidak dilakukan oleh tim pemasaran, bukan opini subjektif, dan tidak dapat dibeli.

Sistem membaca data dari transaksi yang sudah diverifikasi dengan token. Dari situ, kami menghitung <strong>keaslian ulasan, konsistensi rating, dan volume transaksi</strong> — lalu menghasilkan skor.

<strong>Skor ini tidak dapat dimanipulasi oleh campur tangan manusia.</strong> Semua berbasis data yang terekam oleh sistem.`,
  },
  {
    id: 'mulai',
    title: 'Bagaimana Cara Mendapatkannya?',
    content: `Jika Anda adalah pemilik bisnis, silakan <a href="/daftar" style="color: var(--color-primary); font-weight: 600;">daftarkan bisnis Anda di sini</a>. Langkah selanjutnya:

1. Generate token unik untuk setiap transaksi
2. Kirim ke pelanggan Anda
3. Kumpulkan ulasan terverifikasi
4. Skor Anda akan mulai terbentuk secara otomatis

<strong>Gratis untuk 100 bisnis pertama (berlaku 1 tahun).</strong> Tidak ada biaya tersembunyi apa pun.`,
  },
];

export default function TrustGradePage() {
  const { theme } = useTheme();
  const logoSrc =
    theme === 'dark' ? '/Assets/Logo/logo-dark-page.svg' : '/Assets/Logo/logo-white-page.svg';

  const bg = 'var(--color-bg)';
  const bg2 = 'var(--color-bg-secondary)';
  const text = 'var(--color-text)';
  const textSec = 'var(--color-text-secondary)';
  const textMut = 'var(--color-text-muted)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';
  const primaryLight = 'var(--color-primary-light)';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: bg,
        color: text,
        fontFamily: 'var(--font-body)',
      }}
    >
      <Navbar />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '7rem 1.5rem 5rem' }}>
        {/* Logo Center */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-block',
              width: '140px',
              height: '28px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
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

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: text,
              marginBottom: '0.75rem',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            TP Trust Grade
          </h1>
          <p
            style={{
              fontSize: '1.0625rem',
              color: textSec,
              maxWidth: '480px',
              margin: '0.75rem auto 0',
              lineHeight: 1.6,
            }}
          >
            Learn how we calculate and assign trust grades to ensure reliable reviews.
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: border,
            marginBottom: '3rem',
          }}
        />

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.375rem',
                  fontWeight: 700,
                  color: text,
                  marginBottom: '1rem',
                  lineHeight: 1.3,
                }}
              >
                {section.title}
              </h2>
              <div
                style={{
                  fontSize: '1rem',
                  color: textSec,
                  lineHeight: 1.85,
                }}
                dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>') }}
              />
            </section>
          ))}
        </div>

        {/* CTA Footer */}
        <div
          style={{
            marginTop: '3rem',
            padding: '2rem',
            borderRadius: '1rem',
            backgroundColor: bg2,
            border: `1px solid ${border}`,
            textAlign: 'center',
          }}
        >
          <ShieldCheck size={28} style={{ color: primary, marginBottom: '0.75rem' }} />
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.5rem',
            }}
          >
            Mulai Bangun Reputasi Bisnis Anda Sekarang
          </h3>
          <p
            style={{
              fontSize: '0.9375rem',
              color: textSec,
              marginBottom: '1.25rem',
              lineHeight: 1.6,
              maxWidth: '450px',
              margin: '0 auto 1.25rem',
            }}
          >
            Daftar gratis — 100 bisnis pertama akan mendapatkan akses penuh selama 1 tahun. Tanpa perlu kartu kredit, tanpa biaya tersembunyi.
          </p>
          <Link
            to="/daftar"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.75rem',
              borderRadius: '0.75rem',
              backgroundColor: primary,
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-glow)',
              transition: 'all 0.2s ease',
            }}
          >
            Daftarkan Bisnis <Zap size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}