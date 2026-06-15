'use server';

import { prisma } from '@/lib/prisma';
import { CourseTopic, UserProfile, Lesson, Challenge } from '@/context/GameContext';

// 1. Get or Create User Profile
export async function getOrCreateUserProfile(username: string): Promise<UserProfile> {
  try {
    const dbProfile = await prisma.userProfile.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
      include: { progress: true, achievements: true },
    });

    if (dbProfile) {
      return {
        id: dbProfile.id,
        userId: dbProfile.userId,
        username: dbProfile.username,
        avatarUrl: dbProfile.avatarUrl,
        xp: dbProfile.xp,
        level: dbProfile.level,
        streak: dbProfile.streak,
        coins: dbProfile.coins,
        hearts: dbProfile.hearts,
        lastActive: dbProfile.lastActive.toISOString(),
        completedLessons: dbProfile.progress.map((p: any) => p.lessonId),
        unlockedBadges: dbProfile.achievements.map((a: any) => a.badgeName),
      };
    }

    // Create new profile if not found
    const newProfile = await prisma.userProfile.create({
      data: {
        userId: `user-${Date.now()}`,
        username,
        avatarUrl: 'mascot_wave',
        xp: 0,
        level: 1,
        streak: 1,
        coins: 20,
        hearts: 5,
        achievements: {
          create: { badgeName: 'Pelaut Pemula' }
        }
      },
      include: { achievements: true }
    });

    return {
      id: newProfile.id,
      userId: newProfile.userId,
      username: newProfile.username,
      avatarUrl: newProfile.avatarUrl,
      xp: newProfile.xp,
      level: newProfile.level,
      streak: newProfile.streak,
      coins: newProfile.coins,
      hearts: newProfile.hearts,
      lastActive: newProfile.lastActive.toISOString(),
      completedLessons: [],
      unlockedBadges: ['Pelaut Pemula'],
    };
  } catch (e) {
    console.error("Gagal mendapatkan atau membuat profil di Supabase:", e);
    // Fallback profile if database is unreachable
    return {
      id: 'local-profile-id',
      userId: 'local-user-id',
      username,
      avatarUrl: 'mascot_wave',
      xp: 0,
      level: 1,
      streak: 1,
      coins: 20,
      hearts: 5,
      lastActive: new Date().toISOString(),
      completedLessons: [],
      unlockedBadges: ['Pelaut Pemula']
    };
  }
}

// 2. Sync User Profile State
export async function syncUserProfile(profile: Omit<UserProfile, 'completedLessons' | 'unlockedBadges'>) {
  try {
    await prisma.userProfile.update({
      where: { userId: profile.userId },
      data: {
        avatarUrl: profile.avatarUrl,
        xp: profile.xp,
        level: profile.level,
        streak: profile.streak,
        coins: profile.coins,
        hearts: profile.hearts,
        lastActive: new Date(profile.lastActive),
      },
    });
  } catch (e) {
    console.error("Gagal sinkronisasi profil ke Supabase:", e);
  }
}

// 3. Complete Lesson progress
export async function recordLessonCompletion(userId: string, lessonId: string) {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId }
    });
    if (!profile) return;

    await prisma.userProgress.upsert({
      where: {
        profileId_lessonId: {
          profileId: profile.id,
          lessonId
        }
      },
      create: {
        profileId: profile.id,
        lessonId
      },
      update: {}
    });
  } catch (e) {
    console.error("Gagal menyimpan progres bab ke Supabase:", e);
  }
}

// 4. Record Badge Unlocked
export async function recordBadgeUnlock(userId: string, badgeName: string) {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId }
    });
    if (!profile) return;

    const existing = await prisma.userBadge.findFirst({
      where: {
        profileId: profile.id,
        badgeName
      }
    });

    if (!existing) {
      await prisma.userBadge.create({
        data: {
          profileId: profile.id,
          badgeName
        }
      });
    }
  } catch (e) {
    console.error("Gagal menyimpan lencana ke Supabase:", e);
  }
}

// 5. Get Course Curriculum
export async function getCurriculum(): Promise<CourseTopic[] | null> {
  try {
    const dbTopics = await prisma.courseTopic.findMany({
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            challenges: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    if (dbTopics.length === 0) return null;

    return dbTopics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      order: topic.order,
      lessons: topic.lessons.map((lesson) => ({
        id: lesson.id,
        topicId: lesson.topicId,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        xpReward: lesson.xpReward,
        challenges: lesson.challenges.map((c) => ({
          id: c.id,
          lessonId: c.lessonId,
          type: c.type,
          order: c.order,
          instructions: c.instructions,
          codeTemplate: c.codeTemplate || undefined,
          correctAnswer: c.correctAnswer,
          choices: c.choices,
          expectedOutput: c.expectedOutput || undefined,
        }))
      }))
    }));
  } catch (e) {
    console.error("Gagal mengambil kurikulum dari Supabase:", e);
    return null;
  }
}

// 6. Save/Sync Course Curriculum
export async function syncCurriculum(topics: CourseTopic[]) {
  try {
    await prisma.$transaction(async (tx) => {
      // Delete existing
      await tx.challenge.deleteMany();
      await tx.lesson.deleteMany();
      await tx.courseTopic.deleteMany();

      // Create topics, lessons, and challenges
      for (const topic of topics) {
        await tx.courseTopic.create({
          data: {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            order: topic.order,
            lessons: {
              create: topic.lessons.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                description: lesson.description,
                order: lesson.order,
                xpReward: lesson.xpReward,
                challenges: {
                  create: lesson.challenges.map((c) => ({
                    id: c.id,
                    type: c.type,
                    order: c.order,
                    instructions: c.instructions,
                    codeTemplate: c.codeTemplate || null,
                    correctAnswer: c.correctAnswer,
                    choices: c.choices,
                    expectedOutput: c.expectedOutput || null,
                  }))
                }
              }))
            }
          }
        });
      }
    }, {
      maxWait: 20000,
      timeout: 60000
    });
  } catch (e) {
    console.error("Gagal menyimpan sinkronisasi kurikulum ke Supabase:", e);
  }
}
