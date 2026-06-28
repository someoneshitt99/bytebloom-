interface StatsBarProps {
    hearts: number;
    xp: number;
    streak: number;
    coins: number;
    sectionLabel: string; // contoh: "Section 1, Level 1"
    sectionTitle: string; // contoh: "Section 1 Pengenalan Web Development"
    onHeartsClick: () => void;
}

// Satu kotak stat kecil (dipakai untuk Hearts, XP, Streak, Coins)
function StatBox({
    icon,
    value,
    onClick
}: {
    icon: string;
    value: string;
    onClick?: () => void;
}) {
    return (
        <div
        onClick={onClick}
        style={{
            backgroundColor: '#2A1648',
            borderRadius: '12px',
            border: '2px solid #3D236E',
            padding: '8px 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: 'var(--font-kids-header)',
            cursor: onClick ? 'pointer' : 'default',
            boxShadow: 'var(--shadow-playful)',
            transition: 'transform 0.1s'
        }}
        >
        <span>{icon}</span>
        <span style={{ color: '#FFF' }}>{value}</span>
        </div>
    );
}

export default function StatsBar({
    hearts,
    xp,
    streak,
    coins,
    sectionLabel,
    sectionTitle,
    onHeartsClick
    }: StatsBarProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Game Stats Containers Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            <StatBox icon="❤️" value={`${hearts}`} onClick={onHeartsClick} />
            <StatBox icon="💎" value={`${xp} XP`} />
            <StatBox icon="🔥" value={`${streak} Hari`} />
            <StatBox icon="🪙" value={`${coins}`} />
        </div>

        {/* Active Section/Level Banner — berubah dinamis sesuai scroll-spy */}
        <div
            style={{
            backgroundColor: '#2A1648',
            border: '2px solid #3D236E',
            borderRadius: '12px',
            padding: '10px 14px',
            fontFamily: 'var(--font-kids-header)',
            boxShadow: 'var(--shadow-playful)'
            }}
        >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            {sectionLabel}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF', marginTop: '2px' }}>
            {sectionTitle}
            </div>
        </div>
        </div>
    );
}