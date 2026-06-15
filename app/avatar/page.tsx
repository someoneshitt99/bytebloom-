'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Bloomie from '@/components/Bloomie';
import { useGame } from '@/context/GameContext';

export default function AvatarPage() {
  const [selected, setSelected] = useState('mascot_wave');
  const { user, updateAvatar } = useGame();
  const router = useRouter();

  const avatars = [
    { id: 'mascot_wave', name: 'Bloomie Klasik', state: 'wave' as const, color: '#A78BFA' },
    { id: 'mascot_think', name: 'Bloomie Cerdas', state: 'think' as const, color: '#06B6D4' },
    { id: 'mascot_success', name: 'Bloomie Ceria', state: 'success' as const, color: '#F59E0B' },
    { id: 'mascot_neutral', name: 'Bloomie Gamer', state: 'neutral' as const, color: '#10B981' }
  ];

  const handleSave = () => {
    updateAvatar(selected);
    router.push('/dashboard');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '24px',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* Header Title */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <h2 style={{
          fontSize: '26px',
          color: 'var(--text-white)'
        }}>
          Pilih Teman Belajarmu!
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          marginTop: '6px'
        }}>
          Pilih variasi Bloomie yang paling cocok menemanimu menulis kode!
        </p>
      </div>

      {/* Grid of Avatars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        margin: '30px 0',
        flex: 1,
        alignContent: 'center'
      }}>
        {avatars.map((avatar) => {
          const isSelected = selected === avatar.id;
          return (
            <div
              key={avatar.id}
              onClick={() => setSelected(avatar.id)}
              style={{
                backgroundColor: 'var(--bg-panel)',
                border: isSelected ? `4px solid ${avatar.color}` : '3px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: isSelected ? `0 0 20px ${avatar.color}33, var(--shadow-playful)` : 'var(--shadow-playful)',
                transform: isSelected ? 'scale(1.05)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              }}
            >
              <div style={{ height: '110px', display: 'flex', alignItems: 'center' }}>
                <Bloomie state={avatar.state} size={100} />
              </div>
              <span style={{
                fontFamily: 'var(--font-kids-header)',
                fontSize: '14px',
                fontWeight: 700,
                color: isSelected ? 'var(--text-white)' : 'var(--text-muted)',
                marginTop: '12px'
              }}>
                {avatar.name}
              </span>
              
              {/* Checkmark Indicator */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  backgroundColor: avatar.color,
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid var(--bg-sky)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Continue Action */}
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={handleSave}
          className="playful-btn playful-btn-primary"
        >
          Masuk ke Dashboard
        </button>
      </div>
    </div>
  );
}
