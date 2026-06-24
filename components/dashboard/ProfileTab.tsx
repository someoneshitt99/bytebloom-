interface ProfileTabProps {
    username: string;
    level: number;
    xp: number;
    coins: number;
    streak: number;
}

export default function ProfileTab({ username, level, xp, coins, streak }: ProfileTabProps) {
    return (
        <div
        style={{
            flex: 1,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            paddingBottom: '100px',
            zIndex: 10
        }}
        >
        {/* Profile Card */}
        <div
            style={{
            backgroundColor: '#2A1648',
            border: '3px solid #3D236E',
            borderRadius: '24px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-playful)'
            }}
        >
            <div
            style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                margin: '0 auto 16px auto',
                border: '4px solid #fff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            >
            {username.charAt(0).toUpperCase()}
            </div>
            <h2>{username}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Petualang Tingkat {level}</p>

            <div
            style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: '20px',
                backgroundColor: '#1E1233',
                borderRadius: '16px',
                padding: '16px'
            }}
            >
            <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{xp}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total XP</div>
            </div>
            <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-yellow)' }}>{coins}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Koin</div>
            </div>
            <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-orange)' }}>{streak} Hari</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Streak</div>
            </div>
            </div>
        </div>
        </div>
    );
}