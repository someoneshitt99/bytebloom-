interface StatsBarProps {
    hearts: number;
    xp: number;
    streak: number;
    coins: number;
    activeLevelTitle: string;
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
    activeLevelTitle,
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

        {/* Active Level Banner */}
        <div
            style={{
            backgroundColor: '#2A1648',
            border: '2px solid #3D236E',
            borderRadius: '12px',
            padding: '10px',
            textAlign: 'center',
            fontFamily: 'var(--font-kids-header)',
            fontSize: '13px',
            fontWeight: 700,
            color: '#FFF',
            letterSpacing: '0.5px',
            boxShadow: 'var(--shadow-playful)'
            }}
        >
            🎯 Level Aktif: {activeLevelTitle}
        </div>
        </div>
    );
}