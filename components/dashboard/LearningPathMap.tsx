import { CourseTopic } from '@/context/GameContext';
import {
    generateSvgPath,
    getTopicProgress,
    getZigzagOffset,
    isLessonUnlocked
} from '@/lib/dashboard-utils';
import { useActiveSectionObserver } from '@/lib/useActiveSectionObserver';
import LessonNode from './LessonNode';

interface LearningPathMapProps {
    courses: CourseTopic[];
    completedLessons: string[];
    hearts: number;
    onLessonClick: (lessonId: string) => void;
    onOutOfHearts: () => void;
    onActiveTopicChange: (topicIndex: number) => void;
    }

export default function LearningPathMap({
    courses,
    completedLessons,
    hearts,
    onLessonClick,
    onOutOfHearts,
    onActiveTopicChange
}: LearningPathMapProps) {
    const setSectionRef = useActiveSectionObserver(courses.length, onActiveTopicChange);

    return (
        <div
        style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px 0',
            gap: '40px',
            zIndex: 5
        }}
        >
        {courses.map((topic, topicIdx) => {
            const { percent: topicProgress } = getTopicProgress(topic.lessons, completedLessons);

            return (
            <div
                key={topic.id}
                ref={setSectionRef(topicIdx)}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                {/* Topic Section Divider — garis pembatas sederhana ala Duolingo */}
                <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '0 24px',
                    margin: '20px 0 8px 0'
                }}
                >
                <div
                    style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: topicProgress === 100 ? 'var(--success-light)' : '#3D236E'
                    }}
                />
                <span
                    style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: topicProgress === 100 ? 'var(--success-light)' : 'var(--accent-cyan)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-kids-header)'
                    }}
                >
                    {topic.title}
                    {topicProgress === 100 && ' ✓'}
                </span>
                <div
                    style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: topicProgress === 100 ? 'var(--success-light)' : '#3D236E'
                    }}
                />
                </div>

                {/* Levels list in a zig-zag path */}
                <div
                style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '40px',
                    padding: '24px 0 40px 0'
                }}
                >
                {/* Local SVG path connector for this topic */}
                {topic.lessons.length > 0 && (
                    <svg
                    style={{
                        position: 'absolute',
                        top: '40px',
                        bottom: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '120px',
                        height: 'calc(100% - 80px)',
                        pointerEvents: 'none',
                        zIndex: 1
                    }}
                    >
                    <path
                        d={generateSvgPath(topic.lessons.length)}
                        fill="none"
                        stroke="#3D236E"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="10 8"
                    />
                    <path
                        d={generateSvgPath(topic.lessons.length)}
                        fill="none"
                        stroke={topicProgress === 100 ? 'var(--success-light)' : 'var(--accent-cyan-light)'}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="10 8"
                        opacity="0.6"
                    />
                    </svg>
                )}

                {topic.lessons.map((lesson, lessonIdx) => {
                    const unlocked = isLessonUnlocked(topicIdx, lessonIdx, courses, completedLessons);
                    const completed = completedLessons.includes(lesson.id);
                    const isCurrentActive = unlocked && !completed;
                    const xOffset = getZigzagOffset(lessonIdx);

                    return (
                    <LessonNode
                        key={lesson.id}
                        title={lesson.title}
                        unlocked={unlocked}
                        completed={completed}
                        isCurrentActive={isCurrentActive}
                        xOffset={xOffset}
                        showMascotHint={lessonIdx % 3 === 2}
                        onClick={() => {
                        if (hearts <= 0) {
                            onOutOfHearts();
                            return;
                        }
                        onLessonClick(lesson.id);
                        }}
                    />
                    );
                })}
                </div>
            </div>
            );
        })}
        </div>
    );
}