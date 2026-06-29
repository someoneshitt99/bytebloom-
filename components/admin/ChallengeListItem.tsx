import { Challenge, ChallengeType } from '@/context/GameContext';

interface ChallengeListItemProps {
    challenge: Challenge;
    onEdit: () => void;
    onDelete: () => void;
}

const TYPE_BADGE_COLOR: Record<ChallengeType, string> = {
    THEORY: 'var(--primary-dark)',
    MULTIPLE_CHOICE: 'var(--accent-orange)',
    FILL_IN_BLANK: 'var(--success)',
    CODE_PUZZLE: 'var(--success)'
};

export default function ChallengeListItem({ challenge, onEdit, onDelete }: ChallengeListItemProps) {
    return (
        <div
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.02)',
            padding: '8px 12px',
            borderRadius: '10px',
            fontSize: '12px'
        }}
        >
        <div>
            <span
            style={{
                backgroundColor: TYPE_BADGE_COLOR[challenge.type],
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '6px',
                marginRight: '6px',
                fontWeight: 'bold'
            }}
            >
            {challenge.type}
            </span>
            <strong>{challenge.order}.</strong> {challenge.instructions.substring(0, 50)}...
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={onEdit} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}>
            ✏️
            </button>
            <button onClick={onDelete} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}>
            ❌
            </button>
        </div>
        </div>
    );
}