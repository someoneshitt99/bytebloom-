export default function GamificationSettingsCard() {
    return (
        <div className="playful-card" style={{ backgroundColor: 'var(--bg-panel)' }}>
        <h3 style={{ fontSize: '18px', color: '#FFF', marginBottom: '12px' }}>⭐ Aturan Gamifikasi Game</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
            Seluruh aturan gamifikasi sudah diprogram untuk berjalan otomatis. Pengguna mendapatkan{' '}
            <strong>XP</strong> saat menyelesaikan level pelajaran, bonus <strong>15 Koin</strong>, serta
            memulihkan nyawa penuh seharga <strong>10 Koin</strong> di dashboard.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
            <div
            style={{
                backgroundColor: 'var(--bg-deep)',
                borderRadius: '12px',
                padding: '12px',
                flex: 1,
                border: '1px solid rgba(255,255,255,0.05)'
            }}
            >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>BONUS Koin Penyelesaian</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-yellow)', marginTop: '4px' }}>
                🪙 15 Koin
            </div>
            </div>
            <div
            style={{
                backgroundColor: 'var(--bg-deep)',
                borderRadius: '12px',
                padding: '12px',
                flex: 1,
                border: '1px solid rgba(255,255,255,0.05)'
            }}
            >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Harga Isi Ulang Nyawa</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--error-light)', marginTop: '4px' }}>
                🪙 10 Koin
            </div>
            </div>
        </div>
        </div>
    );
}