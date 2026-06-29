import { Lesson } from '@/context/GameContext';
import ChallengeListItem from './ChallengeListItem';

interface LessonAccordionItemProps {
    lesson: Lesson;
    onEditLesson: () => void;
    onDeleteLesson: () => void;
    onAddChallenge: () => void;
    onEditChallenge: (challengeId: string) => void;
    onDeleteChallenge: (challengeId: string) => void;
}

export default function LessonAccordionItem({
    lesson,
    onEditLesson,
    onDeleteLesson,
    onAddChallenge,
    onEditChallenge,
    onDeleteChallenge
}: LessonAccordionItemProps) {
    return (
        <div
        style={{
            backgroundColor: 'var(--bg-deep)',
            borderRadius: '16px',
            padding: '14px',
            border: '1px solid rgba(255, 255, 255, 0.04)'
        }}
        >
        {/* Lesson title & order */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
            Level {lesson.order}: {lesson.title}{' '}
            <span style={{ color: 'var(--accent-yellow)', fontSize: '11px' }}>(💎 {lesson.xpReward} XP)</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={onEditLesson} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' }}>
                ✏️
            </button>
            <button onClick={onDeleteLesson} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' }}>
                ❌
            </button>
            </div>
        </div>

        {/* Challenges Inside Lesson */}
        <div style={{ paddingLeft: '12px', borderLeft: '2px dashed rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                🧩 Soal Tantangan:
            </span>
            <button
                onClick={onAddChallenge}
                style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--text-muted)',
                borderRadius: '6px',
                padding: '2px 8px',
                fontSize: '10px',
                cursor: 'pointer'
                }}
            >
                ➕ Tambah Soal
            </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {lesson.challenges.map((challenge) => (
                <ChallengeListItem
                key={challenge.id}
                challenge={challenge}
                onEdit={() => onEditChallenge(challenge.id)}
                onDelete={() => onDeleteChallenge(challenge.id)}
                />
            ))}
            {lesson.challenges.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontStyle: 'italic', padding: '4px' }}>
                Belum ada soal dibuat. Klik "Tambah Soal" untuk membuat teka-teki baru.
                </div>
            )}
            </div>
        </div>
        </div>
    );
}