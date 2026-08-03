import React from 'react';
import { Compass, X } from 'lucide-react';
import { Footer } from './Footer';

interface AuthModalProps {
  isModal?: boolean;
  isSignUp: boolean;
  email: string;
  password: string;
  displayName: string;
  errorMsg: string;
  onToggleSignUp: () => void;
  onEmailChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onDisplayNameChange: (val: string) => void;
  onAuthSubmit: (e: React.FormEvent) => void;
  onGoogleSignIn: () => void;
  onCloseModal?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isModal = false,
  isSignUp,
  email,
  password,
  displayName,
  errorMsg,
  onToggleSignUp,
  onEmailChange,
  onPasswordChange,
  onDisplayNameChange,
  onAuthSubmit,
  onGoogleSignIn,
  onCloseModal
}) => {
  if (isModal) {
    return (
      <div className="scandi-modal-overlay">
        <div className="scandi-modal-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.5rem' }}>{isSignUp ? 'Create Explorer Account' : 'Welcome Back'}</h3>
            {onCloseModal && (
              <button onClick={onCloseModal} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            )}
          </div>

          {errorMsg && (
            <div style={{ backgroundColor: '#FDF2F2', color: '#D9534F', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={onAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isSignUp && (
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '6px' }}>
                  Your Name
                </label>
                <input 
                  type="text" 
                  className="scandi-input" 
                  placeholder="e.g. Astrid Lindgren" 
                  value={displayName} 
                  onChange={(e) => onDisplayNameChange(e.target.value)} 
                  required 
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '6px' }}>
                Email Address
              </label>
              <input 
                type="email" 
                className="scandi-input" 
                placeholder="you@domain.com" 
                value={email} 
                onChange={(e) => onEmailChange(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <input 
                type="password" 
                className="scandi-input" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => onPasswordChange(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="scandi-btn" style={{ justifyContent: 'center', width: '100%', marginTop: '8px' }}>
              {isSignUp ? 'Register Account' : 'Sign In'}
            </button>

            <button type="button" onClick={onGoogleSignIn} className="scandi-btn-secondary" style={{ justifyContent: 'center', width: '100%' }}>
              Continue with Google
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button 
              onClick={onToggleSignUp} 
              style={{ background: 'none', border: 'none', color: 'var(--accent-sage)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full Screen Auth View
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="scandi-card" style={{ maxWidth: '440px', width: '100%', padding: '36px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--accent-sage-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Compass size={32} style={{ color: 'var(--accent-sage)' }} />
          </div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-text)', marginBottom: '6px' }}>Wayfarer Hub</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
            {isSignUp ? 'Create an account to start planning journeys' : 'Sign in to access your trip itineraries'}
          </p>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#FDF2F2', color: '#D9534F', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', border: '1px solid #F5C6CB' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={onAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isSignUp && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Your Name</label>
              <input 
                type="text" 
                className="scandi-input" 
                placeholder="e.g. Astrid Lindgren" 
                value={displayName} 
                onChange={(e) => onDisplayNameChange(e.target.value)} 
                required
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Email Address</label>
            <input 
              type="email" 
              className="scandi-input" 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => onEmailChange(e.target.value)} 
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '4px' }}>Password</label>
            <input 
              type="password" 
              className="scandi-input" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => onPasswordChange(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="scandi-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--border-color)' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          <span style={{ padding: '0 12px', fontSize: '0.75rem', color: 'var(--secondary-text)' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
        </div>

        <button 
          type="button" 
          onClick={onGoogleSignIn} 
          className="scandi-btn-secondary" 
          style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button 
            type="button"
            onClick={onToggleSignUp} 
            style={{ background: 'none', border: 'none', color: 'var(--accent-sage)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            {isSignUp ? 'Sign In' : 'Create One'}
          </button>
        </div>
      </div>

      <Footer style={{ marginTop: '24px' }} />
    </div>
  );
};

export default AuthModal;
