import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import BusinessProfile from './pages/BusinessProfile';
import SubmitExperience from './pages/SubmitExperience';
import EditProfile from './pages/EditProfile';
import TrustGradePage from './pages/TrustGradePage';
import HowItWorks from './pages/HowItWorks';
import PrivacyPolicy from './pages/PrivacyPolicy';
import HelpCenter from './pages/HelpCenter';
import CookieSettings from './pages/CookieSettings';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import RegisterAccount from './pages/RegisterAccount';
import RegisterBusiness from './pages/RegisterBusiness';
import Login from './pages/Login';
import CookieBanner from './components/ui/CookieBanner';
import { AuthProvider } from './lib/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/index.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/daftar" element={<RegisterAccount />} />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <RegisterBusiness />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/brand/:slug" element={<BusinessProfile />} />
          <Route path="/experience/:slug" element={<SubmitExperience />} />
          <Route path="/settings" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />
          <Route path="/trust-grade" element={<TrustGradePage />} />
          <Route path="/cara-kerja" element={<HowItWorks />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/cookie-settings" element={<CookieSettings />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
        <CookieBanner />
      </BrowserRouter>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}
