import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { useTheme } from '../lib/ThemeContext';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/Assets/Logo/logo-dark-page.svg' : '/Assets/Logo/logo-white-page.svg';

  const bg = 'var(--color-bg)';
  const bgCard = 'var(--color-bg-elevated)';
  const text = 'var(--color-text)';
  const textSec = 'var(--color-text-secondary)';
  const textMut = 'var(--color-text-muted)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bg,
      color: text,
      fontFamily: 'var(--font-body)',
    }}>
      <Navbar />

      <main style={{ maxWidth: '780px', margin: '0 auto', padding: '7rem 1.5rem 5rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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

        {/* Title */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '0.75rem',
              backgroundColor: 'var(--color-primary-light)',
              color: primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Shield size={22} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              color: text,
            }}>
              Kebijakan Privasi
            </h1>
          </div>
          <p style={{
            fontSize: '0.9375rem',
            color: textSec,
            lineHeight: 1.6,
          }}>
            Terakhir diperbarui: 1 Januari 2026
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: border, marginBottom: '2.5rem' }} />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '0.9375rem', lineHeight: 1.85, color: textSec }}>
          
          <section>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.75rem',
            }}>
              1. Pendahuluan
            </h2>
            <p>
              TestimoniPro ("kami", "Platform") berkomitmen untuk melindungi dan menghormati privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Anda saat Anda menggunakan layanan kami melalui situs web testimonipro.site dan seluruh subdomain terkait ("Layanan").
            </p>
            <p>
              Dengan mengakses atau menggunakan Layanan kami, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan Kebijakan Privasi ini. Jika Anda tidak setuju dengan kebijakan ini, mohon untuk tidak menggunakan Layanan kami.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.75rem',
            }}>
              2. Informasi yang Kami Kumpulkan
            </h2>
            <p><strong>2.1 Informasi yang Anda Berikan Secara Langsung</strong></p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Data Pendaftaran Bisnis:</strong> Nama bisnis, kategori bisnis, nama pemilik, dan nomor WhatsApp.</li>
              <li><strong>Data Profil Bisnis:</strong> Logo, foto, deskripsi bisnis, alamat, tautan media sosial, dan informasi lain yang Anda tambahkan ke halaman profil publik.</li>
              <li><strong>Data Testimoni:</strong> Nama pelanggan, isi ulasan, rating, foto yang diunggah, dan token transaksi yang terkait.</li>
              <li><strong>Komunikasi:</strong> Setiap pesan, pertanyaan, atau permintaan yang Anda kirimkan kepada kami melalui email atau fitur kontak.</li>
            </ul>

            <p style={{ marginTop: '1rem' }}><strong>2.2 Informasi yang Dikumpulkan Secara Otomatis</strong></p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Data Teknis:</strong> Alamat IP, jenis browser, versi browser, sistem operasi, dan informasi perangkat.</li>
              <li><strong>Data Penggunaan:</strong> Halaman yang dikunjungi, waktu kunjungan, durasi sesi, dan pola navigasi.</li>
              <li><strong>Data Verifikasi Anti-Penipuan:</strong> Fingerprint perangkat dan pola penggunaan untuk mencegah aktivitas Sybil, bot, dan ulasan palsu.</li>
            </ul>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.75rem',
            }}>
              3. Tujuan Penggunaan Data
            </h2>
            <p>Kami menggunakan data yang kami kumpulkan untuk tujuan berikut:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Menyediakan Layanan:</strong> Membuat dan mengelola akun bisnis, menghasilkan token unik, memproses testimoni, dan menampilkan halaman profil publik.</li>
              <li><strong>Verifikasi dan Keamanan:</strong> Mendeteksi dan mencegah penipuan, ulasan palsu, serangan bot, dan aktivitas tidak sah lainnya melalui sistem anti-Sybil kami.</li>
              <li><strong>Perhitungan Skor:</strong> Menganalisis data transaksi dan testimoni untuk menghasilkan TP Trust Grade secara otomatis.</li>
              <li><strong>Komunikasi:</strong> Mengirim pemberitahuan terkait akun, token, atau pembaruan penting pada Layanan.</li>
              <li><strong>Peningkatan Produk:</strong> Memahami bagaimana pengguna berinteraksi dengan Platform untuk meningkatkan fitur dan pengalaman pengguna.</li>
              <li><strong>Kepatuhan Hukum:</strong> Memenuhi kewajiban hukum yang berlaku dan menegakkan Ketentuan Layanan kami.</li>
            </ul>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.75rem',
            }}>
              4. Dasar Hukum Pemrosesan Data
            </h2>
            <p>
              Kami memproses data pribadi Anda berdasarkan satu atau lebih dasar hukum berikut:
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Persetujuan (Consent):</strong> Anda telah memberikan persetujuan eksplisit untuk pemrosesan data Anda untuk tujuan tertentu.</li>
              <li><strong>Pelaksanaan Kontrak:</strong> Pemrosesan diperlukan untuk memberikan Layanan yang Anda minta.</li>
              <li><strong>Kepentingan yang Sah:</strong> Pemrosesan diperlukan untuk kepentingan bisnis kami yang sah, termasuk pencegahan penipuan dan peningkatan layanan.</li>
              <li><strong>Kewajiban Hukum:</strong> Pemrosesan diperlukan untuk mematuhi peraturan perundang-undangan yang berlaku di Republik Indonesia.</li>
            </ul>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.75rem',
            }}>
              5. Penyimpanan dan Retensi Data
            </h2>
            <p>
              Kami menyimpan data pribadi Anda selama akun Anda aktif atau selama diperlukan untuk menyediakan Layanan kepada Anda. Setelah Anda menghapus akun, kami akan menghapus atau menganonimkan data pribadi Anda dalam waktu 60 (enam puluh) hari kalender, kecuali jika penyimpanan lebih lanjut diwajibkan oleh hukum yang berlaku.
            </p>
            <p>
              Data transaksi anonim dan skor agregat dapat disimpan lebih lama untuk tujuan analitik dan peningkatan sistem. Data yang telah dianonimkan tidak dapat dikaitkan kembali dengan individu atau bisnis tertentu.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.75rem',
            }}>
              6. Berbagi Data dengan Pihak Ketiga
            </h2>
            <p>
              Kami <strong>tidak menjual, menyewakan, atau memperdagangkan</strong> data pribadi Anda kepada pihak ketiga. Kami hanya membagikan data Anda dalam keadaan berikut:
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Penyedia Layanan:</strong> Kami menggunakan penyedia layanan pihak ketiga untuk hosting (Supabase), autentikasi, dan analitik. Pihak ketiga ini terikat oleh perjanjian kerahasiaan dan hanya memproses data sesuai instruksi kami.</li>
              <li><strong>Konten Publik:</strong> Informasi yang Anda pilih untuk ditampilkan di halaman profil publik bisnis Anda (nama bisnis, deskripsi, testimoni) akan terlihat oleh umum.</li>
              <li><strong>Kewajiban Hukum:</strong> Kami dapat mengungkapkan data jika diwajibkan oleh hukum, perintah pengadilan, atau permintaan dari otoritas pemerintah yang sah.</li>
              <li><strong>Perlindungan Hak:</strong> Kami dapat mengungkapkan data untuk melindungi hak, properti, atau keselamatan TestimoniPro, pengguna kami, atau publik.</li>
            </ul>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.75rem',
            }}>
              7. Keamanan Data
            </h2>
            <p>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang sesuai untuk melindungi data pribadi Anda dari akses tidak sah, perubahan, pengungkapan, atau perusakan. Langkah-langkah ini meliputi:
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Enkripsi data saat transit (TLS/SSL) dan saat tersimpan.</li>
              <li>Akses terbatas ke data pribadi hanya untuk personel yang berwenang.</li>
              <li>Pemantauan sistem secara berkala untuk mendeteksi kerentanan dan serangan.</li>
              <li>Kebijakan kata sandi yang ketat dan autentikasi multi-faktor untuk sistem internal.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              Meskipun kami berusaha melindungi data Anda, tidak ada metode transmisi melalui internet atau penyimpanan elektronik yang 100% aman. Kami tidak dapat menjamin keamanan absolut dari data Anda.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.75rem',
            }}>
              8. Hak-Hak Anda Atas Data Pribadi
            </h2>
            <p>Sebagai pengguna Layanan kami, Anda memiliki hak-hak berikut:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Hak Akses:</strong> Meminta salinan data pribadi yang kami miliki tentang Anda.</li>
              <li><strong>Hak Koreksi:</strong> Memperbaiki data yang tidak akurat atau tidak lengkap.</li>
              <li><strong>Hak Penghapusan:</strong> Meminta penghapusan data pribadi Anda ("Hak untuk Dilupakan").</li>
              <li><strong>Hak Pembatasan:</strong> Membatasi pemrosesan data pribadi Anda dalam keadaan tertentu.</li>
              <li><strong>Hak Portabilitas:</strong> Menerima data Anda dalam format yang terstruktur dan dapat dibaca mesin.</li>
              <li><strong>Hak Keberatan:</strong> Menolak pemrosesan data pribadi Anda untuk tujuan tertentu.</li>
              <li><strong>Hak Pencabutan Persetujuan:</strong> Menarik kembali persetujuan yang telah diberikan kapan saja.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              Untuk menggunakan hak-hak tersebut, hubungi kami melalui email di <strong>privacy@testimonipro.site</strong>. Kami akan merespons permintaan Anda dalam waktu 30 (tiga puluh) hari kalender.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.75rem',
            }}>
              9. Cookie dan Teknologi Pelacakan
            </h2>
            <p>
              Kami menggunakan cookie dan teknologi serupa untuk:
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Cookie Esensial:</strong> Diperlukan untuk fungsi dasar Platform (misalnya, penyimpanan preferensi tema, status sesi).</li>
              <li><strong>Cookie Analitik:</strong> Membantu kami memahami bagaimana pengguna berinteraksi dengan Platform (misalnya, halaman yang paling sering dikunjungi).</li>
              <li><strong>Cookie Preferensi:</strong> Menyimpan preferensi Anda seperti pengaturan tema gelap/terang.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              Anda dapat mengontrol cookie melalui pengaturan browser Anda. Harap dicatat bahwa menonaktifkan cookie tertentu dapat memengaruhi fungsionalitas Layanan.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.75rem',
            }}>
              10. Transfer Data Internasional
            </h2>
            <p>
              Data Anda dapat ditransfer dan disimpan di server yang berlokasi di luar wilayah domisili Anda. Dalam hal tersebut, kami akan memastikan bahwa perlindungan yang memadai diterapkan sesuai dengan hukum perlindungan data yang berlaku, termasuk penggunaan klausul kontrak standar atau mekanisme lain yang disetujui.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.75rem',
            }}>
              11. Privasi Anak-Anak
            </h2>
            <p>
              Layanan kami tidak ditujukan untuk individu di bawah usia 18 (delapan belas) tahun. Kami tidak secara sadar mengumpulkan data pribadi dari anak-anak. Jika Anda adalah orang tua atau wali dan mengetahui bahwa anak Anda telah memberikan data pribadi kepada kami, silakan hubungi kami segera agar data tersebut dapat dihapus.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.75rem',
            }}>
              12. Perubahan pada Kebijakan Privasi
            </h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Setiap perubahan akan diumumkan melalui halaman ini dengan tanggal "Terakhir diperbarui" yang baru. Untuk perubahan yang signifikan, kami akan memberikan pemberitahuan tambahan melalui email atau notifikasi di Platform.
            </p>
            <p>
              Kami menyarankan Anda untuk meninjau Kebijakan Privasi ini secara berkala. Penggunaan Layanan yang berkelanjutan setelah perubahan dipublikasikan merupakan persetujuan Anda terhadap kebijakan yang diperbarui.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: text,
              marginBottom: '0.75rem',
            }}>
              13. Hubungi Kami
            </h2>
            <p>
              Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait Kebijakan Privasi ini atau praktik data kami, silakan hubungi kami melalui:
            </p>
            <div style={{
              marginTop: '1rem',
              padding: '1.25rem',
              borderRadius: '0.75rem',
              backgroundColor: bgCard,
              border: `1px solid ${border}`,
            }}>
              <p><strong>Email:</strong> privacy@testimonipro.site</p>
              <p><strong>WhatsApp:</strong> +62 812-XXXX-XXXX</p>
              <p><strong>Alamat:</strong> Semarang, Indonesia</p>
              <p><strong>Website:</strong> testimonipro.site</p>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
          padding: '2rem',
          borderRadius: '1rem',
          backgroundColor: bgCard,
          border: `1px solid ${border}`,
        }}>
          <p style={{ fontSize: '0.9375rem', color: textMut, marginBottom: '0.75rem' }}>
            Perlindungan data Anda adalah prioritas kami.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.5rem',
              borderRadius: '0.75rem',
              backgroundColor: primary,
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  );
}