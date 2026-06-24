interface HeartRefillModalProps {
    isOpen: boolean;
    coins: number;
    hearts: number;
    onRefill: () => void;
    onClose: () => void;
}

export default function HeartRefillModal({
    isOpen,
    coins,
    hearts,
    onRefill,
    onClose
}: HeartRefillModalProps) {
    if (!isOpen) return null;

    const canRefill = coins >= 10 && hearts < 5;

    return (
        <div
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(14, 5, 32, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 1000
        }}
        >
        <div
            style={{
            backgroundColor: '#2A1648',
            border: '4px solid var(--primary)',
            borderRadius: '32px',
            padding: '30px 24px',
            maxWidth: '360px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}
        >
            <span style={{ fontSize: '64px', display: 'block', marginBottom: '12px' }}>❤️</span>
            <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>Isi Ulang Nyawa</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
            Kehabisan nyawa? Kamu bisa memulihkan nyawamu menjadi 5 penuh seharga <strong>10 Koin 🪙</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
                disabled={!canRefill}
                onClick={onRefill}
                className={`playful-btn ${canRefill ? 'playful-btn-success' : 'playful-btn-disabled'}`}
            >
                Isi Penuh (10 Koin)
            </button>
            <button onClick={onClose} className="playful-btn playful-btn-muted">
                Kembali
            </button>
            </div>
        </div>
        </div>
    );
}