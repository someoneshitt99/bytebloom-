'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';

import StatsBar from '@/components/dashboard/StatsBar';
import ProgressOverviewCard from '@/components/dashboard/ProgressOverviewCard';
import BackgroundDecorations from '@/components/dashboard/BackgroundDecorations';
import LearningPathMap from '@/components/dashboard/LearningPathMap';
import MedalsTab from '@/components/dashboard/MedalsTab';
import ProfileTab from '@/components/dashboard/ProfileTab';
import HeartRefillModal from '@/components/dashboard/HeartRefillModal';
import CourseOutlineDrawer from '@/components/dashboard/CourseOutlineDrawer';
import BottomNav, { DashboardTab } from '@/components/dashboard/BottomNav';

import { getActiveLevelInTopic } from '@/lib/dashboard-utils';

export default function DashboardPage() {
  const { user, courses, refillHearts, loading } = useGame();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<DashboardTab>('learn');
  const [showHeartModal, setShowHeartModal] = useState(false);
  const [showOutlineDrawer, setShowOutlineDrawer] = useState(false);
  const [visibleTopicIndex, setVisibleTopicIndex] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#130a2a'
        }}
      >
        <p style={{ color: 'var(--text-muted)' }}>Memuat peta petualangan...</p>
      </div>
    );
  }

  const totalLessons = courses.reduce((acc, curr) => acc + curr.lessons.length, 0);
  const completedCount = user.completedLessons.length;
  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  // Header dinamis: section + level aktif dari topic yang sedang terlihat
  // di viewport (scroll-spy), bukan level aktif global.
  const visibleTopic = courses[visibleTopicIndex];
  const activeLevelInTopic = visibleTopic
    ? getActiveLevelInTopic(visibleTopic, user.completedLessons)
    : null;
  const sectionLabel = visibleTopic
    ? `Section ${visibleTopic.order}, Level ${activeLevelInTopic?.levelNumber ?? 1}`
    : '';
  const sectionTitle = visibleTopic?.title ?? '';

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    setShowOutlineDrawer(false);
  };

  const handleHeartsRefill = () => {
    if (user.coins >= 10 && user.hearts < 5) {
      refillHearts();
      setShowHeartModal(false);
    }
  };

  const goToLesson = (lessonId: string) => {
    router.push(`/quest/${lessonId}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#1E1233',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Header Indicators Panel — fixed, tidak ikut scroll */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: '#1E1233',
          padding: '16px 16px 10px 16px',
          zIndex: 80,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <StatsBar
          hearts={user.hearts}
          xp={user.xp}
          streak={user.streak}
          coins={user.coins}
          sectionLabel={sectionLabel}
          sectionTitle={sectionTitle}
          onHeartsClick={() => setShowHeartModal(true)}
        />
      </div>

      {/* Scrollable content area — cuma bagian ini yang discroll */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {activeTab === 'learn' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: '24px',
              position: 'relative',
              minHeight: '100%'
            }}
          >
            <BackgroundDecorations />

            <ProgressOverviewCard
              progressPercent={progressPercent}
              completedCount={completedCount}
              totalLessons={totalLessons}
              onOpenOutline={() => setShowOutlineDrawer(true)}
            />

            <LearningPathMap
              courses={courses}
              completedLessons={user.completedLessons}
              hearts={user.hearts}
              onLessonClick={goToLesson}
              onOutOfHearts={() => setShowHeartModal(true)}
              onActiveTopicChange={setVisibleTopicIndex}
            />
          </div>
        )}

        {activeTab === 'medals' && <MedalsTab unlockedBadges={user.unlockedBadges} />}

        {activeTab === 'profile' && (
          <ProfileTab
            username={user.username}
            level={user.level}
            xp={user.xp}
            coins={user.coins}
            streak={user.streak}
          />
        )}
      </div>

      {/* Heart Refill Modal Overlay */}
      <HeartRefillModal
        isOpen={showHeartModal}
        coins={user.coins}
        hearts={user.hearts}
        onRefill={handleHeartsRefill}
        onClose={() => setShowHeartModal(false)}
      />

      {/* Full-Screen Course Outline Drawer */}
      <CourseOutlineDrawer
        isOpen={showOutlineDrawer}
        courses={courses}
        completedLessons={user.completedLessons}
        hearts={user.hearts}
        activeTab={activeTab}
        onClose={() => setShowOutlineDrawer(false)}
        onTabChange={handleTabChange}
        onLessonSelect={(lessonId) => {
          setShowOutlineDrawer(false);
          goToLesson(lessonId);
        }}
      />

      {/* Persistent bottom navigation bar — fixed, tidak ikut scroll */}
      <div style={{ flexShrink: 0 }}>
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}