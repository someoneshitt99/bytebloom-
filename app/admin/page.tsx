'use client';

import React, { useState } from 'react';
import { useGame, CourseTopic, Lesson, Challenge, ChallengeType } from '@/context/GameContext';
import Link from 'next/link';

type AdminTab = 'overview' | 'curriculum';

export default function AdminPage() {
  const { courses, updateCourses, resetCoursesToDefault, user } = useGame();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Form edit states
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(null);

  // Form values
  const [topicForm, setTopicForm] = useState({ title: '', description: '', order: 1 });
  const [lessonForm, setLessonForm] = useState({ topicId: '', title: '', description: '', order: 1, xpReward: 20 });
  const [challengeForm, setChallengeForm] = useState({
    lessonId: '',
    type: 'THEORY' as ChallengeType,
    order: 1,
    instructions: '',
    codeTemplate: '',
    correctAnswer: '',
    choices: '' // Comma-separated in form
  });

  // Calculate metrics
  const totalTopics = courses.length;
  const totalLessons = courses.reduce((acc, curr) => acc + curr.lessons.length, 0);
  const totalChallenges = courses.reduce(
    (acc, topic) => acc + topic.lessons.reduce((lAcc, l) => lAcc + l.challenges.length, 0),
    0
  );

  // TOPIC CRUD OPERATIONS
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

    // Sort by order
    updated.sort((a, b) => a.order - b.order);
    updateCourses(updated);
    setEditingTopicId(null);
  };

  const handleDeleteTopic = (id: string) => {
    if (!confirm('Apakah kamu yakin ingin menghapus Bab ini beserta seluruh Level dan Soal di dalamnya?')) return;
    const updated = courses.filter((t) => t.id !== id);
    updateCourses(updated);
  };

  // LESSON CRUD OPERATIONS
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

  // CHALLENGE CRUD OPERATIONS
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#130a2a',
      color: '#FFF',
      padding: '24px 20px',
      fontFamily: 'var(--font-kids-body)'
    }}>
      {/* Admin Title Block */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '3px solid rgba(255, 255, 255, 0.06)',
        paddingBottom: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontFamily: 'var(--font-kids-header)',
            color: 'var(--accent-cyan)'
          }}>
            ⚙️ Panel Kontrol Kursus
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Tambahkan, ubah bab kurikulum, level pelajaran, dan teka-teki soal coding ByteBloom secara dinamis!
          </p>
        </div>
        
        {/* Back to Dashboard link */}
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

      {/* Tabs Control */}
      <div style={{
        display: 'flex',
        backgroundColor: 'var(--bg-panel)',
        borderRadius: '16px',
        padding: '6px',
        marginBottom: '24px',
        maxWidth: '400px',
        border: '2px solid rgba(255, 255, 255, 0.05)'
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            border: 'none',
            fontFamily: 'var(--font-kids-header)',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeTab === 'overview' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'overview' ? 'var(--text-white)' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
        >
          📊 Ringkasan
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            border: 'none',
            fontFamily: 'var(--font-kids-header)',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: activeTab === 'curriculum' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'curriculum' ? 'var(--text-white)' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
        >
          🗺️ Kurikulum & Soal
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            <div className="playful-card" style={{ backgroundColor: 'var(--bg-panel)', textAlign: 'center' }}>
              <span style={{ fontSize: '32px' }}>📖</span>
              <h3 style={{ fontSize: '24px', margin: '8px 0 4px 0', color: 'var(--accent-cyan)' }}>{totalTopics}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Bab (Sections)</p>
            </div>
            <div className="playful-card" style={{ backgroundColor: 'var(--bg-panel)', textAlign: 'center' }}>
              <span style={{ fontSize: '32px' }}>🪜</span>
              <h3 style={{ fontSize: '24px', margin: '8px 0 4px 0', color: 'var(--accent-yellow)' }}>{totalLessons}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Level (Lessons)</p>
            </div>
            <div className="playful-card" style={{ backgroundColor: 'var(--bg-panel)', textAlign: 'center' }}>
              <span style={{ fontSize: '32px' }}>🧩</span>
              <h3 style={{ fontSize: '24px', margin: '8px 0 4px 0', color: 'var(--success-light)' }}>{totalChallenges}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Soal Tantangan</p>
            </div>
          </div>

          {/* Gamification Settings Box */}
          <div className="playful-card" style={{ backgroundColor: 'var(--bg-panel)' }}>
            <h3 style={{ fontSize: '18px', color: '#FFF', marginBottom: '12px' }}>⭐ Aturan Gamifikasi Game</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              Seluruh aturan gamifikasi sudah diprogram untuk berjalan otomatis. Pengguna mendapatkan <strong>XP</strong> saat menyelesaikan level pelajaran, bonus <strong>15 Koin</strong>, serta memulihkan nyawa penuh seharga <strong>10 Koin</strong> di dashboard.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ backgroundColor: 'var(--bg-deep)', borderRadius: '12px', padding: '12px', flex: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>BONUS Koin Penyelesaian</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-yellow)', marginTop: '4px' }}>🪙 15 Koin</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-deep)', borderRadius: '12px', padding: '12px', flex: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Harga Isi Ulang Nyawa</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--error-light)', marginTop: '4px' }}>🪙 10 Koin</div>
              </div>
            </div>
          </div>

          {/* Danger Zone: Seed Restore */}
          <div className="playful-card" style={{ border: '2px solid var(--error-light)', backgroundColor: '#340f1a' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--error-light)', marginBottom: '8px' }}>⚠️ Pemulihan Data Awal (Reset Database)</h3>
            <p style={{ fontSize: '14px', color: '#ffd2dc', lineHeight: '1.5', marginBottom: '16px' }}>
              Jika Anda melakukan kesalahan saat mengubah soal atau tidak sengaja menghapus konten kurikulum materi belajar dasar, Anda dapat menyetel ulang kurikulum database kembali ke setelan default awal kapan saja.
            </p>
            <button
              onClick={() => {
                if (confirm('Apakah kamu yakin ingin mereset seluruh kurikulum soal kembali ke default? Seluruh soal kustom buatanmu akan terhapus.')) {
                  resetCoursesToDefault();
                  alert('Kurikulum berhasil direset ke setelan default!');
                }
              }}
              className="playful-btn playful-btn-error"
              style={{ width: 'auto' }}
            >
              Reset Kurikulum ke Setelan Awal
            </button>
          </div>
        </div>
      )}

      {/* Tab: Curriculum Manager */}
      {activeTab === 'curriculum' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Topics List Header */}
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

          {/* Topics accordion loop */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {courses.map((topic) => (
              <div
                key={topic.id}
                style={{
                  backgroundColor: 'var(--bg-panel)',
                  border: '2px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-playful)'
                }}
              >
                {/* Topic Header Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '2px solid rgba(255,255,255,0.04)',
                  paddingBottom: '12px',
                  marginBottom: '16px'
                }}>
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
                      onClick={() => {
                        setTopicForm({ title: topic.title, description: topic.description, order: topic.order });
                        setEditingTopicId(topic.id);
                      }}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}
                      title="Edit Bab"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
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
                      onClick={() => {
                        setLessonForm({ topicId: topic.id, title: '', description: '', order: topic.lessons.length + 1, xpReward: 20 });
                        setEditingLessonId('new');
                      }}
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
                    <div
                      key={lesson.id}
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
                          Level {lesson.order}: {lesson.title} <span style={{ color: 'var(--accent-yellow)', fontSize: '11px' }}>(💎 {lesson.xpReward} XP)</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => {
                              setLessonForm({ topicId: topic.id, title: lesson.title, description: lesson.description, order: lesson.order, xpReward: lesson.xpReward });
                              setEditingLessonId(lesson.id);
                            }}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(topic.id, lesson.id)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' }}
                          >
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
                            onClick={() => {
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

                        {/* List of Challenges */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {lesson.challenges.map((c) => (
                            <div
                              key={c.id}
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
                                <span style={{
                                  backgroundColor: c.type === 'THEORY' ? 'var(--primary-dark)' : c.type === 'MULTIPLE_CHOICE' ? 'var(--accent-orange)' : 'var(--success)',
                                  fontSize: '10px',
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                  marginRight: '6px',
                                  fontWeight: 'bold'
                                }}>
                                  {c.type}
                                </span>
                                <strong>{c.order}.</strong> {c.instructions.substring(0, 50)}...
                              </div>

                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  onClick={() => {
                                    setChallengeForm({
                                      lessonId: lesson.id,
                                      type: c.type,
                                      order: c.order,
                                      instructions: c.instructions,
                                      codeTemplate: c.codeTemplate || '',
                                      correctAnswer: c.correctAnswer,
                                      choices: c.choices.join(', ')
                                    });
                                    setEditingChallengeId(c.id);
                                  }}
                                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteChallenge(lesson.id, c.id)}
                                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}
                                >
                                  ❌
                                </button>
                              </div>
                            </div>
                          ))}
                          {lesson.challenges.length === 0 && (
                            <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontStyle: 'italic', padding: '4px' }}>
                              Belum ada soal dibuat. Klik "Tambah Soal" untuk membuat teka-teki baru.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {topic.lessons.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
                      Bab ini kosong. Silakan tambah Level Pelajaran.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOPIC FORM MODAL */}
      {editingTopicId && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000
        }}>
          <form
            onSubmit={handleSaveTopic}
            style={{
              backgroundColor: 'var(--bg-panel)',
              border: '3px solid var(--primary)',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '400px', width: '100%',
              display: 'flex', flexDirection: 'column', gap: '16px'
            }}
          >
            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-kids-header)' }}>
              {editingTopicId === 'new' ? '➕ Tambah Bab Baru' : '✏️ Ubah Bab'}
            </h3>
            
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Nama Bab:</label>
              <input
                type="text"
                required
                value={topicForm.title}
                onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-deep)', color: '#fff', marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Deskripsi:</label>
              <textarea
                value={topicForm.description}
                onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-deep)', color: '#fff', marginTop: '4px', height: '80px', resize: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Urutan Tampil (Order):</label>
              <input
                type="number"
                required
                value={topicForm.order}
                onChange={(e) => setTopicForm({ ...topicForm, order: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-deep)', color: '#fff', marginTop: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" className="playful-btn playful-btn-success" style={{ flex: 1 }}>
                Simpan
              </button>
              <button type="button" onClick={() => setEditingTopicId(null)} className="playful-btn playful-btn-muted" style={{ flex: 1 }}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LESSON FORM MODAL */}
      {editingLessonId && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000
        }}>
          <form
            onSubmit={handleSaveLesson}
            style={{
              backgroundColor: 'var(--bg-panel)',
              border: '3px solid var(--primary)',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '400px', width: '100%',
              display: 'flex', flexDirection: 'column', gap: '16px'
            }}
          >
            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-kids-header)' }}>
              {editingLessonId === 'new' ? '➕ Tambah Level Baru' : '✏️ Ubah Level'}
            </h3>
            
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Judul Pelajaran:</label>
              <input
                type="text"
                required
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-deep)', color: '#fff', marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Deskripsi Level:</label>
              <textarea
                value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-deep)', color: '#fff', marginTop: '4px', height: '80px', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Urutan (Order):</label>
                <input
                  type="number"
                  required
                  value={lessonForm.order}
                  onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-deep)', color: '#fff', marginTop: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hadiah XP:</label>
                <input
                  type="number"
                  required
                  value={lessonForm.xpReward}
                  onChange={(e) => setLessonForm({ ...lessonForm, xpReward: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-deep)', color: '#fff', marginTop: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" className="playful-btn playful-btn-success" style={{ flex: 1 }}>
                Simpan
              </button>
              <button type="button" onClick={() => setEditingLessonId(null)} className="playful-btn playful-btn-muted" style={{ flex: 1 }}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CHALLENGE FORM MODAL */}
      {editingChallengeId && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000
        }}>
          <form
            onSubmit={handleSaveChallenge}
            style={{
              backgroundColor: 'var(--bg-panel)',
              border: '3px solid var(--primary)',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '460px', width: '100%',
              display: 'flex', flexDirection: 'column', gap: '14px',
              maxHeight: '90vh', overflowY: 'auto'
            }}
          >
            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-kids-header)' }}>
              {editingChallengeId === 'new' ? '➕ Buat Soal Tantangan' : '✏️ Ubah Soal Tantangan'}
            </h3>

            {/* Type selector */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tipe Soal:</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {['THEORY', 'MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'CODE_PUZZLE'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setChallengeForm({ ...challengeForm, type: type as ChallengeType })}
                    style={{
                      flex: 1, padding: '6px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer',
                      backgroundColor: challengeForm.type === type ? 'var(--primary)' : 'var(--bg-deep)',
                      color: challengeForm.type === type ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Instruksi / Pertanyaan Soal:</label>
              <textarea
                required
                value={challengeForm.instructions}
                onChange={(e) => setChallengeForm({ ...challengeForm, instructions: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-deep)', color: '#fff', marginTop: '4px', height: '60px', resize: 'none' }}
              />
            </div>

            {/* Conditional field: Code Template (for CODE_PUZZLE or FILL_IN_BLANK) */}
            {(challengeForm.type === 'CODE_PUZZLE' || challengeForm.type === 'FILL_IN_BLANK') && (
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Template Kode HTML/JS (Gunakan [BLANK] untuk bagian rumpang):</label>
                <input
                  type="text"
                  placeholder="Contoh: <p>Aku [BLANK] HTML</p>"
                  value={challengeForm.codeTemplate}
                  onChange={(e) => setChallengeForm({ ...challengeForm, codeTemplate: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-deep)', color: '#fff', marginTop: '4px' }}
                />
              </div>
            )}

            {/* Correct Answer */}
            {challengeForm.type !== 'THEORY' && (
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Jawaban Benar (Pisahkan dengan koma jika ada 2 rumpang/blank):</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: h1 atau main,main"
                  value={challengeForm.correctAnswer}
                  onChange={(e) => setChallengeForm({ ...challengeForm, correctAnswer: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-deep)', color: '#fff', marginTop: '4px' }}
                />
              </div>
            )}

            {/* Choices list */}
            {challengeForm.type !== 'THEORY' && (
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pilihan Jawaban / Blok Geser (Pisahkan dengan koma):</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: main, h1, body, p"
                  value={challengeForm.choices}
                  onChange={(e) => setChallengeForm({ ...challengeForm, choices: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-deep)', color: '#fff', marginTop: '4px' }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Urutan (Order):</label>
              <input
                type="number"
                required
                value={challengeForm.order}
                onChange={(e) => setChallengeForm({ ...challengeForm, order: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--bg-deep)', color: '#fff', marginTop: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" className="playful-btn playful-btn-success" style={{ flex: 1 }}>
                Simpan
              </button>
              <button type="button" onClick={() => setEditingChallengeId(null)} className="playful-btn playful-btn-muted" style={{ flex: 1 }}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
