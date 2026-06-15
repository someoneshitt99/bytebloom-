'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Bloomie from '@/components/Bloomie';
import { useGame } from '@/context/GameContext';

export default function OnboardingPage() {
  const [slide, setSlide] = useState(0);
  const router = useRouter();
  const { user, loading } = useGame();

  // If user is already logged in, redirect to dashboard automatically!
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const slidesData = [
    {
      title: 'Selamat Datang di ByteBloom!',
      description: 'Hai! Aku Bloomie, robot coding kecilmu. Bersama-sama, kita akan menjelajahi dunia pemrograman komputer yang ajaib dan seru!',
      mascotState: 'wave' as const,
      accent: 'var(--primary-light)'
    },
    {
      title: 'Belajar Sambil Bermain!',
      description: 'Kamu tidak perlu menghafal rumus sulit. Cukup geser dan susun blok kode warna-warni untuk menggerakkan Bloomie mencari harta karun!',
      mascotState: 'think' as const,
      accent: 'var(--accent-cyan)'
    },
    {
      title: 'Kumpulkan Piala & Medali!',
      description: 'Selesaikan tantangan harian, pertahankan rekor belajarmu, dan buka lencana keren untuk ditunjukkan kepada teman-temanmu!',
      mascotState: 'success' as const,
      accent: 'var(--accent-yellow)'
    }
  ];

  const handleNext = () => {
    if (slide < slidesData.length - 1) {
      setSlide(slide + 1);
    } else {
      router.push('/auth');
    }
  };

  const currentSlide = slidesData[slide];

  if (loading || user) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-sky)'
      }}>
        <Bloomie state="think" size={120} />
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Memuat petualangan...</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      padding: '24px',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Playful Glowing Background Blobs */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        backgroundColor: currentSlide.accent,
        opacity: 0.08,
        borderRadius: '50%',
        top: '-50px',
        left: '-50px',
        filter: 'blur(80px)',
        transition: 'background-color 0.5s ease'
      }} />

      {/* Header Logo */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '16px',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '32px',
          color: 'var(--text-white)',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ color: 'var(--accent-cyan)' }}>byte</span>bloom
        </h1>
      </div>

      {/* Mascot Viewport */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        zIndex: 10,
        minHeight: '220px'
      }}>
        <Bloomie state={currentSlide.mascotState} size={220} />
      </div>

      {/* Title & Description Card */}
      <div style={{
        backgroundColor: 'var(--bg-panel)',
        borderRadius: '32px',
        padding: '30px 24px',
        border: '3px solid rgba(255, 255, 255, 0.06)',
        boxShadow: 'var(--shadow-playful)',
        zIndex: 10,
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '24px',
          textAlign: 'center',
          marginBottom: '12px',
          color: 'var(--text-white)',
          lineHeight: '1.2'
        }}>
          {currentSlide.title}
        </h2>
        <p style={{
          fontSize: '15px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          lineHeight: '1.6',
          marginBottom: '24px',
          minHeight: '72px'
        }}>
          {currentSlide.description}
        </p>

        {/* Carousel Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '24px'
        }}>
          {slidesData.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === slide ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: index === slide ? currentSlide.accent : 'rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Interactive Next Button */}
        <button
          onClick={handleNext}
          className="playful-btn playful-btn-primary"
          style={{
            backgroundColor: slide === 2 ? 'var(--success)' : 'var(--primary)',
            boxShadow: slide === 2 ? 'var(--shadow-btn-success)' : 'var(--shadow-btn-primary)'
          }}
        >
          {slide === 2 ? 'Mulai Petualangan!' : 'Lanjut'}
        </button>
      </div>
    </div>
  );
}
