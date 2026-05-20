'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .login-container {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: radial-gradient(circle at top, #1a2744 0%, #0d1527 100%);
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          background: rgba(26, 39, 68, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 20px;
          padding: 3rem 2.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          text-align: center;
        }
        .login-logo {
          margin-bottom: 2rem;
          display: inline-block;
        }
        .login-logo img {
          max-height: 24px;
          width: auto;
          filter: brightness(0) invert(1);
        }
        .login-title {
          font-family: var(--font-playfair);
          color: var(--white);
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .login-subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.88rem;
          margin-bottom: 2.5rem;
        }
        .login-form {
          text-align: left;
        }
        .login-form label {
          display: block;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .login-form input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(13, 21, 39, 0.6);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          color: var(--white);
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }
        .login-form input:focus {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, var(--gold) 0%, #b8860b 100%);
          border: none;
          border-radius: 8px;
          color: var(--navy);
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .login-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .back-link {
          display: block;
          margin-top: 1.5rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .back-link:hover {
          color: var(--gold);
        }
      `}} />

      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <img src="/assets/images/logo.webp" alt="Fr. Roby CMI Logo" />
          </div>
          <h1 className="login-title">Control Panel</h1>
          <p className="login-subtitle">Sign in to manage initiatives, gallery, events and settings.</p>

          {errorMsg && <div className="login-error">{errorMsg}</div>}

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="admin@frroby.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In →'}
            </button>
          </form>

          <Link href="/" className="back-link">
            ← Return to Website
          </Link>
        </div>
      </div>
    </>
  );
}
