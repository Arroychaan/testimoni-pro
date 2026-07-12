-- ====================================================================
-- TestimoniPro — Database Schema & RLS Policies Migration Script
-- (REVISED: Idempotent - Aman Dijalankan Berulang Kali)
-- ====================================================================

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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tambahkan kolom baru jika belum ada
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS (Hapus yang lama lalu buat ulang)
DROP POLICY IF EXISTS "Public read businesses" ON public.businesses;
CREATE POLICY "Public read businesses" ON public.businesses
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can register business" ON public.businesses;
CREATE POLICY "Anyone can register business" ON public.businesses
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Owners can update business" ON public.businesses;
CREATE POLICY "Owners can update business" ON public.businesses
  FOR UPDATE USING (auth.uid() = user_id);

-- 1.5 Buat Tabel API Keys
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  api_key_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view api_keys" ON public.api_keys;
CREATE POLICY "Anyone can view api_keys" ON public.api_keys
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert api_keys" ON public.api_keys;
CREATE POLICY "Anyone can insert api_keys" ON public.api_keys
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete api_keys" ON public.api_keys;
CREATE POLICY "Anyone can delete api_keys" ON public.api_keys
  FOR DELETE USING (true);


-- 2. Buat Tabel Testimoni (testimonials)
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tambahkan kolom baru
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS verified_token TEXT;

-- Index
CREATE INDEX IF NOT EXISTS idx_testimonials_business ON public.testimonials(business_id);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_testimonials_token ON public.testimonials(verified_token);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published testimonials" ON public.testimonials;
CREATE POLICY "Public read published testimonials" ON public.testimonials
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Anyone can insert testimonials" ON public.testimonials;
CREATE POLICY "Anyone can insert testimonials" ON public.testimonials
  FOR INSERT WITH CHECK (true);


-- 3. Buat Tabel Tokens
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

CREATE INDEX IF NOT EXISTS idx_tokens_business ON public.tokens(business_id);
CREATE INDEX IF NOT EXISTS idx_tokens_token ON public.tokens(token);

ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Business owners can view their tokens" ON public.tokens;
CREATE POLICY "Business owners can view their tokens" ON public.tokens
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Business owners can create tokens" ON public.tokens;
CREATE POLICY "Business owners can create tokens" ON public.tokens
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Business owners can update tokens" ON public.tokens;
CREATE POLICY "Business owners can update tokens" ON public.tokens
  FOR UPDATE USING (true);


-- 4. Buat Tabel Leads
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


-- 5. Storage Buckets (File Uploads)
-- (Pengecekan RLS untuk storage dikelola otomatis oleh Supabase, jadi kita tidak perlu ALTER TABLE)

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