-- ====================================================================
-- TestimoniPro — Database Schema & RLS Policies Migration Script
-- (REVISED: Hardened, production-ready, security-first)
-- ====================================================================

-- Pastikan pgcrypto terpasang untuk generasi kunci kriptografis
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Buat Tabel Bisnis (businesses)
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  owner_name TEXT,
  owner_whatsapp TEXT,
  logo_url TEXT,
  is_pro BOOLEAN DEFAULT FALSE,
  custom_domain TEXT,
  wa_auto_reply_enabled BOOLEAN DEFAULT FALSE,
  wa_auto_reply_template TEXT,
  location TEXT,
  website TEXT,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  trust_score INTEGER DEFAULT 0,
  trust_label TEXT DEFAULT 'Belum ada data',
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotent column check for existing databases
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected'));

-- Index
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS businesses
DROP POLICY IF EXISTS "Public read businesses" ON public.businesses;
CREATE POLICY "Public read businesses" ON public.businesses
  FOR SELECT USING (verification_status = 'approved' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can register business" ON public.businesses;
DROP POLICY IF EXISTS "Owners can register business" ON public.businesses;
CREATE POLICY "Owners can register business" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can update business" ON public.businesses;
CREATE POLICY "Owners can update business" ON public.businesses
  FOR UPDATE USING (auth.uid() = user_id);


-- 2. Buat Tabel API Keys
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  api_key_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS api_keys: hanya pemilik bisnis yang bisa berinteraksi langsung
DROP POLICY IF EXISTS "Anyone can view api_keys" ON public.api_keys;
DROP POLICY IF EXISTS "Owners can view api_keys" ON public.api_keys;
CREATE POLICY "Owners can view api_keys" ON public.api_keys
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = api_keys.business_id AND businesses.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can insert api_keys" ON public.api_keys;
DROP POLICY IF EXISTS "Anyone can delete api_keys" ON public.api_keys;
DROP POLICY IF EXISTS "Owners can delete api_keys" ON public.api_keys;
CREATE POLICY "Owners can delete api_keys" ON public.api_keys
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = api_keys.business_id AND businesses.user_id = auth.uid()
    )
  );


-- 3. Buat Tabel Testimoni (testimonials)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  photo_urls TEXT[],
  video_url TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  verified_token TEXT,
  customer_whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_testimonials_business ON public.testimonials(business_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_token ON public.testimonials(verified_token);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS testimonials
DROP POLICY IF EXISTS "Public read published testimonials" ON public.testimonials;
CREATE POLICY "Public read published testimonials" ON public.testimonials
  FOR SELECT USING (is_published = true);

-- Blokir publik menulis ulasan secara langsung melalui REST API
-- Ulasan hanya boleh dimasukkan secara aman melalui fungsi RPC public.submit_testimonial_secure
DROP POLICY IF EXISTS "Anyone can insert testimonials" ON public.testimonials;

-- Izinkan pemilik bisnis menghapus ulasan dari bisnis milik mereka sendiri
DROP POLICY IF EXISTS "Owners can delete their testimonials" ON public.testimonials;
CREATE POLICY "Owners can delete their testimonials" ON public.testimonials
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = testimonials.business_id AND businesses.user_id = auth.uid()
    )
  );


-- 4. Buat Tabel Tokens
CREATE TABLE IF NOT EXISTS public.tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  product_name TEXT DEFAULT '',
  transaction_ref TEXT DEFAULT '',
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_tokens_business ON public.tokens(business_id);
CREATE INDEX IF NOT EXISTS idx_tokens_token ON public.tokens(token);

ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS tokens
DROP POLICY IF EXISTS "Business owners can view their tokens" ON public.tokens;
DROP POLICY IF EXISTS "Anyone can select tokens for validation" ON public.tokens;
CREATE POLICY "Anyone can select tokens for validation" ON public.tokens
  FOR SELECT USING (true); -- Izinkan select untuk validasi kode token dari client-side

DROP POLICY IF EXISTS "Business owners can create tokens" ON public.tokens;
CREATE POLICY "Business owners can create tokens" ON public.tokens
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = business_id AND businesses.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Business owners can update tokens" ON public.tokens;
CREATE POLICY "Business owners can update tokens" ON public.tokens
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = business_id AND businesses.user_id = auth.uid()
    )
  );


-- 5. Buat Tabel Leads (Kontak Landing Page)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  business_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;
CREATE POLICY "Anyone can submit leads" ON public.leads
  FOR INSERT WITH CHECK (true);


-- ====================================================================
-- SERVER-SIDE FUNCTIONS (SECURITY DEFINER)
-- ====================================================================

-- A. Membuat API Key secara aman di Sisi Server
CREATE OR REPLACE FUNCTION public.generate_api_key_secure(p_business_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_raw_key TEXT;
  v_key_hash TEXT;
  v_is_owner BOOLEAN;
BEGIN
  -- Validasi Parameter
  IF p_business_id IS NULL THEN
    RAISE EXCEPTION 'ID bisnis tidak boleh null';
  END IF;

  -- Periksa kepemilikan bisnis
  SELECT EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE id = p_business_id AND user_id = auth.uid()
  ) INTO v_is_owner;

  IF NOT v_is_owner THEN
    RAISE EXCEPTION 'Unauthorized: Hanya pemilik bisnis yang bisa membuat API Key';
  END IF;

  -- Hasilkan kunci acak kriptografis
  v_raw_key := 'tp_' || encode(gen_random_bytes(16), 'hex') || encode(gen_random_bytes(16), 'hex');
  
  -- SHA256 hashing
  v_key_hash := encode(digest(v_raw_key, 'sha256'), 'hex');

  -- Simpan hash ke database
  INSERT INTO public.api_keys (business_id, api_key_hash)
  VALUES (p_business_id, v_key_hash);

  -- Kembalikan kunci mentah ke client (hanya sekali saat pembuatan)
  RETURN v_raw_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION public.submit_testimonial_secure(
  p_business_id UUID,
  p_customer_name TEXT,
  p_is_anonymous BOOLEAN,
  p_rating INTEGER,
  p_review_text TEXT,
  p_photo_urls TEXT[],
  p_video_url TEXT,
  p_verified_token TEXT,
  p_customer_whatsapp TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_testimonial_id UUID;
  v_token_record RECORD;
BEGIN
  -- Validasi Parameter
  IF p_business_id IS NULL THEN
    RAISE EXCEPTION 'ID bisnis tidak boleh null';
  END IF;

  IF p_customer_name IS NULL OR trim(p_customer_name) = '' THEN
    RAISE EXCEPTION 'Nama pelanggan tidak boleh kosong';
  END IF;
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating harus berupa angka di antara 1 dan 5';
  END IF;

  -- Verifikasi dan pembakaran token (WAJIB disertakan untuk semua testimoni)
  IF p_verified_token IS NULL OR trim(p_verified_token) = '' THEN
    RAISE EXCEPTION 'Token verifikasi transaksi wajib disertakan';
  END IF;

  SELECT * INTO v_token_record FROM public.tokens
  WHERE token = p_verified_token AND business_id = p_business_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Token verifikasi tidak valid';
  END IF;

  IF v_token_record.is_used THEN
    RAISE EXCEPTION 'Token verifikasi sudah pernah digunakan';
  END IF;

  -- Tandai token telah terpakai
  UPDATE public.tokens
  SET is_used = true, used_at = now()
  WHERE token = p_verified_token;

  -- Insert testimoni
  INSERT INTO public.testimonials (
    business_id,
    customer_name,
    is_anonymous,
    rating,
    review_text,
    photo_urls,
    video_url,
    verified_token,
    customer_whatsapp
  ) VALUES (
    p_business_id,
    trim(p_customer_name),
    p_is_anonymous,
    p_rating,
    trim(p_review_text),
    p_photo_urls,
    p_video_url,
    p_verified_token,
    trim(p_customer_whatsapp)
  ) RETURNING id INTO v_testimonial_id;

  RETURN v_testimonial_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ====================================================================
-- AUTOMATIC TRUST GRADE CALCULATION (TRIGGER)
-- ====================================================================

CREATE OR REPLACE FUNCTION public.recalculate_business_trust_score()
RETURNS TRIGGER AS $$
DECLARE
  v_business_id UUID;
  v_total_reviews INTEGER;
  v_avg_rating NUMERIC;
  v_verified_count INTEGER;
  v_rating_score NUMERIC;
  v_volume_score NUMERIC;
  v_verified_bonus NUMERIC;
  v_raw_score INTEGER;
  v_score INTEGER;
  v_label TEXT;
BEGIN
  -- Dapatkan ID Bisnis berdasarkan jenis operasi
  IF TG_OP = 'DELETE' THEN
    v_business_id := OLD.business_id;
  ELSE
    v_business_id := NEW.business_id;
  END IF;

  IF v_business_id IS NOT NULL THEN
    -- Dapatkan agregat testimoni bisnis yang dipublikasikan
    SELECT 
      COUNT(*),
      COALESCE(AVG(rating), 0),
      COUNT(*) FILTER (WHERE verified_token IS NOT NULL AND verified_token <> '')
    INTO 
      v_total_reviews,
      v_avg_rating,
      v_verified_count
    FROM public.testimonials
    WHERE business_id = v_business_id AND is_published = true;

    IF v_total_reviews = 0 THEN
      UPDATE public.businesses
      SET trust_score = 0,
          trust_label = 'Belum ada data'
      WHERE id = v_business_id;
    ELSE
      -- Formula Penilaian Reputasi
      v_rating_score := v_avg_rating * 12;                                            -- maks 60 poin dari rata-rata rating
      v_volume_score := LEAST(v_total_reviews, 50) * 0.2;                             -- maks 10 poin dari volume ulasan
      v_verified_bonus := LEAST(v_verified_count * 0.5, 25);                          -- maks 25 poin bonus ulasan terverifikasi
      v_raw_score := ROUND(30 + v_rating_score + v_volume_score + v_verified_bonus);   -- base 30 + maks 95 = maks 125, dicap di 100
      v_score := GREATEST(0, LEAST(100, v_raw_score));

      -- Tentukan label reputasi
      IF v_score >= 90 THEN v_label := 'Sangat Terpercaya';
      ELSIF v_score >= 75 THEN v_label := 'Terpercaya';
      ELSIF v_score >= 60 THEN v_label := 'Cukup Baik';
      ELSIF v_score >= 40 THEN v_label := 'Perlu Peningkatan';
      ELSE v_label := 'Belum Terverifikasi';
      END IF;

      -- Update data bisnis secara otomatis
      UPDATE public.businesses
      SET trust_score = v_score,
          trust_label = v_label
      WHERE id = v_business_id;
    END IF;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Hubungkan Trigger ke Tabel Testimonials
DROP TRIGGER IF EXISTS trg_recalculate_trust_score ON public.testimonials;
CREATE TRIGGER trg_recalculate_trust_score
AFTER INSERT OR UPDATE OR DELETE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.recalculate_business_trust_score();


-- ====================================================================
-- CUSTOMER LOYALTY POINTS SYSTEM
-- ====================================================================

-- 6. Tabel Poin Loyalitas Pelanggan (customer_loyalty)
CREATE TABLE IF NOT EXISTS public.customer_loyalty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, customer_email)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_customer_loyalty_business ON public.customer_loyalty(business_id);
CREATE INDEX IF NOT EXISTS idx_customer_loyalty_email ON public.customer_loyalty(customer_email);

-- Enable RLS
ALTER TABLE public.customer_loyalty ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS customer_loyalty
DROP POLICY IF EXISTS "Anyone can insert or update loyalty points" ON public.customer_loyalty;
CREATE POLICY "Anyone can insert or update loyalty points" ON public.customer_loyalty
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update loyalty points" ON public.customer_loyalty;
CREATE POLICY "Anyone can update loyalty points" ON public.customer_loyalty
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Owners can view loyalty points" ON public.customer_loyalty;
CREATE POLICY "Owners can view loyalty points" ON public.customer_loyalty
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = customer_loyalty.business_id AND businesses.user_id = auth.uid()
    )
  );

-- C. Fungsi untuk Mengklaim Poin Loyalitas Secara Aman
CREATE OR REPLACE FUNCTION public.claim_loyalty_points(
  p_business_id UUID,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_verified_token TEXT
)
RETURNS VOID AS $$
DECLARE
  v_token_valid BOOLEAN;
BEGIN
  -- Validasi Parameter
  IF p_business_id IS NULL THEN
    RAISE EXCEPTION 'ID bisnis tidak boleh null';
  END IF;

  -- Validasi email
  IF p_customer_email IS NULL OR trim(p_customer_email) = '' THEN
    RAISE EXCEPTION 'Email wajib diisi untuk mengklaim poin';
  END IF;

  -- Verifikasi token telah terpakai dan valid
  SELECT EXISTS (
    SELECT 1 FROM public.tokens
    WHERE token = p_verified_token AND business_id = p_business_id AND is_used = true
  ) INTO v_token_valid;

  IF NOT v_token_valid THEN
    RAISE EXCEPTION 'Token tidak valid atau ulasan belum dikirim';
  END IF;

  -- Simpan/akumulasikan poin
  INSERT INTO public.customer_loyalty (business_id, customer_name, customer_email, points)
  VALUES (p_business_id, trim(p_customer_name), trim(p_customer_email), 50)
  ON CONFLICT (business_id, customer_email) 
  DO UPDATE SET 
    points = public.customer_loyalty.points + 50,
    customer_name = EXCLUDED.customer_name;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ====================================================================
-- STORAGE BUCKETS (FILE UPLOADS CONFIGURATION)
-- ====================================================================

-- 5A. Bucket Logos
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can upload logos" ON storage.objects;
CREATE POLICY "Anyone can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos');

DROP POLICY IF EXISTS "Public read logos" ON storage.objects;
CREATE POLICY "Public read logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

-- 5B. Bucket Testimonials
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can upload testimonials media" ON storage.objects;
CREATE POLICY "Anyone can upload testimonials media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'testimonials');

DROP POLICY IF EXISTS "Public read testimonials media" ON storage.objects;
CREATE POLICY "Public read testimonials media" ON storage.objects
  FOR SELECT USING (bucket_id = 'testimonials');