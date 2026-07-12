import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { useTheme } from '../lib/ThemeContext';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
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
              width: '44px',
              height: '44px',
              borderRadius: '0.75rem',
              backgroundColor: 'var(--color-primary-light)',
              color: primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <FileText size={22} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              color: text,
            }}>
              Ketentuan Layanan
            </h1>
          </div>
          <p style={{ fontSize: '0.9375rem', color: textSec, lineHeight: 1.6 }}>
            Terakhir diperbarui: 1 Januari 2026
          </p>
        </div>

        <div style={{ height: '1px', backgroundColor: border, marginBottom: '2.5rem' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontSize: '0.9375rem', lineHeight: 1.85, color: textSec }}>

          {/* 1. Pendahuluan */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.75rem' }}>
              1. Pendahuluan & Penerimaan
            </h2>
            <p>
              Selamat datang di TestimoniPro ("Platform", "kami"). Dengan mengakses atau menggunakan layanan kami di <strong>testimonipro.site</strong> ("Layanan"), Anda setuju untuk terikat oleh Ketentuan Layanan ini ("Ketentuan").
            </p>
            <p>
              Jika Anda tidak menyetujui isi Ketentuan ini, harap tidak menggunakan Layanan kami. Ketentuan ini berlaku untuk seluruh pengguna: pemilik bisnis, pelanggan yang menulis ulasan, serta pihak mana pun yang mengakses Platform kami.
            </p>
            <p>
              Ketentuan ini merupakan perjanjian yang mengikat secara hukum antara Anda dan TestimoniPro sesuai dengan hukum Republik Indonesia.
            </p>
          </section>

          {/* 2. Pendaftaran & Akun */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.75rem' }}>
              2. Pendaftaran & Akun Bisnis
            </h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Saat mendaftarkan bisnis, Anda wajib memberikan informasi yang <strong>benar, akurat, dan lengkap</strong>. Penggunaan data palsu akan mengakibatkan penangguhan akun tanpa pemberitahuan.</li>
              <li>Satu akun hanya diperuntukkan bagi <strong>satu bisnis</strong>. Jika Anda memiliki beberapa bisnis, harap daftarkan masing-masing secara terpisah.</li>
              <li>Anda bertanggung jawab penuh atas seluruh aktivitas yang terjadi pada akun Anda. Harap jaga kerahasiaan akses dasbor Anda.</li>
              <li>Anda harus berusia minimal <strong>18 tahun</strong> atau telah memiliki kapasitas hukum untuk membuat perjanjian yang mengikat.</li>
              <li>Kami berhak menolak pendaftaran atau menangguhkan akun kapan saja jika ditemukan pelanggaran terhadap Ketentuan ini.</li>
            </ul>
          </section>

          {/* 3. Token Unik */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.75rem' }}>
              3. Token Unik — Aturan Main
            </h2>
            <p>
              Token Unik merupakan inti dari sistem kepercayaan TestimoniPro. Berikut adalah aturan yang wajib dipatuhi:
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Satu token <strong>hanya untuk satu transaksi nyata</strong>. Token tidak boleh digunakan untuk transaksi fiktif atau buatan.</li>
              <li>Token <strong>tidak bisa dijual, dipindahtangankan, atau diperdagangkan</strong> dalam bentuk apa pun.</li>
              <li>Setiap token hanya bisa dipakai <strong>sekali</strong>. Setelah pelanggan menggunakannya untuk menulis testimoni, token tersebut hangus.</li>
              <li>Anda <strong>dilarang keras</strong> menggunakan token untuk merekayasa ulasan palsu, termasuk meminta pihak lain untuk menulis ulasan tanpa adanya transaksi yang sebenarnya.</li>
              <li>Pelanggaran terhadap aturan penggunaan token akan mengakibatkan <strong>pembatalan seluruh token Anda</strong> dan penangguhan akun secara permanen.</li>
              <li>Kami menerapkan sistem pemindaian anti-Sybil untuk mendeteksi tindakan manipulatif. Segala bentuk kecurangan tidak akan ditoleransi.</li>
            </ul>
          </section>

          {/* 4. Testimoni & Konten */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.75rem' }}>
              4. Testimoni & Konten Pengguna
            </h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Konten ulasan (teks, foto, penilaian) yang dikirimkan oleh pelanggan sepenuhnya menjadi <strong>tanggung jawab pengirim</strong>, bukan tanggung jawab TestimoniPro.</li>
              <li>Dengan mengirimkan ulasan, Anda memberikan kepada TestimoniPro <strong>lisensi non-eksklusif</strong> untuk menampilkan konten tersebut pada profil bisnis yang bersangkutan.</li>
              <li>Kami berhak <strong>menghapus konten</strong> tanpa pemberitahuan yang mengandung: ujaran kebencian, SARA, pornografi, ancaman kekerasan, spam, informasi pribadi orang lain tanpa izin, atau konten yang melanggar hukum.</li>
              <li>Pemilik bisnis <strong>tidak diperkenankan untuk menyensor</strong> atau menghapus ulasan negatif, selama ulasan tersebut memenuhi ketentuan yang berlaku. Hal ini bertujuan untuk menjaga integritas sistem.</li>
              <li>Jika Anda menemukan ulasan yang melanggar ketentuan, silakan laporkan melalui <strong>support@testimonipro.site</strong>.</li>
            </ul>
          </section>

          {/* 5. TP Trust Grade */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.75rem' }}>
              5. TP Trust Grade — Skor Kepercayaan
            </h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>TP Trust Grade adalah skor <strong>yang dikalkulasi secara otomatis oleh sistem</strong> berdasarkan data transaksi, token, dan ulasan.</li>
              <li>Tidak ada manusia yang bisa mengubah skor secara manual. <strong>Termasuk tim TestimoniPro sendiri.</strong></li>
              <li>Kami berhak mengubah algoritma perhitungan skor kapan saja tanpa pemberitahuan sebelumnya.</li>
              <li>Skor yang rendah tidak selalu menunjukkan kualitas bisnis yang buruk; hal ini dapat disebabkan oleh kurangnya data. Demikian pula, skor tinggi bukanlah jaminan mutlak — skor ini berfungsi sebagai indikator kredibilitas, bukan sertifikasi.</li>
              <li>Anda tidak berhak untuk menuntut atau mengajukan gugatan terhadap TestimoniPro terkait nilai skor yang dihasilkan oleh sistem kami.</li>
            </ul>
          </section>

          {/* 6. Layanan Gratis */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.75rem' }}>
              6. Layanan Gratis & Harga
            </h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Saat ini, TestimoniPro menawarkan akses gratis untuk <strong>100 bisnis pertama</strong> selama 1 tahun sejak pendaftaran.</li>
              <li>Kuota "100 bisnis pertama" ditentukan berdasarkan urutan pendaftaran yang tervalidasi oleh sistem kami.</li>
              <li>TestimoniPro berhak <strong>mengubah model harga</strong> di masa depan. Perubahan akan diumumkan minimal 30 hari sebelum berlaku.</li>
              <li>Kalau di kemudian hari kami menerapkan biaya berlangganan, Anda berhak memilih untuk tidak melanjutkan layanan dan menghapus akun Anda.</li>
              <li>Saat ini <strong>tidak terdapat biaya tersembunyi</strong> dalam bentuk apa pun. Kami tidak menerapkan penjualan tambahan (upsell) atau membebankan biaya mendadak untuk fitur premium.</li>
            </ul>
          </section>

          {/* 7. Batasan Tanggung Jawab */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.75rem' }}>
              7. Batasan Tanggung Jawab
            </h2>
            <p>
              <strong>Bagian ini sangat penting. Mohon dibaca dengan saksama.</strong>
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Layanan TestimoniPro disediakan <strong>"sebagaimana adanya" (as-is)</strong>. Kami tidak menjamin Layanan akan selalu tersedia tanpa gangguan, error, atau downtime.</li>
              <li>Kami tidak bertanggung jawab atas <strong>isi testimoni</strong> yang ditulis oleh pelanggan. Testimoni adalah opini pribadi pelanggan, bukan pernyataan resmi TestimoniPro.</li>
              <li>Kami tidak bertanggung jawab atas <strong>kerugian bisnis</strong> — termasuk kehilangan pendapatan, pelanggan, atau reputasi — yang mungkin timbul dari penggunaan Layanan kami.</li>
              <li>Kami tidak bertanggung jawab atas <strong>kehilangan data</strong> yang disebabkan oleh force majeure, peretasan, atau kegagalan sistem di luar kendali kami.</li>
              <li>Apabila terjadi sengketa, batas maksimal tanggung jawab kami adalah sebesar <strong>jumlah yang telah Anda bayarkan kepada kami</strong> (yang saat ini bernilai nol, karena layanan tidak berbayar).</li>
            </ul>
          </section>

          {/* 8. Penghentian Akun */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.75rem' }}>
              8. Penghentian & Penangguhan Akun
            </h2>
            <p>
              Kami berhak menangguhkan atau menghentikan akun Anda apabila:
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Anda melanggar Ketentuan Layanan ini.</li>
              <li>Anda menggunakan Platform untuk aktivitas ilegal atau penipuan.</li>
              <li>Anda merekayasa ulasan palsu atau memanipulasi penggunaan token.</li>
              <li>Anda menyalahgunakan sistem dengan membuat banyak akun (serangan Sybil).</li>
              <li>Kami menerima laporan yang valid dari pihak ketiga mengenai pelanggaran yang Anda lakukan.</li>
            </ul>
            <p>
              Jika akun Anda dihentikan akibat pelanggaran, <strong>data bisnis dan ulasan Anda akan dihapus secara permanen</strong> setelah 60 hari. Anda tidak berhak atas kompensasi dalam bentuk apa pun.
            </p>
            <p>
              Apabila Anda ingin menutup akun secara sukarela, silakan hubungi kami melalui <strong>support@testimonipro.site</strong>. Permintaan penutupan akun akan kami proses selambat-lambatnya dalam 14 hari kerja.
            </p>
          </section>

          {/* 9. Kekayaan Intelektual */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.75rem' }}>
              9. Kekayaan Intelektual
            </h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Nama "TestimoniPro", logo, desain, kode sumber, beserta seluruh materi yang kami sediakan adalah <strong>milik eksklusif kami</strong> dan dilindungi oleh hukum kekayaan intelektual.</li>
              <li>Anda <strong>dilarang keras</strong> untuk menyalin, memodifikasi, mendistribusikan, atau membuat karya turunan dari Platform kami tanpa persetujuan tertulis dari pihak TestimoniPro.</li>
              <li>Seluruh konten yang Anda buat pada Platform (seperti profil bisnis dan deskripsi) tetap menjadi <strong>hak milik Anda</strong>. Kami hanya memerlukan lisensi terbatas untuk menampilkan konten tersebut pada layanan kami.</li>
            </ul>
          </section>

          {/* 10. Perubahan Ketentuan */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.75rem' }}>
              10. Perubahan Ketentuan Layanan
            </h2>
            <p>
              Kami berhak untuk memperbarui Ketentuan ini sewaktu-waktu. Apabila terdapat perubahan, kami akan melakukan hal-hal berikut:
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Memperbarui tanggal "Terakhir diperbarui" di halaman ini.</li>
              <li>Untuk perubahan signifikan, mengirim pemberitahuan melalui email atau notifikasi di dashboard.</li>
            </ul>
            <p>
              Penggunaan Layanan secara berkelanjutan setelah perubahan tersebut berlaku akan dianggap sebagai persetujuan Anda terhadap Ketentuan yang baru. Jika Anda tidak menyetujui perubahan tersebut, silakan hentikan penggunaan Layanan dan ajukan penghapusan akun.
            </p>
          </section>

          {/* 11. Hukum yang Berlaku */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.75rem' }}>
              11. Hukum yang Berlaku
            </h2>
            <p>
              Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum <strong>Republik Indonesia</strong>. Setiap sengketa yang timbul akan diselesaikan melalui pengadilan negeri di wilayah domisili kami, atau melalui mekanisme penyelesaian sengketa alternatif yang disepakati bersama.
            </p>
          </section>

          {/* 12. Kontak */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.75rem' }}>
              12. Hubungi Kami
            </h2>
            <p>
              Apabila Anda memiliki pertanyaan lebih lanjut mengenai Ketentuan ini, jangan ragu untuk menghubungi kami melalui informasi berikut:
            </p>
            <div style={{
              marginTop: '1rem',
              padding: '1.25rem',
              borderRadius: '0.75rem',
              backgroundColor: bgCard,
              border: `1px solid ${border}`,
            }}>
              <p><strong>Email:</strong> legal@testimonipro.site</p>
              <p><strong>WhatsApp:</strong> +62 812-XXXX-XXXX</p>
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
            Dengan menggunakan layanan TestimoniPro, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Ketentuan Layanan ini.
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