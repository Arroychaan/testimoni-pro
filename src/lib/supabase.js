import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here') {
  console.warn('⚠️ Supabase URL/Anon Key belum dikonfigurasi.');
}

export const supabase =
  supabaseUrl && supabaseUrl !== 'your_supabase_url_here'
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/* ---- Helper Functions ---- */

export function sanitize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

// Fetch business by slug
export async function getBusinessBySlug(slug) {
  if (!supabase) return { data: null, error: 'Database tidak aktif' };
  
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single();
  return { data, error };
}

// Fetch business by ID
export async function getBusinessById(id) {
  if (!supabase) return { data: null, error: 'Database tidak aktif' };
  
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

// Fetch business by User ID (Auth)
export async function getBusinessByUserId(userId) {
  if (!supabase) return { data: null, error: 'Database tidak aktif' };
  
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
}

// Fetch testimonials for a business
export async function getTestimonials(businessId, { ratingFilter } = {}) {
  if (!supabase) return { data: [], error: 'Database tidak aktif' };

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

// Submit a new testimonial (Atomic via Server-side RPC)
export async function submitTestimonial(testimonial) {
  if (!supabase) return { data: null, error: 'Database tidak aktif' };

  const { data, error } = await supabase.rpc('submit_testimonial_secure', {
    p_business_id: testimonial.business_id,
    p_customer_name: sanitize(testimonial.customer_name),
    p_is_anonymous: Boolean(testimonial.is_anonymous),
    p_rating: Number(testimonial.rating) || 5,
    p_review_text: sanitize(testimonial.review_text || testimonial.content || ''),
    p_photo_urls: testimonial.photo_urls || null,
    p_video_url: testimonial.video_url || null,
    p_verified_token: testimonial.verified_token || null,
    p_customer_whatsapp: testimonial.customer_whatsapp || null
  });

  if (error) return { data: null, error: error.message };
  return { data: { id: data }, error: null };
}

// Update business profile
export async function updateBusiness(businessId, updates) {
  if (!supabase) return { data: null, error: 'Database tidak aktif' };

  const clean = { ...updates };
  if (clean.name) clean.name = sanitize(clean.name);
  if (clean.owner_name) clean.owner_name = sanitize(clean.owner_name);
  if (clean.owner_whatsapp) clean.owner_whatsapp = sanitize(clean.owner_whatsapp);
  if (clean.location) clean.location = sanitize(clean.location);
  if (clean.website) clean.website = sanitize(clean.website);
  if (clean.description) clean.description = sanitize(clean.description);
  if (clean.custom_domain) clean.custom_domain = sanitize(clean.custom_domain);

  const { data, error } = await supabase
    .from('businesses')
    .update(clean)
    .eq('id', businessId)
    .select()
    .single();
  return { data, error };
}

// Register a new business
export async function registerBusiness(business) {
  if (!supabase) return { data: null, error: 'Database tidak aktif' };

  const clean = {
    ...business,
    name: sanitize(business.name),
    owner_name: sanitize(business.owner_name || ''),
    owner_whatsapp: sanitize(business.owner_whatsapp || ''),
    category: sanitize(business.category || ''),
    location: sanitize(business.location || ''),
    website: sanitize(business.website || ''),
    description: sanitize(business.description || ''),
  };

  const { data, error } = await supabase
    .from('businesses')
    .insert([clean])
    .select()
    .single();
  return { data, error };
}

// Submit a lead from landing page
export async function submitLead(lead) {
  if (!supabase) return { data: null, error: 'Database tidak aktif' };

  const clean = {
    name: sanitize(lead.name),
    whatsapp: sanitize(lead.whatsapp),
    business_name: sanitize(lead.business_name || ''),
  };

  const { data, error } = await supabase
    .from('leads')
    .insert([clean])
    .select()
    .single();
  return { data, error };
}

// Upload file to Cloudinary (Primary) or Supabase Storage (Fallback)
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

  // Fallback to Supabase Storage
  if (!supabase) {
    return { data: null, error: 'Database tidak aktif' };
  }

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

// ---- API Keys System (Pro Feature - Server-side RPC) ----

export async function getApiKeys(businessId) {
  if (!supabase) return { data: [], error: 'Database tidak aktif' };
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

export async function generateApiKey(businessId) {
  if (!supabase) return { data: null, error: 'Database tidak aktif' };
  
  const { data, error } = await supabase.rpc('generate_api_key_secure', {
    p_business_id: businessId
  });

  if (error) return { data: null, error: error.message };
  return { data: { business_id: businessId, api_key_hash: data }, error: null, rawKey: data };
}

// Generate slug from business name
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
  if (!supabase) return { data: null, error: 'Database tidak aktif' };

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

// Validate token ONLY
export async function validateToken(tokenValue) {
  if (!tokenValue) return { data: null, error: 'Token tidak boleh kosong' };
  if (!supabase) return { data: null, error: 'Database tidak aktif' };

  const { data: token, error: fetchError } = await supabase
    .from('tokens')
    .select('*')
    .eq('token', tokenValue)
    .single();

  if (fetchError || !token) return { data: null, error: 'Token tidak valid' };
  if (token.is_used) return { data: null, error: 'Token sudah digunakan' };
  
  return { data: token, error: null };
}

// Stub function to prevent import breakage
export async function consumeToken(tokenValue) {
  return { data: { token: tokenValue, is_used: true }, error: null };
}

// Get all tokens for a business
export async function getTokensByBusiness(businessId) {
  if (!supabase) return { data: [], error: 'Database tidak aktif' };

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

// ---- Loyalty Points System (Pro & Verified Feature) ----

export async function claimLoyaltyPoints(businessId, customerName, customerEmail, token) {
  if (!supabase) return { data: null, error: 'Database tidak aktif' };

  const { data, error } = await supabase.rpc('claim_loyalty_points', {
    p_business_id: businessId,
    p_customer_name: customerName.trim(),
    p_customer_email: customerEmail.trim().toLowerCase(),
    p_verified_token: token
  });

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getCustomerLoyaltyList(businessId) {
  if (!supabase) return { data: [], error: 'Database tidak aktif' };

  const { data, error } = await supabase
    .from('customer_loyalty')
    .select('*')
    .eq('business_id', businessId)
    .order('points', { ascending: false });
    
  return { data: data || [], error };
}

export async function deleteTestimonial(id) {
  if (!supabase) return { data: null, error: 'Database tidak aktif' };

  const { data, error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  return { data, error };
}

export async function getRegisteredBusinessCount() {
  if (!supabase) return { count: 0, error: 'Database tidak aktif' };

  const { count, error } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true });

  return { count: count || 0, error };
}