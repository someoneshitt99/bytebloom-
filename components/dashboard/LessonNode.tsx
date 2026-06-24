import Bloomie from '@/components/Bloomie';

interface LessonNodeProps {
    title: string;
    unlocked: boolean;
    completed: boolean;
    isCurrentActive: boolean;
    xOffset: number;
    showMascotHint: boolean; // mascot dekorasi untuk node non-aktif (every 3rd lesson)
    onClick: () => void;
}

export default function LessonNode({
    title,
    unlocked,
    completed,
    isCurrentActive,
    xOffset,
    showMascotHint,
    onClick
    }: LessonNodeProps) {
    return (
        <div
        style={{
            transform: `translateX(${xOffset}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
            position: 'relative'
        }}
        >
        {/* Speech bubble above active level node */}
        {isCurrentActive && (
            <div
            className="bounce-slow"
            style={{
                position: 'absolute',
                top: '-45px',
                backgroundColor: 'var(--primary)',
                border: '2px solid #FFF',
                borderRadius: '12px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#FFF',
                whiteSpace: 'nowrap',
                zIndex: 20,
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                fontFamily: 'var(--font-kids-header)'
            }}
            >
            AYO MAIN! 🚀
            {/* Small triangle arrow at bottom of speech bubble */}
            <div
                style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderWidth: '8px 8px 0',
                borderStyle: 'solid',
                borderColor: 'var(--primary) transparent',
                width: 0,
                height: 0
                }}
            />
            {/* Extra white border tip */}
            <div
                style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderWidth: '9px 9px 0',
                borderStyle: 'solid',
                borderColor: '#FFF transparent',
                width: 0,
                height: 0,
                zIndex: -1
                }}
            />
            </div>
        )}

        {/* Level Button Node */}
        <button
            disabled={!unlocked}
            onClick={onClick}
            style={{
            width: isCurrentActive ? '78px' : '68px',
            height: isCurrentActive ? '78px' : '68px',
            borderRadius: '50%',
            background: completed
                ? 'linear-gradient(135deg, var(--success) 0%, #059669 100%)'
                : isCurrentActive
                ? 'linear-gradient(135deg, var(--primary) 0%, #ec4899 100%)'
                : 'linear-gradient(135deg, #2A1648 0%, #1d0f33 100%)',
            border: isCurrentActive
                ? '3px dashed #FFF'
                : completed
                ? '3px solid var(--success-light)'
                : '3px solid #3D236E',
            cursor: unlocked ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isCurrentActive
                ? '0 8px 0 #5b21b6, 0 0 20px rgba(124, 58, 237, 0.6)'
                : completed
                ? '0 6px 0 #047857'
                : '0 6px 0 #130a2a',
            transition: 'transform 0.1s, box-shadow 0.1s',
            position: 'relative'
            }}
            className={isCurrentActive ? 'glow-pulse' : ''}
        >
            {completed ? (
            <span style={{ fontSize: '24px', color: '#FFF' }}>⭐</span>
            ) : isCurrentActive ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFF">
                <polygon points="8,5 19,12 8,19" />
            </svg>
            ) : (
            <span style={{ fontSize: '20px' }}>🔒</span>
            )}
        </button>

        {/* Level label under node */}
        <div
            style={{
            marginTop: '8px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: isCurrentActive ? 'var(--primary-light)' : completed ? 'var(--success-light)' : 'var(--text-muted)',
            fontFamily: 'var(--font-kids-header)',
            textAlign: 'center',
            maxWidth: '120px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
            }}
        >
            {title.replace('Level ', 'Lv ')}
        </div>

        {/* Mascot next to active level node */}
        {isCurrentActive && (
            <div
            style={{
                position: 'absolute',
                left: xOffset > 0 ? '-85px' : '85px',
                top: '-5px',
                zIndex: 5,
                pointerEvents: 'none'
            }}
            >
            <Bloomie state="wave" size={68} />
            </div>
        )}

        {/* Mascot decoration for non-active milestone nodes */}
        {!isCurrentActive && showMascotHint && (
            <div
            style={{
                position: 'absolute',
                left: xOffset > 0 ? '-85px' : '85px',
                top: '-5px',
                zIndex: 5,
                pointerEvents: 'none',
                opacity: 0.7
            }}
            >
            <Bloomie state={completed ? 'success' : 'think'} size={60} />
            </div>
        )}
        </div>
    );
}