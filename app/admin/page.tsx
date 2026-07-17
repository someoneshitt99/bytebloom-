'use client';

import React, { useState } from 'react';
import { useGame, CourseTopic, Lesson, Challenge, ChallengeType } from '@/context/GameContext';
import Link from 'next/link';

import AdminTabs, { AdminTab } from '@/components/admin/AdminTabs';
import AdminMetricsGrid from '@/components/admin/AdminMetricsGrid';
import GamificationSettingsCard from '@/components/admin/GamificationSettingsCard';
import ResetCurriculumCard from '@/components/admin/ResetCurriculumCard';
import TopicAccordionItem from '@/components/admin/TopicAccordionItem';
import TopicFormModal from '@/components/admin/TopicFormModal';
import LessonFormModal from '@/components/admin/LessonFormModal';
import ChallengeFormModal from '@/components/admin/ChallengeFormModal';

export default function AdminPage() {
  const { courses, updateCourses, resetCoursesToDefault } = useGame();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(null);

  const [topicForm, setTopicForm] = useState({ title: '', description: '', order: 1 });
  const [lessonForm, setLessonForm] = useState({ topicId: '', title: '', description: '', order: 1, xpReward: 20 });
  const [challengeForm, setChallengeForm] = useState({
    lessonId: '',
    type: 'THEORY' as ChallengeType,
    order: 1,
    instructions: '',
    codeTemplate: '',
    correctAnswer: '',
    choices: ''
  });

  const totalTopics = courses.length;
  const totalLessons = courses.reduce((acc, curr) => acc + curr.lessons.length, 0);
  const totalChallenges = courses.reduce(
    (acc, topic) => acc + topic.lessons.reduce((lAcc, l) => lAcc + l.challenges.length, 0),
    0
  );

  const handleSaveTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicForm.title.trim()) return;

    let updated: CourseTopic[];
    if (editingTopicId === 'new') {
      const newTopic: CourseTopic = {
        id: `topic-${Date.now()}`,
        title: topicForm.title.trim(),
        description: topicForm.description.trim(),
        order: Number(topicForm.order),
        lessons: []
      };
      updated = [...courses, newTopic];
    } else {
      updated = courses.map((t) =>
        t.id === editingTopicId
          ? { ...t, title: topicForm.title.trim(), description: topicForm.description.trim(), order: Number(topicForm.order) }
          : t
      );
    }

    updated.sort((a, b) => a.order - b.order);
    updateCourses(updated);
    setEditingTopicId(null);
  };

  const handleDeleteTopic = (id: string) => {
    if (!confirm('Apakah kamu yakin ingin menghapus Bab ini beserta seluruh Level dan Soal di dalamnya?')) return;
    const updated = courses.filter((t) => t.id !== id);
    updateCourses(updated);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title.trim() || !lessonForm.topicId) return;

    const updated = courses.map((topic) => {
      if (topic.id !== lessonForm.topicId) return topic;

      let updatedLessons: Lesson[];
      if (editingLessonId === 'new') {
        const newLesson: Lesson = {
          id: `lesson-${Date.now()}`,
          topicId: topic.id,
          title: lessonForm.title.trim(),
          description: lessonForm.description.trim(),
          order: Number(lessonForm.order),
          xpReward: Number(lessonForm.xpReward),
          challenges: []
        };
        updatedLessons = [...topic.lessons, newLesson];
      } else {
        updatedLessons = topic.lessons.map((l) =>
          l.id === editingLessonId
            ? { ...l, title: lessonForm.title.trim(), description: lessonForm.description.trim(), order: Number(lessonForm.order), xpReward: Number(lessonForm.xpReward) }
            : l
        );
      }

      updatedLessons.sort((a, b) => a.order - b.order);
      return { ...topic, lessons: updatedLessons };
    });

    updateCourses(updated);
    setEditingLessonId(null);
  };

  const handleDeleteLesson = (topicId: string, id: string) => {
    if (!confirm('Apakah kamu yakin ingin menghapus Level ini beserta seluruh soal di dalamnya?')) return;
    const updated = courses.map((topic) => {
      if (topic.id !== topicId) return topic;
      return { ...topic, lessons: topic.lessons.filter((l) => l.id !== id) };
    });
    updateCourses(updated);
  };

  const handleSaveChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeForm.instructions.trim() || !challengeForm.lessonId) return;

    const parsedChoices = challengeForm.choices
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const updated = courses.map((topic) => {
      const hasLesson = topic.lessons.some((l) => l.id === challengeForm.lessonId);
      if (!hasLesson) return topic;

      const updatedLessons = topic.lessons.map((lesson) => {
        if (lesson.id !== challengeForm.lessonId) return lesson;

        let updatedChallenges: Challenge[];
        if (editingChallengeId === 'new') {
          const newChallenge: Challenge = {
            id: `c-${Date.now()}`,
            lessonId: lesson.id,
            type: challengeForm.type,
            order: Number(challengeForm.order),
            instructions: challengeForm.instructions.trim(),
            codeTemplate: challengeForm.codeTemplate.trim() || undefined,
            correctAnswer: challengeForm.correctAnswer.trim(),
            choices: parsedChoices
          };
          updatedChallenges = [...lesson.challenges, newChallenge];
        } else {
          updatedChallenges = lesson.challenges.map((c) =>
            c.id === editingChallengeId
              ? {
                  ...c,
                  type: challengeForm.type,
                  order: Number(challengeForm.order),
                  instructions: challengeForm.instructions.trim(),
                  codeTemplate: challengeForm.codeTemplate.trim() || undefined,
                  correctAnswer: challengeForm.correctAnswer.trim(),
                  choices: parsedChoices
                }
              : c
          );
        }

        updatedChallenges.sort((a, b) => a.order - b.order);
        return { ...lesson, challenges: updatedChallenges };
      });

      return { ...topic, lessons: updatedLessons };
    });

    updateCourses(updated);
    setEditingChallengeId(null);
  };

  const handleDeleteChallenge = (lessonId: string, id: string) => {
    if (!confirm('Apakah kamu yakin ingin menghapus Soal Tantangan ini?')) return;
    const updated = courses.map((topic) => {
      const hasLesson = topic.lessons.some((l) => l.id === lessonId);
      if (!hasLesson) return topic;

      const updatedLessons = topic.lessons.map((lesson) => {
        if (lesson.id !== lessonId) return lesson;
        return { ...lesson, challenges: lesson.challenges.filter((c) => c.id !== id) };
      });

      return { ...topic, lessons: updatedLessons };
    });
    updateCourses(updated);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#130a2a',
        color: '#FFF',
        padding: '24px 20px',
        fontFamily: 'var(--font-kids-body)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '3px solid rgba(255, 255, 255, 0.06)',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '28px', fontFamily: 'var(--font-kids-header)', color: 'var(--accent-cyan)' }}>
            ⚙️ Panel Kontrol Kursus
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Tambahkan, ubah bab kurikulum, level pelajaran, dan teka-teki soal coding ByteBloom secara dinamis!
          </p>
        </div>

        <Link
          href="/dashboard"
          style={{
            textDecoration: 'none',
            backgroundColor: 'var(--primary)',
            color: '#FFF',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '13px',
            boxShadow: 'var(--shadow-btn-primary)',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          ⬅️ Dashboard Utama
        </Link>
      </div>

      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <AdminMetricsGrid
            totalTopics={totalTopics}
            totalLessons={totalLessons}
            totalChallenges={totalChallenges}
          />
          <GamificationSettingsCard />
          <ResetCurriculumCard onReset={resetCoursesToDefault} />
        </div>
      )}

      {activeTab === 'curriculum' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '20px' }}>🗺️ Struktur Peta Materi Belajar</h3>
            <button
              onClick={() => {
                setTopicForm({ title: '', description: '', order: courses.length + 1 });
                setEditingTopicId('new');
              }}
              className="playful-btn playful-btn-success"
              style={{ width: 'auto', fontSize: '13px', padding: '10px 18px' }}
            >
              ➕ Tambah Bab (Section)
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {courses.map((topic) => (
              <TopicAccordionItem
                key={topic.id}
                topic={topic}
                onEditTopic={() => {
                  setTopicForm({ title: topic.title, description: topic.description, order: topic.order });
                  setEditingTopicId(topic.id);
                }}
                onDeleteTopic={() => handleDeleteTopic(topic.id)}
                onAddLesson={() => {
                  setLessonForm({ topicId: topic.id, title: '', description: '', order: topic.lessons.length + 1, xpReward: 20 });
                  setEditingLessonId('new');
                }}
                onEditLesson={(lessonId) => {
                  const lesson = topic.lessons.find((l) => l.id === lessonId);
                  if (!lesson) return;
                  setLessonForm({ topicId: topic.id, title: lesson.title, description: lesson.description, order: lesson.order, xpReward: lesson.xpReward });
                  setEditingLessonId(lesson.id);
                }}
                onDeleteLesson={(lessonId) => handleDeleteLesson(topic.id, lessonId)}
                onAddChallenge={(lessonId) => {
                  const lesson = topic.lessons.find((l) => l.id === lessonId);
                  if (!lesson) return;
                  setChallengeForm({
                    lessonId: lesson.id,
                    type: 'THEORY',
                    order: lesson.challenges.length + 1,
                    instructions: '',
                    codeTemplate: '',
                    correctAnswer: '',
                    choices: ''
                  });
                  setEditingChallengeId('new');
                }}
                onEditChallenge={(lessonId, challengeId) => {
                  const lesson = topic.lessons.find((l) => l.id === lessonId);
                  const challenge = lesson?.challenges.find((c) => c.id === challengeId);
                  if (!lesson || !challenge) return;
                  setChallengeForm({
                    lessonId: lesson.id,
                    type: challenge.type,
                    order: challenge.order,
                    instructions: challenge.instructions,
                    codeTemplate: challenge.codeTemplate || '',
                    correctAnswer: challenge.correctAnswer,
                    choices: challenge.choices.join(', ')
                  });
                  setEditingChallengeId(challenge.id);
                }}
                onDeleteChallenge={(lessonId, challengeId) => handleDeleteChallenge(lessonId, challengeId)}
              />
            ))}
          </div>
        </div>
      )}

      <TopicFormModal
        isOpen={editingTopicId !== null}
        isNew={editingTopicId === 'new'}
        values={topicForm}
        onChange={setTopicForm}
        onSubmit={handleSaveTopic}
        onCancel={() => setEditingTopicId(null)}
      />

      <LessonFormModal
        isOpen={editingLessonId !== null}
        isNew={editingLessonId === 'new'}
        values={lessonForm}
        onChange={setLessonForm}
        onSubmit={handleSaveLesson}
        onCancel={() => setEditingLessonId(null)}
      />

      <ChallengeFormModal
        isOpen={editingChallengeId !== null}
        isNew={editingChallengeId === 'new'}
        values={challengeForm}
        onChange={setChallengeForm}
        onSubmit={handleSaveChallenge}
        onCancel={() => setEditingChallengeId(null)}
      />
    </div>
  );
}