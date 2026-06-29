import { CourseTopic } from '@/context/GameContext';
import LessonAccordionItem from './LessonAccordionItem';

interface TopicAccordionItemProps {
    topic: CourseTopic;
    onEditTopic: () => void;
    onDeleteTopic: () => void;
    onAddLesson: () => void;
    onEditLesson: (lessonId: string) => void;
    onDeleteLesson: (lessonId: string) => void;
    onAddChallenge: (lessonId: string) => void;
    onEditChallenge: (lessonId: string, challengeId: string) => void;
    onDeleteChallenge: (lessonId: string, challengeId: string) => void;
}

export default function TopicAccordionItem({
    topic,
    onEditTopic,
    onDeleteTopic,
    onAddLesson,
    onEditLesson,
    onDeleteLesson,
    onAddChallenge,
    onEditChallenge,
    onDeleteChallenge
    }: TopicAccordionItemProps) {
    return (
        <div
        style={{
            backgroundColor: 'var(--bg-panel)',
            border: '2px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: 'var(--shadow-playful)'
        }}
        >
        {/* Topic Header Row */}
        <div
            style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid rgba(255,255,255,0.04)',
            paddingBottom: '12px',
            marginBottom: '16px'
            }}
        >
            <div>
            <h4 style={{ fontSize: '18px', color: 'var(--accent-cyan)' }}>
                Section {topic.order}: {topic.title}
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {topic.description}
            </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
            <button
                onClick={onEditTopic}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}
                title="Edit Bab"
            >
                ✏️
            </button>
            <button
                onClick={onDeleteTopic}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}
                title="Hapus Bab"
            >
                ❌
            </button>
            </div>
        </div>

        {/* Lessons (Levels) Inside This Topic */}
        <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h5 style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                🪜 Level Di Dalam Bab Ini:
            </h5>
            <button
                onClick={onAddLesson}
                style={{
                background: 'none',
                border: '1px solid var(--accent-cyan)',
                borderRadius: '8px',
                color: 'var(--accent-cyan)',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer'
                }}
            >
                ➕ Tambah Level (Lesson)
            </button>
            </div>

            {topic.lessons.map((lesson) => (
            <LessonAccordionItem
                key={lesson.id}
                lesson={lesson}
                onEditLesson={() => onEditLesson(lesson.id)}
                onDeleteLesson={() => onDeleteLesson(lesson.id)}
                onAddChallenge={() => onAddChallenge(lesson.id)}
                onEditChallenge={(challengeId) => onEditChallenge(lesson.id, challengeId)}
                onDeleteChallenge={(challengeId) => onDeleteChallenge(lesson.id, challengeId)}
            />
            ))}
            {topic.lessons.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
                Bab ini kosong. Silakan tambah Level Pelajaran.
            </p>
            )}
        </div>
        </div>
    );
}