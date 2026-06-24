import { CourseTopic } from '@/context/GameContext';
import { getTopicProgress, isLessonUnlocked } from '@/lib/dashboard-utils';
import BottomNav, { DashboardTab } from './BottomNav';

interface CourseOutlineDrawerProps {
    isOpen: boolean;
    courses: CourseTopic[];
    completedLessons: string[];
    hearts: number;
    activeTab: DashboardTab;
    onClose: () => void;
    onTabChange: (tab: DashboardTab) => void;
    onLessonSelect: (lessonId: string) => void;
}

export default function CourseOutlineDrawer({
    isOpen,
    courses,
    completedLessons,
    hearts,
    activeTab,
    onClose,
    onTabChange,
    onLessonSelect
}: CourseOutlineDrawerProps) {
    if (!isOpen) return null;

    return (
        <div
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#1E1233',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        >
        <style>{`
            @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
            }
        `}</style>

        {/* Drawer Header Panel */}
        <div
            style={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#1E1233',
            padding: '16px 20px',
            borderBottom: '3px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
            }}
        >
            <h3
            style={{
                fontSize: '22px',
                color: '#FFF',
                fontFamily: 'var(--font-kids-header)'
            }}
            >
            Front-End Developer
            </h3>

            {/* Close Button */}
            <button
            onClick={onClose}
            style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-white)',
                fontSize: '28px',
                cursor: 'pointer',
                padding: '4px'
            }}
            >
            ✕
            </button>
        </div>

        {/* Drawer Scrollable Content List */}
        <div
            style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
            }}
        >
            {courses.map((topic, topicIdx) => {
            const { percent: topicProgress } = getTopicProgress(topic.lessons, completedLessons);

            return (
                <div key={topic.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topic.id === 'topic-5' && (
                    <div
                    style={{
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        fontWeight: 'bold',
                        fontFamily: 'var(--font-kids-header)',
                        marginTop: '10px',
                        textAlign: 'center'
                    }}
                    >
                    Webpages
                    </div>
                )}

                {/* Section card */}
                <div
                    style={{
                    backgroundColor: '#2A1648',
                    borderRadius: '20px',
                    border: '2px solid #3D236E',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    boxShadow: 'var(--shadow-playful)'
                    }}
                >
                    {/* Circle Progress Ring */}
                    <div
                    style={{
                        position: 'relative',
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: `conic-gradient(#00E5FF ${topicProgress * 3.6}deg, #3D236E 0deg)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}
                    >
                    <div
                        style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: '#2A1648',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-kids-header)',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#FFF'
                        }}
                    >
                        {topicProgress}%
                    </div>
                    </div>

                    {/* Section details & Levels */}
                    <div style={{ flex: 1 }}>
                    <h4
                        style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        color: '#FFF',
                        fontFamily: 'var(--font-kids-header)'
                        }}
                    >
                        {topic.title}
                    </h4>

                    {/* Alternating level badge buttons inside section card */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        {topic.lessons.map((lesson, lessonIdx) => {
                        const unlocked = isLessonUnlocked(
                            topicIdx,
                            lessonIdx,
                            courses,
                            completedLessons
                        );

                        return (
                            <button
                            key={lesson.id}
                            disabled={!unlocked || hearts <= 0}
                            onClick={() => onLessonSelect(lesson.id)}
                            style={{
                                border: 'none',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: 700,
                                fontFamily: 'var(--font-kids-header)',
                                backgroundColor: unlocked ? '#7C3AED' : '#3D236E',
                                color: unlocked ? '#FFF' : 'rgba(255,255,255,0.3)',
                                cursor: unlocked ? 'pointer' : 'not-allowed'
                            }}
                            >
                            Lv {lessonIdx + 1}
                            </button>
                        );
                        })}
                    </div>
                    </div>
                </div>
                </div>
            );
            })}
        </div>

        {/* Drawer footer bottom bar to keep consistent look */}
        <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        </div>
    );
}