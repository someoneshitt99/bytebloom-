interface Decoration {
    char: string;
    top: string;
    left?: string;
    right?: string;
    color: string;
    size: string;
    angle: string;
}

const DECORATIONS: Decoration[] = [
    { char: '<div>', top: '8%', left: '8%', color: '#ff79c6', size: '14px', angle: '-15deg' },
    { char: '{}', top: '18%', right: '10%', color: '#8be9fd', size: '20px', angle: '25deg' },
    { char: 'CSS', top: '30%', left: '12%', color: '#fbbf24', size: '16px', angle: '12deg' },
    { char: 'JS', top: '44%', right: '8%', color: '#10b981', size: '18px', angle: '-20deg' },
    { char: '<html>', top: '56%', left: '6%', color: '#f97316', size: '15px', angle: '30deg' },
    { char: '</>', top: '70%', right: '12%', color: '#a78bfa', size: '18px', angle: '-10deg' },
    { char: '🚀', top: '82%', left: '10%', color: '#fff', size: '20px', angle: '0deg' },
    { char: '🎨', top: '92%', right: '8%', color: '#fbbf24', size: '16px', angle: '15deg' }
];

export default function BackgroundDecorations() {
    return (
        <>
        {DECORATIONS.map((dec, idx) => (
            <div
            key={idx}
            className="float-anim"
            style={{
                position: 'absolute',
                top: dec.top,
                left: dec.left,
                right: dec.right,
                color: dec.color,
                fontSize: dec.size,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                opacity: 0.15,
                transform: `rotate(${dec.angle})`,
                pointerEvents: 'none',
                zIndex: 0,
                animationDelay: `${idx * 0.4}s`
            }}
            >
            {dec.char}
            </div>
        ))}
        </>
    );
}