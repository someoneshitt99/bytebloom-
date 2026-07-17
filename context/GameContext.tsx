'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getOrCreateUserProfile,
  syncUserProfile,
  recordLessonCompletion,
  recordBadgeUnlock,
  getCurriculum,
  syncCurriculum
} from '@/app/actions';

// Data types matching our schema
export type ChallengeType = 'THEORY' | 'FILL_IN_BLANK' | 'MULTIPLE_CHOICE' | 'CODE_PUZZLE' | 'SCRATCH_BLOCK';

export interface Challenge {
  id: string;
  lessonId: string;
  type: ChallengeType;
  order: number;
  instructions: string;
  codeTemplate?: string;
  correctAnswer: string;
  choices: string[];
  expectedOutput?: string;
  gridConfig?: GridConfig; 
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  challenges: Challenge[];
}

export interface CourseTopic {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface UserProfile {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  xp: number;
  level: number;
  streak: number;
  coins: number;
  hearts: number;
  lastActive: string;
  completedLessons: string[]; // lessonIds
  unlockedBadges: string[];
}

export interface GridObstacle {
  x: number;
  y: number;
  type: 'stone';
}

export interface GridConfig {
  rows: number;
  cols: number;
  startPosition: { x: number; y: number };
  goalPosition: { x: number; y: number };
  obstacles: GridObstacle[];
}

interface GameContextType {
  user: UserProfile | null;
  courses: CourseTopic[];
  loading: boolean;
  loginUser: (username: string) => void;
  logoutUser: () => void;
  updateAvatar: (avatarUrl: string) => void;
  completeLesson: (lessonId: string, xpGained: number) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  addCoins: (amount: number) => void;
  unlockBadge: (badgeName: string) => void;
  updateCourses: (updatedCourses: CourseTopic[]) => void;
  resetCoursesToDefault: () => void;
}

// Custom Curriculum Seed Data
const MOCK_COURSES: CourseTopic[] = [
  {
    id: 'topic-1',
    title: 'Section 1 Pengenalan Web Development',
    description: 'Belajar dasar-dasar membangun halaman web pertamamu!',
    order: 1,
    lessons: [
      {
        id: 'lesson-1',
        topicId: 'topic-1',
        title: 'Level 1 Introduction',
        description: 'Perkenalan dunia web dan robot Bloomie.',
        order: 1,
        xpReward: 20,
        challenges: [
          {
            id: 't1-l1-c1',
            lessonId: 'lesson-1',
            type: 'THEORY',
            order: 1,
            instructions: 'Hai! Aku Bloomie! Di sini kita akan belajar membuat website keren menggunakan HTML, CSS, dan Javascript. HTML bertugas menyusun tulisan, gambar, dan tombol. Yuk kita coba!',
            choices: [],
            correctAnswer: 'next'
          },
          {
            id: 't1-l1-c2',
            lessonId: 'lesson-1',
            type: 'MULTIPLE_CHOICE',
            order: 2,
            instructions: 'Manakah bahasa utama yang digunakan untuk membuat struktur halaman web?',
            choices: ['HTML', 'CSS', 'JavaScript'],
            correctAnswer: 'HTML'
          },
          {
            id: 't1-l1-c3',
            lessonId: 'lesson-1',
            type: 'CODE_PUZZLE',
            order: 3,
            instructions: 'Bantu Bloomie melangkah ke kanan 2 kali untuk mengambil bintang HTML! Lengkapi blok kode di bawah.',
            codeTemplate: 'bloomie.moveRight();\nbloomie.[BLANK];',
            choices: ['moveRight()', 'moveLeft()', 'jump()'],
            correctAnswer: 'moveRight()',
            expectedOutput: 'right,right'
          }
        ]
      },
      {
        id: 'lesson-2',
        topicId: 'topic-1',
        title: 'Level 2 HTML Dasar',
        description: 'Belajar membuat elemen dasar HTML.',
        order: 2,
        xpReward: 25,
        challenges: [
          {
            id: 't1-l2-c1',
            lessonId: 'lesson-2',
            type: 'FILL_IN_BLANK',
            order: 1,
            instructions: 'Lompati lubang batu lalu berjalan ke kiri! Lengkapi kode di bawah.',
            codeTemplate: 'bloomie.[BLANK]();\nbloomie.[BLANK]();',
            choices: ['jump', 'moveLeft', 'moveRight'],
            correctAnswer: 'jump,moveLeft',
            expectedOutput: 'jump,left'
          }
        ]
      },
      {
        id: 'lesson-3',
        topicId: 'topic-1',
        title: 'Level 3 Tag & Elemen',
        description: 'Belajar tag Heading untuk tulisan besar.',
        order: 3,
        xpReward: 30,
        challenges: [
          {
            id: 't1-l3-c1',
            lessonId: 'lesson-3',
            type: 'THEORY',
            order: 1,
            instructions: 'Tag Heading seperti `<h1>` digunakan untuk membuat judul tulisan menjadi besar dan tebal! Sedangkan tag `<p>` digunakan untuk menulis teks isi cerita biasa.',
            choices: [],
            correctAnswer: 'next'
          },
          {
            id: 't1-l3-c2',
            lessonId: 'lesson-3',
            type: 'MULTIPLE_CHOICE',
            order: 2,
            instructions: 'Tag HTML mana yang kamu gunakan untuk membuat teks menjadi Judul Utama yang sangat besar?',
            choices: ['<h1>', '<p>', '<img>'],
            correctAnswer: '<h1>'
          },
          {
            id: 't1-l3-c3',
            lessonId: 'lesson-3',
            type: 'CODE_PUZZLE',
            order: 3,
            instructions: 'Bantu Bloomie melengkapi tag paragraf di bawah untuk menulis isi cerita! Pilihlah kata yang tepat di bawah.',
            codeTemplate: '<p>Aku suka belajar [BLANK]</p>',
            choices: ['coding', '<h1>', '</html>'],
            correctAnswer: 'coding'
          }
        ]
      },
      {
        id: 'lesson-4',
        topicId: 'topic-1',
        title: 'Level 4 Struktur Halaman',
        description: 'Menyusun elemen halaman web yang rapi.',
        order: 4,
        xpReward: 35,
        challenges: [
          {
            id: 't1-l4-c1',
            lessonId: 'lesson-4',
            type: 'THEORY',
            order: 1,
            instructions: 'Tag pembungkus utama seperti `<main>` sangat berguna untuk menyatukan seluruh judul dan paragraf di dalam satu rumah kontainer yang rapi!',
            choices: [],
            correctAnswer: 'next'
          },
          {
            id: 't1-l4-c2',
            lessonId: 'lesson-4',
            type: 'FILL_IN_BLANK',
            order: 2,
            instructions: 'Bantu Bloomie membungkus judul kita menggunakan tag kontainer utama pembungkus yang benar!',
            codeTemplate: '<[BLANK]>\n  <h1>ByteBloom</h1>\n</[BLANK]>',
            choices: ['main', 'h1', 'p', 'body'],
            correctAnswer: 'main,main'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-2',
    title: 'Section 2 Interactive',
    description: 'Tambahkan logika ajaib JavaScript agar halaman web bisa beraksi!',
    order: 2,
    lessons: [
      { id: 'lesson-5', topicId: 'topic-2', title: 'Lv 1', description: 'Pengenalan aksi klik.', order: 1, xpReward: 20, challenges: [{ id: 't2-l1-c1', lessonId: 'lesson-5', type: 'THEORY', order: 1, instructions: 'Buka petualangan interaktif!', choices: [], correctAnswer: 'next' }] },
      { id: 'lesson-6', topicId: 'topic-2', title: 'Lv 2', description: 'Kotak dialog pesan.', order: 2, xpReward: 20, challenges: [] },
      { id: 'lesson-7', topicId: 'topic-2', title: 'Lv 3', description: 'Animasi ketukan.', order: 3, xpReward: 20, challenges: [] },
      { id: 'lesson-8', topicId: 'topic-2', title: 'Lv 4', description: 'Logika bersyarat.', order: 4, xpReward: 20, challenges: [] }
    ]
  },
  {
    id: 'topic-3',
    title: 'HTML & CSS Sederhana',
    description: 'Hias halaman web pertamamu dengan warna dan gaya yang cerah!',
    order: 3,
    lessons: [
      { id: 'lesson-9', topicId: 'topic-3', title: 'Lv 1', description: 'Mewarnai latar belakang.', order: 1, xpReward: 20, challenges: [{ id: 't3-l1-c1', lessonId: 'lesson-9', type: 'THEORY', order: 1, instructions: 'Belajar CSS dasar!', choices: [], correctAnswer: 'next' }] },
      { id: 'lesson-10', topicId: 'topic-3', title: 'Lv 2', description: 'Gaya huruf.', order: 2, xpReward: 20, challenges: [] },
      { id: 'lesson-11', topicId: 'topic-3', title: 'Lv 3', description: 'Ukuran kotak.', order: 3, xpReward: 20, challenges: [] },
      { id: 'lesson-12', topicId: 'topic-3', title: 'Lv 4', description: 'Border playful.', order: 4, xpReward: 20, challenges: [] }
    ]
  },
  {
    id: 'topic-4',
    title: 'Flexbox',
    description: 'Atur posisi elemen sejajar mendatar atau menurun dengan Flexbox!',
    order: 4,
    lessons: [
      { id: 'lesson-13', topicId: 'topic-4', title: 'Lv 1', description: 'Arah susunan flex.', order: 1, xpReward: 20, challenges: [{ id: 't4-l1-c1', lessonId: 'lesson-13', type: 'THEORY', order: 1, instructions: 'Flexbox dasar!', choices: [], correctAnswer: 'next' }] },
      { id: 'lesson-14', topicId: 'topic-4', title: 'Lv 2', description: 'Perataan tengah.', order: 2, xpReward: 20, challenges: [] },
      { id: 'lesson-15', topicId: 'topic-4', title: 'Lv 3', description: 'Jarak antar elemen.', order: 3, xpReward: 20, challenges: [] },
      { id: 'lesson-16', topicId: 'topic-4', title: 'Lv 4', description: 'Bungkus baris.', order: 4, xpReward: 20, challenges: [] }
    ]
  },
  {
    id: 'topic-5',
    title: 'Grid',
    description: 'Desain layout papan catur ajaib menggunakan CSS Grid!',
    order: 5,
    lessons: [
      { id: 'lesson-17', topicId: 'topic-5', title: 'Lv 1', description: 'Membuat kolom grid.', order: 1, xpReward: 20, challenges: [{ id: 't5-l1-c1', lessonId: 'lesson-17', type: 'THEORY', order: 1, instructions: 'Grid dasar!', choices: [], correctAnswer: 'next' }] },
      { id: 'lesson-18', topicId: 'topic-5', title: 'Lv 2', description: 'Mengatur ukuran baris.', order: 2, xpReward: 20, challenges: [] },
      { id: 'lesson-19', topicId: 'topic-5', title: 'Lv 3', description: 'Menggabungkan kolom.', order: 3, xpReward: 20, challenges: [] },
      { id: 'lesson-20', topicId: 'topic-5', title: 'Lv 4', description: 'Halaman penuh Grid.', order: 4, xpReward: 20, challenges: [] }
    ]
  }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [courses, setCourses] = useState<CourseTopic[]>(MOCK_COURSES);
  const [loading, setLoading] = useState(true);

  // Load user and courses from localStorage & Supabase safely on mount
  useEffect(() => {
    async function loadData() {
      let initialUser: UserProfile | null = null;
      try {
        if (typeof window !== 'undefined') {
          const savedUser = localStorage.getItem('bytebloom_user');
          if (savedUser) {
            initialUser = JSON.parse(savedUser);
            setUser(initialUser);
          }
          const savedCourses = localStorage.getItem('bytebloom_courses');
          if (savedCourses) {
            setCourses(JSON.parse(savedCourses));
          }
        }
      } catch (e) {
        console.error("Gagal memuat profil atau materi dari localStorage:", e);
      }

      // Fetch fresh curriculum from Supabase
      try {
        const dbCurriculum = await getCurriculum();
        if (dbCurriculum) {
          setCourses(dbCurriculum);
          if (typeof window !== 'undefined') {
            localStorage.setItem('bytebloom_courses', JSON.stringify(dbCurriculum));
          }
        }
      } catch (e) {
        console.error("Gagal memuat kurikulum dari Supabase, menggunakan lokal:", e);
      }

      // Fetch fresh user profile progress from Supabase if logged in
      if (initialUser) {
        try {
          const freshUser = await getOrCreateUserProfile(initialUser.username);
          setUser(freshUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('bytebloom_user', JSON.stringify(freshUser));
          }
        } catch (e) {
          console.error("Gagal memuat profil segar dari Supabase, menggunakan lokal:", e);
        }
      }
      setLoading(false);
    }

    loadData();
  }, []);

  // Save user to localStorage safely and sync with Supabase
  const saveUser = (updatedUser: UserProfile | null) => {
    setUser(updatedUser);
    try {
      if (typeof window !== 'undefined') {
        if (updatedUser) {
          localStorage.setItem('bytebloom_user', JSON.stringify(updatedUser));
          // Async sync to Supabase database
          syncUserProfile({
            id: updatedUser.id,
            userId: updatedUser.userId,
            username: updatedUser.username,
            avatarUrl: updatedUser.avatarUrl,
            xp: updatedUser.xp,
            level: updatedUser.level,
            streak: updatedUser.streak,
            coins: updatedUser.coins,
            hearts: updatedUser.hearts,
            lastActive: updatedUser.lastActive,
          });
        } else {
          localStorage.removeItem('bytebloom_user');
        }
      }
    } catch (e) {
      console.error("Gagal menyimpan profil pengguna:", e);
    }
  };

  const loginUser = async (username: string) => {
    setLoading(true);
    try {
      const profile = await getOrCreateUserProfile(username);
      saveUser(profile);
    } catch (e) {
      console.error("Gagal login via Supabase, menggunakan profil lokal:", e);
      const defaultProfile: UserProfile = {
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
      saveUser(defaultProfile);
    }
    setLoading(false);
  };

  const logoutUser = () => {
    saveUser(null);
  };

  const updateAvatar = (avatarUrl: string) => {
    if (!user) return;
    saveUser({
      ...user,
      avatarUrl
    });
  };

  const completeLesson = (lessonId: string, xpGained: number) => {
    if (!user) return;

    const completed = [...user.completedLessons];
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      recordLessonCompletion(user.userId, lessonId);
    }

    const newXp = user.xp + xpGained;
    const newLevel = Math.floor(newXp / 100) + 1;
    const newCoins = user.coins + 15;

    const badges = [...user.unlockedBadges];
    const checkAndUnlockBadge = (badge: string) => {
      if (!badges.includes(badge)) {
        badges.push(badge);
        recordBadgeUnlock(user.userId, badge);
      }
    };

    if (lessonId === 'lesson-1') checkAndUnlockBadge('Langkah Pertama');
    if (lessonId === 'lesson-3') checkAndUnlockBadge('Penyimpan Harta');
    if (lessonId === 'lesson-4') checkAndUnlockBadge('Pesihir Loop');

    saveUser({
      ...user,
      xp: newXp,
      level: newLevel,
      coins: newCoins,
      completedLessons: completed,
      unlockedBadges: badges,
      lastActive: new Date().toISOString()
    });
  };

  const loseHeart = () => {
    if (!user) return;
    saveUser({
      ...user,
      hearts: Math.max(0, user.hearts - 1)
    });
  };

  const refillHearts = () => {
    if (!user) return;
    if (user.coins >= 10) {
      saveUser({
        ...user,
        hearts: 5,
        coins: user.coins - 10
      });
    }
  };

  const addCoins = (amount: number) => {
    if (!user) return;
    saveUser({
      ...user,
      coins: user.coins + amount
    });
  };

  const unlockBadge = (badgeName: string) => {
    if (!user) return;
    const badges = [...user.unlockedBadges];
    if (!badges.includes(badgeName)) {
      badges.push(badgeName);
      recordBadgeUnlock(user.userId, badgeName);
      saveUser({
        ...user,
        unlockedBadges: badges
      });
    }
  };

  const updateCourses = (updatedCourses: CourseTopic[]) => {
    setCourses(updatedCourses);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bytebloom_courses', JSON.stringify(updatedCourses));
      }
      syncCurriculum(updatedCourses);
    } catch (e) {
      console.error("Gagal menyimpan materi ke localStorage/Supabase:", e);
    }
  };

  const resetCoursesToDefault = () => {
    updateCourses(MOCK_COURSES);
  };

  return (
    <GameContext.Provider
      value={{
        user,
        courses,
        loading,
        loginUser,
        logoutUser,
        updateAvatar,
        completeLesson,
        loseHeart,
        refillHearts,
        addCoins,
        unlockBadge,
        updateCourses,
        resetCoursesToDefault
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
