'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Bloomie from '@/components/Bloomie';
import { useGame } from '@/context/GameContext';

type AuthTab = 'login' | 'register' | 'quick';

export default function AuthPage() {
  const [tab, setTab] = useState<AuthTab>('quick');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { loginUser } = useGame();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (tab === 'quick') {
      if (!username.trim()) {
        setErrorMsg('Masukkan nama panggilanmu dulu ya!');
        return;
      }
      loginUser(username.trim());
      router.push('/avatar');
    } else if (tab === 'register') {
      if (!email.trim() || !password.trim() || !username.trim()) {
        setErrorMsg('Lengkapi seluruh data di atas ya!');
        return;
      }
      // Simulate/register supabase-backed local user
      loginUser(username.trim());
      router.push('/avatar');
    } else {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Masukkan email dan sandimu ya!');
        return;
      }
      // Simulate login
      loginUser('Pahlawan Cilik');
      router.push('/dashboard');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '24px',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Top Banner Mascot */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <Bloomie state={tab === 'quick' ? 'wave' : 'think'} size={140} />
        <h2 style={{
          fontSize: '24px',
          marginTop: '12px',
          textAlign: 'center',
          color: 'var(--text-white)'
        }}>
          {tab === 'quick' ? 'Siapa Namamu?' : 'Gerbang Petualang!'}
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          marginTop: '4px'
        }}>
          {tab === 'quick' 
            ? 'Buat nama panggilan serumu untuk mulai bermain langsung!' 
            : 'Simpan skormu ke database Supabase agar tidak hilang.'}
        </p>
      </div>

      {/* Auth Tab Selectors */}
      <div style={{
        display: 'flex',
        backgroundColor: 'var(--bg-panel)',
        borderRadius: '16px',
        padding: '6px',
        marginBottom: '20px',
        border: '2px solid rgba(255, 255, 255, 0.05)'
      }}>
        <button
          onClick={() => { setTab('quick'); setErrorMsg(''); }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            border: 'none',
            fontFamily: 'var(--font-kids-header)',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: tab === 'quick' ? 'var(--primary)' : 'transparent',
            color: tab === 'quick' ? 'var(--text-white)' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
        >
          Main Cepat
        </button>
        <button
          onClick={() => { setTab('login'); setErrorMsg(''); }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            border: 'none',
            fontFamily: 'var(--font-kids-header)',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: tab === 'login' ? 'var(--primary)' : 'transparent',
            color: tab === 'login' ? 'var(--text-white)' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
        >
          Masuk
        </button>
        <button
          onClick={() => { setTab('register'); setErrorMsg(''); }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            border: 'none',
            fontFamily: 'var(--font-kids-header)',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: tab === 'register' ? 'var(--primary)' : 'transparent',
            color: tab === 'register' ? 'var(--text-white)' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
        >
          Daftar
        </button>
      </div>

      {/* Main Interactive Form Card */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'var(--bg-panel)',
          borderRadius: '24px',
          padding: '24px',
          border: '3px solid rgba(255, 255, 255, 0.06)',
          boxShadow: 'var(--shadow-playful)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {errorMsg && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '2px solid var(--error)',
            borderRadius: '12px',
            padding: '10px 14px',
            color: 'var(--error-light)',
            fontSize: '14px',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        {/* Dynamic Inputs based on active tab */}
        {tab === 'quick' && (
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginBottom: '6px',
              fontFamily: 'var(--font-kids-header)'
            }}>
              Nama Panggilan Codingmu:
            </label>
            <input
              type="text"
              placeholder="Contoh: KsatriaByte, CodingStar..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '16px',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'var(--bg-deep)',
                color: 'var(--text-white)',
                fontSize: '16px',
                fontFamily: 'var(--font-kids-body)',
                outline: 'none'
              }}
            />
          </div>
        )}

        {tab === 'register' && (
          <>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginBottom: '6px',
                fontFamily: 'var(--font-kids-header)'
              }}>
                Nama Panggilan:
              </label>
              <input
                type="text"
                placeholder="Contoh: BloomieLover"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'var(--bg-deep)',
                  color: 'var(--text-white)',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginBottom: '6px',
                fontFamily: 'var(--font-kids-header)'
              }}>
                Email Orangtua:
              </label>
              <input
                type="email"
                placeholder="anak@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'var(--bg-deep)',
                  color: 'var(--text-white)',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginBottom: '6px',
                fontFamily: 'var(--font-kids-header)'
              }}>
                Sandi Rahasia:
              </label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'var(--bg-deep)',
                  color: 'var(--text-white)',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
          </>
        )}

        {tab === 'login' && (
          <>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginBottom: '6px',
                fontFamily: 'var(--font-kids-header)'
              }}>
                Email:
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'var(--bg-deep)',
                  color: 'var(--text-white)',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginBottom: '6px',
                fontFamily: 'var(--font-kids-header)'
              }}>
                Sandi:
              </label>
              <input
                type="password"
                placeholder="Masukkan sandi rahasiamu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'var(--bg-deep)',
                  color: 'var(--text-white)',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="playful-btn playful-btn-primary"
          style={{ marginTop: '8px' }}
        >
          {tab === 'quick' ? 'Mulai Main!' : tab === 'register' ? 'Bikin Akun!' : 'Masuk!'}
        </button>
      </form>
    </div>
  );
}
