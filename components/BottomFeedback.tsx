import React from 'react';
import Bloomie from './Bloomie';

interface BottomFeedbackProps {
  isVisible: boolean;
  isCorrect: boolean;
  message?: string;
  onContinue: () => void;
  onRetry?: () => void;
}

export default function BottomFeedback({
  isVisible,
  isCorrect,
  message = '',
  onContinue,
  onRetry
}: BottomFeedbackProps) {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: isCorrect ? '#064e3b' : '#450a0a',
        borderTop: `6px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        padding: '24px',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.6)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Bloomie state={isCorrect ? 'success' : 'error'} size={80} />
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-kids-header)',
              fontSize: '22px',
              color: isCorrect ? '#34d399' : '#f87171',
              marginBottom: '4px'
            }}
          >
            {isCorrect ? 'Hebat Sekali!' : 'Coba Lagi!'}
          </h3>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-white)',
              opacity: 0.9
            }}
          >
            {message || (isCorrect
              ? 'Jawabanmu tepat! Bloomie berhasil melangkah!'
              : 'Ada bagian kode yang belum pas. Coba cek lagi ya!')}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {isCorrect ? (
          <button
            onClick={onContinue}
            className="playful-btn playful-btn-success"
            style={{ flex: 1 }}
          >
            Lanjut
          </button>
        ) : (
          <>
            {onRetry && (
              <button
                onClick={onRetry}
                className="playful-btn playful-btn-muted"
                style={{ flex: 1 }}
              >
                Ulangi
              </button>
            )}
            <button
              onClick={onContinue}
              className="playful-btn playful-btn-error"
              style={{ flex: 2 }}
            >
              Lewati / Lanjut
            </button>
          </>
        )}
      </div>
    </div>
  );
}
