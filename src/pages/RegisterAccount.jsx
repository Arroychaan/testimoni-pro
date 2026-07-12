import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GoogleLogin } from '@react-oauth/google';
import Button from '../components/ui/Button';

export default function RegisterAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Email dan Password wajib diisi.');
    
    setLoading(true);
    setError('');

    if (!supabase) {
      setError('Mode simulasi (tanpa Supabase) aktif. Pendaftaran tidak didukung.');
      setLoading(false);
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Success, move to onboarding
    navigate('/onboarding');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!supabase) {
      setError('Mode simulasi (tanpa Supabase) aktif. Login tidak didukung.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: credentialResponse.credential,
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate('/onboarding');
  };

  const handleGoogleError = () => {
    setError('Pendaftaran Google dibatalkan atau gagal.');
  };

  const bg = 'var(--color-bg)';
  const text = 'var(--color-text)';
  const textSec = 'var(--color-text-secondary)';
  const textMut = 'var(--color-text-muted)';
  const border = 'var(--color-border)';
  const primary = 'var(--color-primary)';

  const inputStyle = {
    width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
    border: `1px solid ${border}`, backgroundColor: bg, color: text,
    marginBottom: '1rem', outline: 'none'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: bg, color: text, padding: '1.5rem', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: 'var(--color-bg-elevated)', padding: '2rem', borderRadius: '1rem', border: `1px solid ${border}`, boxShadow: 'var(--shadow-md)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem' }}>Buat Akun Anda</h1>
        <p style={{ color: textSec, textAlign: 'center', fontSize: '0.875rem', marginBottom: '2rem' }}>Daftar sekarang untuk mulai mengumpulkan testimoni.</p>
        
        {error && <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text="signup_with"
            shape="rectangular"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: border }}></div>
          <span style={{ padding: '0 1rem', color: textMut, fontSize: '0.875rem' }}>Atau buat dengan email</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: border }}></div>
        </div>

        <form onSubmit={handleRegister}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email</label>
          <input type="email" style={inputStyle} placeholder="email@bisnisanda.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Password</label>
          <input type="password" style={inputStyle} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />

          <Button fullWidth loading={loading} onClick={handleRegister}>
            Daftar Sekarang
          </Button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1.5rem', color: textSec }}>
          Sudah punya akun? <Link to="/login" style={{ color: primary, fontWeight: 600, textDecoration: 'none' }}>Login di sini</Link>
        </p>
      </div>
    </div>
  );
}
