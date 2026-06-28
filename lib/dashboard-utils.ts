import { CourseTopic, Lesson } from '@/context/GameContext';

export function generateSvgPath(lessonsCount: number): string {
    if (lessonsCount <= 1) return 'M 60,10 L 60,10';

    let path = '';
    for (let i = 0; i < lessonsCount; i++) {
        const x = 60 + Math.sin(i * 1.5) * 45;
        const y = 30 + i * 110;

        if (i === 0) {
        path += `M ${x},${y}`;
        continue;
        }

        const prevX = 60 + Math.sin((i - 1) * 1.5) * 45;
        const prevY = 30 + (i - 1) * 110;
        const cpY = (prevY + y) / 2;
        path += ` C ${prevX},${cpY} ${x},${cpY} ${x},${y}`;
    }

    return path;
}

export function isLessonUnlocked(
    topicIndex: number,
    lessonIndex: number,
    courses: CourseTopic[],
    completedLessons: string[]
): boolean {
    if (topicIndex === 0 && lessonIndex === 0) return true;

    if (lessonIndex > 0) {
        const prevLesson = courses[topicIndex].lessons[lessonIndex - 1];
        return completedLessons.includes(prevLesson.id);
    }

    if (topicIndex > 0) {
        const prevTopic = courses[topicIndex - 1];
        const lastLessonOfPrevTopic = prevTopic.lessons[prevTopic.lessons.length - 1];
        return completedLessons.includes(lastLessonOfPrevTopic.id);
    }

    return false;
}

export function getActiveLevelTitle(
    courses: CourseTopic[],
    completedLessons: string[]
): string {
    for (const topic of courses) {
        for (const lesson of topic.lessons) {
        if (!completedLessons.includes(lesson.id)) {
            return lesson.title;
        }
        }
    }
    return 'Semua Misi Selesai! 🎉';
}

export interface TopicProgress {
    completedInTopic: number;
    totalInTopic: number;
    percent: number;
}

export function getTopicProgress(
    lessons: Lesson[],
    completedLessons: string[]
): TopicProgress {
    const totalInTopic = lessons.length;
    const completedInTopic = lessons.filter((lesson) =>
        completedLessons.includes(lesson.id)
    ).length;
    const percent =
        totalInTopic > 0 ? Math.round((completedInTopic / totalInTopic) * 100) : 0;

    return { completedInTopic, totalInTopic, percent };
}

export function getZigzagOffset(lessonIndex: number): number {
  return Math.sin(lessonIndex * 1.5) * 45;
}

export interface ActiveLevelInTopic {
    title: string;
    levelNumber: number; // urutan ke-berapa (1-indexed) dalam topic ini
}

export function getActiveLevelInTopic(
    topic: CourseTopic,
    completedLessons: string[]
): ActiveLevelInTopic | null {
    if (topic.lessons.length === 0) return null;

    for (let i = 0; i < topic.lessons.length; i++) {
        if (!completedLessons.includes(topic.lessons[i].id)) {
        return { title: topic.lessons[i].title, levelNumber: i + 1 };
        }
    }

    const lastIndex = topic.lessons.length - 1;
    return { title: topic.lessons[lastIndex].title, levelNumber: lastIndex + 1 };
}