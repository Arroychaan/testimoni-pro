import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here') {
  console.warn(
    '⚠️ Supabase belum dikonfigurasi. Menggunakan penyimpanan lokal (localStorage) untuk simulasi real-time.'
  );
}

export const supabase =
  supabaseUrl && supabaseUrl !== 'your_supabase_url_here'
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Initialize localStorage arrays if they don't exist
if (!localStorage.getItem('tp_businesses')) {
  localStorage.setItem('tp_businesses', JSON.stringify([]));
}
if (!localStorage.getItem('tp_testimonials')) {
  localStorage.setItem('tp_testimonials', JSON.stringify([]));
}
if (!localStorage.getItem('tp_leads')) {
  localStorage.setItem('tp_leads', JSON.stringify([]));
}
if (!localStorage.getItem('tp_tokens')) {
  localStorage.setItem('tp_tokens', JSON.stringify([]));
}

/* ---- Helper Functions ---- */

// ✅ K7: sanitize input dasar (trim + escape dasar)
function sanitize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.trim();
}

// ✅ K5: simple hash untuk API key (tidak menyimpan plain text)
async function hashApiKey(key) {
  // Gunakan SubtleCrypto jika tersedia, fallback ke btoa sederhana
  if (window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
  // Fallback: encode sederhana
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'hash_' + Math.abs(hash).toString(16);
}

// Fetch business by slug
export async function getBusinessBySlug(slug) {
  if (!supabase) {
    const businesses = JSON.parse(localStorage.getItem('tp_businesses') || '[]');
    const biz = businesses.find((b) => b.slug === slug);
    if (!biz) return { data: null, error: 'Bisnis tidak ditemukan' };
    return { data: biz, error: null };
  }
  
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single();
  return { data, error };
}

// Fetch business by ID
export async function getBusinessById(id) {
  if (!supabase) {
    const businesses = JSON.parse(localStorage.getItem('tp_businesses') || '[]');
    const biz = businesses.find((b) => b.id === id);
    if (!biz) return { data: null, error: 'Bisnis tidak ditemukan' };
    return { data: biz, error: null };
  }
  
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

// Fetch business by User ID (Auth)
export async function getBusinessByUserId(userId) {
  if (!supabase) return { data: null, error: 'Simulasi' };
  
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
}

// Fetch testimonials for a business
export async function getTestimonials(businessId, { ratingFilter } = {}) {
  if (!supabase) {
    let testimonials = JSON.parse(localStorage.getItem('tp_testimonials') || '[]');
    let filtered = testimonials.filter(
      (t) => t.business_id === businessId && t.is_published !== false
    );
    
    if (ratingFilter && ratingFilter > 0) {
      filtered = filtered.filter((t) => t.rating === ratingFilter);
    }
    
    // Sort by created_at descending
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { data: filtered, error: null };
  }

  let query = supabase
    .from('testimonials')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (ratingFilter && ratingFilter > 0) {
    query = query.eq('rating', ratingFilter);
  }

  const { data, error } = await query;
  return { data: data || [], error };
}

// Submit a new testimonial
// ✅ FIX 1B: payload hanya berisi kolom yang ada di schema
export async function submitTestimonial(testimonial) {
  // Sanitize inputs
  const clean = {
    business_id: testimonial.business_id,
    customer_name: sanitize(testimonial.customer_name),
    is_anonymous: Boolean(testimonial.is_anonymous),
    rating: Number(testimonial.rating) || 5,
    review_text: sanitize(testimonial.review_text || testimonial.content || ''),
    photo_urls: testimonial.photo_urls || null,
    video_url: testimonial.video_url || null,
    verified_token: testimonial.verified_token || null,
    is_published: true,
  };

  if (!supabase) {
    const testimonials = JSON.parse(localStorage.getItem('tp_testimonials') || '[]');
    const newTestimonial = {
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      ...clean,
    };
    testimonials.push(newTestimonial);
    localStorage.setItem('tp_testimonials', JSON.stringify(testimonials));
    return { data: newTestimonial, error: null };
  }

  const { data, error } = await supabase
    .from('testimonials')
    .insert([clean])
    .select()
    .single();
  return { data, error };
}

// Update business profile
// ✅ FIX 1A: sekarang location, website, description sudah ada di schema
export async function updateBusiness(businessId, updates) {
  // Sanitize string fields
  const clean = { ...updates };
  if (clean.name) clean.name = sanitize(clean.name);
  if (clean.owner_name) clean.owner_name = sanitize(clean.owner_name);
  if (clean.owner_whatsapp) clean.owner_whatsapp = sanitize(clean.owner_whatsapp);
  if (clean.location) clean.location = sanitize(clean.location);
  if (clean.website) clean.website = sanitize(clean.website);
  if (clean.description) clean.description = sanitize(clean.description);
  if (clean.custom_domain) clean.custom_domain = sanitize(clean.custom_domain);

  if (!supabase) {
    const businesses = JSON.parse(localStorage.getItem('tp_businesses') || '[]');
    const idx = businesses.findIndex((b) => b.id === businessId);
    if (idx === -1) return { data: null, error: 'Bisnis tidak ditemukan' };

    businesses[idx] = {
      ...businesses[idx],
      ...clean,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem('tp_businesses', JSON.stringify(businesses));

    // Update session storage too
    const cached = sessionStorage.getItem('tp_current_business');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.id === businessId) {
        sessionStorage.setItem('tp_current_business', JSON.stringify(businesses[idx]));
      }
    }

    return { data: businesses[idx], error: null };
  }

  const { data, error } = await supabase
    .from('businesses')
    .update(clean)
    .eq('id', businessId)
    .select()
    .single();
  return { data, error };
}

// Register a new business
// ✅ K6: tambah field location, website, description
export async function registerBusiness(business) {
  if (!supabase) {
    const businesses = JSON.parse(localStorage.getItem('tp_businesses') || '[]');
    
    // ✅ FIX 2H: cek keunikan slug dengan suffix angka
    let finalSlug = business.slug;
    let counter = 1;
    while (businesses.some((b) => b.slug === finalSlug)) {
      finalSlug = `${business.slug}-${counter}`;
      counter++;
    }

    const newBusiness = {
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      ...business,
      slug: finalSlug,
      name: sanitize(business.name),
      owner_name: sanitize(business.owner_name || ''),
      owner_whatsapp: sanitize(business.owner_whatsapp || ''),
      category: sanitize(business.category || ''),
      location: sanitize(business.location || ''),
      website: sanitize(business.website || ''),
      description: sanitize(business.description || ''),
    };
    businesses.push(newBusiness);
    localStorage.setItem('tp_businesses', JSON.stringify(businesses));
    return { data: newBusiness, error: null };
  }

  const { data, error } = await supabase
    .from('businesses')
    .insert([business])
    .select()
    .single();
  return { data, error };
}

// Submit a lead from landing page
export async function submitLead(lead) {
  if (!supabase) {
    const leads = JSON.parse(localStorage.getItem('tp_leads') || '[]');
    const newLead = {
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      ...lead,
      name: sanitize(lead.name),
      whatsapp: sanitize(lead.whatsapp),
      business_name: sanitize(lead.business_name || ''),
    };
    leads.push(newLead);
    localStorage.setItem('tp_leads', JSON.stringify(leads));
    return { data: newLead, error: null };
  }

  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single();
  return { data, error };
}

// Upload file to Cloudinary (Primary) or Supabase Storage (Fallback)
// ✅ FIX 1D: gunakan bucket 'testimonial-media' untuk testimoni, 'logos' untuk logo
export async function uploadFile(bucket, path, file) {
  const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (cloudinaryCloudName && cloudinaryUploadPreset) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryUploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Cloudinary upload failed');
      const data = await res.json();
      return { data: data.secure_url, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  // Fallback to Supabase
  if (!supabase) {
    // Generate a local object URL that is valid for the current browser session
    const objectUrl = URL.createObjectURL(file);
    return { data: objectUrl, error: null };
  }

  // Map bucket name: 'testimonials' -> 'testimonial-media', 'logos' -> 'logos'
  const actualBucket = bucket === 'testimonials' ? 'testimonial-media' : bucket;

  const { data, error } = await supabase.storage
    .from(actualBucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
  if (error) return { data: null, error };
  const { data: urlData } = supabase.storage.from(actualBucket).getPublicUrl(path);
  return { data: urlData.publicUrl, error: null };
}

// ---- API Keys System (Pro Feature) ----

export async function getApiKeys(businessId) {
  if (!supabase) {
    const keys = JSON.parse(localStorage.getItem('tp_api_keys') || '[]');
    const bizKeys = keys.filter((k) => k.business_id === businessId);
    return { data: bizKeys, error: null };
  }
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

export async function generateApiKey(businessId) {
  const rawKey = 'tp_' + Math.random().toString(36).substr(2, 15) + Math.random().toString(36).substr(2, 15);
  
  // ✅ FIX K5: hash the key before storing
  const keyHash = await hashApiKey(rawKey);
  
  if (!supabase) {
    const keys = JSON.parse(localStorage.getItem('tp_api_keys') || '[]');
    const newKey = {
      id: Math.random().toString(36).substr(2, 9),
      business_id: businessId,
      api_key_hash: keyHash,
      created_at: new Date().toISOString(),
    };
    keys.push(newKey);
    localStorage.setItem('tp_api_keys', JSON.stringify(keys));
    return { data: { ...newKey, api_key_hash: keyHash }, error: null, rawKey };
  }

  const { data, error } = await supabase
    .from('api_keys')
    .insert([{ business_id: businessId, api_key_hash: keyHash }])
    .select()
    .single();
  return { data, error, rawKey };
}

// Generate slug from business name
// ✅ FIX 2H: slug generator (collision handling dilakukan di registerBusiness)
export function generateSlug(name) {
  if (!name) return '';
  return sanitize(name)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'bisnis';
}

// ---- Token System (1-to-1 Unique Transaction Tokens) ----

// Generate a short unique token
export function generateToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'TP-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create a new token for a business
export async function createToken(businessId, { productName, transactionRef } = {}) {
  if (!supabase) {
    const tokens = JSON.parse(localStorage.getItem('tp_tokens') || '[]');
    const newToken = {
      id: Math.random().toString(36).substr(2, 9),
      business_id: businessId,
      token: generateToken(),
      product_name: sanitize(productName || ''),
      transaction_ref: sanitize(transactionRef || ''),
      is_used: false,
      created_at: new Date().toISOString(),
    };
    tokens.push(newToken);
    localStorage.setItem('tp_tokens', JSON.stringify(tokens));
    return { data: newToken, error: null };
  }

  const { data, error } = await supabase
    .from('tokens')
    .insert([{
      business_id: businessId,
      token: generateToken(),
      product_name: sanitize(productName || ''),
      transaction_ref: sanitize(transactionRef || ''),
      is_used: false,
    }])
    .select()
    .single();
  return { data, error };
}

// ✅ FIX 2E: Validate token ONLY (DOES NOT consume/hangus token)
// Token hanya dicek validitasnya — tidak di-update is_used
export async function validateToken(tokenValue) {
  if (!tokenValue) return { data: null, error: 'Token tidak boleh kosong' };

  if (!supabase) {
    const tokens = JSON.parse(localStorage.getItem('tp_tokens') || '[]');
    const token = tokens.find((t) => t.token === tokenValue);
    if (!token) return { data: null, error: 'Token tidak valid' };
    if (token.is_used) return { data: null, error: 'Token sudah digunakan' };
    // ✅ TIDAK meng-hanguskan token di sini — hanya validasi
    return { data: token, error: null };
  }

  const { data: token, error: fetchError } = await supabase
    .from('tokens')
    .select('*')
    .eq('token', tokenValue)
    .single();

  if (fetchError || !token) return { data: null, error: 'Token tidak valid' };
  if (token.is_used) return { data: null, error: 'Token sudah digunakan' };
  
  // ✅ TIDAK meng-update is_used — hanya mengembalikan data token
  return { data: token, error: null };
}

// ✅ FIX 2E: Consume/hangus token (dipanggil SETELAH submit testimoni sukses)
export async function consumeToken(tokenValue) {
  if (!tokenValue) return { data: null, error: 'Token tidak boleh kosong' };

  if (!supabase) {
    const tokens = JSON.parse(localStorage.getItem('tp_tokens') || '[]');
    const token = tokens.find((t) => t.token === tokenValue);
    if (!token) return { data: null, error: 'Token tidak valid' };
    if (token.is_used) return { data: null, error: 'Token sudah digunakan' };

    token.is_used = true;
    token.used_at = new Date().toISOString();
    localStorage.setItem('tp_tokens', JSON.stringify(tokens));
    return { data: token, error: null };
  }

  const { error: updateError } = await supabase
    .from('tokens')
    .update({ is_used: true, used_at: new Date().toISOString() })
    .eq('token', tokenValue)
    .eq('is_used', false);

  if (updateError) return { data: null, error: updateError.message };
  return { data: { token: tokenValue, is_used: true }, error: null };
}

// Get all tokens for a business
export async function getTokensByBusiness(businessId) {
  if (!supabase) {
    const tokens = JSON.parse(localStorage.getItem('tp_tokens') || '[]');
    const bizTokens = tokens
      .filter((t) => t.business_id === businessId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { data: bizTokens, error: null };
  }

  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

// Calculate stats from testimonials array
export function calculateStats(testimonials) {
  if (!testimonials || testimonials.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      totalPhotos: 0,
      totalVideos: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const totalReviews = testimonials.length;
  const sumRating = testimonials.reduce((sum, t) => sum + (t.rating || 0), 0);
  const averageRating = totalReviews > 0 ? parseFloat((sumRating / totalReviews).toFixed(1)) : 0;
  
  const totalPhotos = testimonials.reduce(
    (sum, t) => sum + (t.photo_urls ? t.photo_urls.length : 0),
    0
  );
  
  const totalVideos = testimonials.filter((t) => t.video_url).length;
  
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  testimonials.forEach((t) => {
    const r = t.rating || 0;
    if (ratingDistribution[r] !== undefined) {
      ratingDistribution[r] = (ratingDistribution[r] || 0) + 1;
    }
  });

  return { totalReviews, averageRating, totalPhotos, totalVideos, ratingDistribution };
}