'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, Lesson } from '@/context/GameContext';
import Bloomie from '@/components/Bloomie';

// Helper to generate a smooth Bezier curve path connecting zig-zag level nodes
const generateSvgPath = (lessonsCount: number) => {
  if (lessonsCount <= 1) return 'M 60,10 L 60,10';
  let path = '';
  for (let i = 0; i < lessonsCount; i++) {
    const x = 60 + Math.sin(i * 1.5) * 45;
    const y = 30 + i * 110;
    if (i === 0) {
      path += `M ${x},${y}`;
    } else {
      const prevX = 60 + Math.sin((i - 1) * 1.5) * 45;
      const prevY = 30 + (i - 1) * 110;
      const cpY = (prevY + y) / 2;
      path += ` C ${prevX},${cpY} ${x},${cpY} ${x},${y}`;
    }
  }
  return path;
};

const DECORATIONS = [
  { char: '<div>', top: '8%', left: '8%', color: '#ff79c6', size: '14px', angle: '-15deg' },
  { char: '{}', top: '18%', right: '10%', color: '#8be9fd', size: '20px', angle: '25deg' },
  { char: 'CSS', top: '30%', left: '12%', color: '#fbbf24', size: '16px', angle: '12deg' },
  { char: 'JS', top: '44%', right: '8%', color: '#10b981', size: '18px', angle: '-20deg' },
  { char: '<html>', top: '56%', left: '6%', color: '#f97316', size: '15px', angle: '30deg' },
  { char: '</>', top: '70%', right: '12%', color: '#a78bfa', size: '18px', angle: '-10deg' },
  { char: '🚀', top: '82%', left: '10%', color: '#fff', size: '20px', angle: '0deg' },
  { char: '🎨', top: '92%', right: '8%', color: '#fbbf24', size: '16px', angle: '15deg' }
];

export default function DashboardPage() {
  const { user, courses, refillHearts, loading } = useGame();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('learn');
  const [showHeartModal, setShowHeartModal] = useState(false);
  const [showOutlineDrawer, setShowOutlineDrawer] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#130a2a'
      }}>
        <p style={{ color: 'var(--text-muted)' }}>Memuat peta petualangan...</p>
      </div>
    );
  }

  // Calculate total progress
  const totalLessons = courses.reduce((acc, curr) => acc + curr.lessons.length, 0);
  const completedCount = user.completedLessons.length;
  const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  // Determine if a lesson is unlocked
  const isLessonUnlocked = (lesson: Lesson, topicIndex: number, lessonIndex: number) => {
    if (topicIndex === 0 && lessonIndex === 0) return true;
    if (lessonIndex > 0) {
      const prevLesson = courses[topicIndex].lessons[lessonIndex - 1];
      return user.completedLessons.includes(prevLesson.id);
    }
    if (topicIndex > 0) {
      const prevTopic = courses[topicIndex - 1];
      const lastLessonOfPrevTopic = prevTopic.lessons[prevTopic.lessons.length - 1];
      return user.completedLessons.includes(lastLessonOfPrevTopic.id);
    }
    return false;
  };

  // Find the first unlocked level that is not completed
  const getActiveLevelTitle = () => {
    for (const topic of courses) {
      for (const lesson of topic.lessons) {
        if (!user.completedLessons.includes(lesson.id)) {
          return `${lesson.title}`;
        }
      }
    }
    return "Semua Misi Selesai! 🎉";
  };

  const handleHeartsRefill = () => {
    if (user.coins >= 10 && user.hearts < 5) {
      refillHearts();
      setShowHeartModal(false);
    }
  };

  const renderBottomNav = () => {
    return (
      <div style={{
        display: 'flex',
        backgroundColor: '#3E237A',
        borderTop: '3px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 16px',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'sticky',
        bottom: 0,
        zIndex: 100,
        width: '100%'
      }}>
        {/* Home Tab */}
        <div
          onClick={() => { setActiveTab('learn'); setShowOutlineDrawer(false); }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            opacity: activeTab === 'learn' ? 1 : 0.6,
            transform: activeTab === 'learn' ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.2s'
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path d="M3 10.182V20a1 1 0 001 1h5v-6h4v6h5a1 1 0 001-1v-9.818a1 1 0 00-.316-.725l-7-6.364a1 1 0 00-1.368 0l-7 6.364A1 1 0 003 10.182z" fill="#00E5FF" />
          </svg>
        </div>

        {/* Medals Tab */}
        <div
          onClick={() => { setActiveTab('medals'); setShowOutlineDrawer(false); }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            opacity: activeTab === 'medals' ? 1 : 0.6,
            transform: activeTab === 'medals' ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.2s'
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9" r="6" fill="#FFC107" />
            <path d="M8 14l-2 7 6-3 6 3-2-7" fill="#E23E57" />
            <polygon points="12,5 13.5,8 16.5,8.5 14,10.5 15,13.5 12,11.5 9,13.5 10,10.5 7.5,8.5 10.5,8" fill="#FFF" />
          </svg>
        </div>

        {/* Profile Tab */}
        <div
          onClick={() => { setActiveTab('profile'); setShowOutlineDrawer(false); }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            opacity: activeTab === 'profile' ? 1 : 0.6,
            transform: activeTab === 'profile' ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.2s'
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="7" r="5" fill="#FF8D7A" />
            <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#2979FF" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#1E1233',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Header Indicators Panel */}
      <div style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#1E1233',
        padding: '16px 16px 10px 16px',
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        borderBottom: '2px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Game Stats Containers Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {/* Hearts Container */}
          <div
            onClick={() => setShowHeartModal(true)}
            style={{
              backgroundColor: '#2A1648',
              borderRadius: '12px',
              border: '2px solid #3D236E',
              padding: '8px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              fontFamily: 'var(--font-kids-header)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-playful)',
              transition: 'transform 0.1s'
            }}
          >
            <span>❤️</span>
            <span style={{ color: '#FFF' }}>{user.hearts}</span>
          </div>

          {/* XP Container */}
          <div style={{
            backgroundColor: '#2A1648',
            borderRadius: '12px',
            border: '2px solid #3D236E',
            padding: '8px 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: 'var(--font-kids-header)',
            boxShadow: 'var(--shadow-playful)'
          }}>
            <span>💎</span>
            <span style={{ color: '#FFF' }}>{user.xp} XP</span>
          </div>

          {/* Streak Container */}
          <div style={{
            backgroundColor: '#2A1648',
            borderRadius: '12px',
            border: '2px solid #3D236E',
            padding: '8px 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: 'var(--font-kids-header)',
            boxShadow: 'var(--shadow-playful)'
          }}>
            <span>🔥</span>
            <span style={{ color: '#FFF' }}>{user.streak} Hari</span>
          </div>

          {/* Coins Container */}
          <div style={{
            backgroundColor: '#2A1648',
            borderRadius: '12px',
            border: '2px solid #3D236E',
            padding: '8px 4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            fontFamily: 'var(--font-kids-header)',
            boxShadow: 'var(--shadow-playful)'
          }}>
            <span>🪙</span>
            <span style={{ color: '#FFF' }}>{user.coins}</span>
          </div>
        </div>

        {/* Active Level Banner */}
        <div style={{
          backgroundColor: '#2A1648',
          border: '2px solid #3D236E',
          borderRadius: '12px',
          padding: '10px',
          textAlign: 'center',
          fontFamily: 'var(--font-kids-header)',
          fontSize: '13px',
          fontWeight: 700,
          color: '#FFF',
          letterSpacing: '0.5px',
          boxShadow: 'var(--shadow-playful)'
        }}>
          🎯 Level Aktif: {getActiveLevelTitle()}
        </div>
      </div>

      {/* Main Tab Renderings */}
      {activeTab === 'learn' && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '100px',
          position: 'relative'
        }}>
          {/* Floating background code decorations */}
          {DECORATIONS.map((dec, idx) => (
            <div
              key={idx}
              className="float-anim"
              style={{
                position: 'absolute',
                top: dec.top,
                left: dec.left,
                right: dec.right,
                color: dec.color,
                fontSize: dec.size,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                opacity: 0.15,
                transform: `rotate(${dec.angle})`,
                pointerEvents: 'none',
                zIndex: 0,
                animationDelay: `${idx * 0.4}s`
              }}
            >
              {dec.char}
            </div>
          ))}

          {/* Progress Card (Header Box below Active Banner) */}
          <div style={{ padding: '16px 16px 8px 16px', zIndex: 10 }}>
            <div style={{
              backgroundColor: '#2A1648',
              borderRadius: '20px',
              border: '2px solid #3D236E',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-playful)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Circular Progress Ring matching mockup */}
                <div style={{
                  position: 'relative',
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: `conic-gradient(var(--accent-cyan) ${progressPercent * 3.6}deg, #3D236E 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
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
                  }}>
                    {Math.round(progressPercent)}%
                  </div>
                </div>

                {/* Subtitle & Title */}
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-kids-header)' }}>
                    Progress Belajarmu
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#FFF', fontFamily: 'var(--font-kids-header)', marginTop: '2px' }}>
                    {completedCount} dari {totalLessons} Level Selesai
                  </div>
                </div>
              </div>

              {/* Hamburger Menu Trigger */}
              <button
                onClick={() => setShowOutlineDrawer(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px'
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Dynamic Learning Path Map */}
          <div style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px 0',
            gap: '40px',
            zIndex: 5
          }}>
            {courses.map((topic, topicIdx) => {
              const topicLessons = topic.lessons.map(l => l.id);
              const completedInTopic = topicLessons.filter(id => user.completedLessons.includes(id)).length;
              const topicProgress = topicLessons.length > 0 ? Math.round((completedInTopic / topicLessons.length) * 100) : 0;

              return (
                <div key={topic.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  
                  {/* Topic Section Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, #2b115c 0%, #4a218f 100%)',
                    border: '3px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                    padding: '16px 20px',
                    margin: '20px 16px 0px 16px',
                    boxShadow: 'var(--shadow-playful)',
                    position: 'relative',
                    overflow: 'hidden',
                    alignSelf: 'stretch'
                  }}>
                    {/* Glowing highlight */}
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      right: '-30px',
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      backgroundColor: topicProgress === 100 ? 'var(--success)' : 'var(--accent-cyan)',
                      filter: 'blur(35px)',
                      opacity: 0.3
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Bagian {topic.order}
                      </span>
                      {topicProgress === 100 && (
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--success-light)' }}>
                          Selesai! 🌟
                        </span>
                      )}
                    </div>
                    
                    <h3 style={{ fontSize: '16px', color: '#FFF', margin: '4px 0', fontFamily: 'var(--font-kids-header)' }}>
                      {topic.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      {topic.description}
                    </p>
                  </div>

                  {/* Levels list in a zig-zag path */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '40px',
                    padding: '24px 0 40px 0'
                  }}>
                    
                    {/* Local SVG path connector for this topic */}
                    {topic.lessons.length > 0 && (
                      <svg style={{
                        position: 'absolute',
                        top: '40px',
                        bottom: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '120px',
                        height: 'calc(100% - 80px)',
                        pointerEvents: 'none',
                        zIndex: 1
                      }}>
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
                      const unlocked = isLessonUnlocked(lesson, topicIdx, lessonIdx);
                      const completed = user.completedLessons.includes(lesson.id);
                      const isCurrentActive = unlocked && !completed; // Level to play next
                      
                      // Calculate zig-zag translation: sin pattern gives alternates (left, right, center, etc.)
                      const xOffset = Math.sin(lessonIdx * 1.5) * 45;

                      return (
                        <div
                          key={lesson.id}
                          style={{
                            transform: `translateX(${xOffset}px)`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 10,
                            position: 'relative'
                          }}
                        >
                          {/* Speech bubble above active level node */}
                          {isCurrentActive && (
                            <div className="bounce-slow" style={{
                              position: 'absolute',
                              top: '-45px',
                              backgroundColor: 'var(--primary)',
                              border: '2px solid #FFF',
                              borderRadius: '12px',
                              padding: '4px 10px',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              color: '#FFF',
                              whiteSpace: 'nowrap',
                              zIndex: 20,
                              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                              fontFamily: 'var(--font-kids-header)'
                            }}>
                              AYO MAIN! 🚀
                              {/* Small triangle arrow at bottom of speech bubble */}
                              <div style={{
                                position: 'absolute',
                                bottom: '-8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                borderWidth: '8px 8px 0',
                                borderStyle: 'solid',
                                borderColor: 'var(--primary) transparent',
                                width: 0,
                                height: 0
                              }} />
                              {/* Extra white border tip */}
                              <div style={{
                                position: 'absolute',
                                bottom: '-10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                borderWidth: '9px 9px 0',
                                borderStyle: 'solid',
                                borderColor: '#FFF transparent',
                                width: 0,
                                height: 0,
                                zIndex: -1
                              }} />
                            </div>
                          )}

                          {/* Level Button Node */}
                          <button
                            disabled={!unlocked}
                            onClick={() => {
                              if (user.hearts <= 0) {
                                setShowHeartModal(true);
                                return;
                              }
                              router.push(`/quest/${lesson.id}`);
                            }}
                            style={{
                              width: isCurrentActive ? '78px' : '68px',
                              height: isCurrentActive ? '78px' : '68px',
                              borderRadius: '50%',
                              background: completed
                                ? 'linear-gradient(135deg, var(--success) 0%, #059669 100%)'
                                : isCurrentActive
                                ? 'linear-gradient(135deg, var(--primary) 0%, #ec4899 100%)'
                                : 'linear-gradient(135deg, #2A1648 0%, #1d0f33 100%)',
                              border: isCurrentActive
                                ? '3px dashed #FFF'
                                : completed
                                ? '3px solid var(--success-light)'
                                : '3px solid #3D236E',
                              cursor: unlocked ? 'pointer' : 'not-allowed',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: isCurrentActive
                                ? '0 8px 0 #5b21b6, 0 0 20px rgba(124, 58, 237, 0.6)'
                                : completed
                                ? '0 6px 0 #047857'
                                : '0 6px 0 #130a2a',
                              transition: 'transform 0.1s, box-shadow 0.1s',
                              position: 'relative'
                            }}
                            className={isCurrentActive ? 'glow-pulse' : ''}
                          >
                            {completed ? (
                              <span style={{ fontSize: '24px', color: '#FFF' }}>⭐</span>
                            ) : isCurrentActive ? (
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFF">
                                <polygon points="8,5 19,12 8,19" />
                              </svg>
                            ) : (
                              <span style={{ fontSize: '20px' }}>🔒</span>
                            )}
                          </button>

                          {/* Level label under node */}
                          <div style={{
                            marginTop: '8px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: isCurrentActive ? 'var(--primary-light)' : completed ? 'var(--success-light)' : 'var(--text-muted)',
                            fontFamily: 'var(--font-kids-header)',
                            textAlign: 'center',
                            maxWidth: '120px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {lesson.title.replace('Level ', 'Lv ')}
                          </div>

                          {/* Float mascot next to the active or completed level node (interspersed decor) */}
                          {isCurrentActive && (
                            <div style={{
                              position: 'absolute',
                              left: xOffset > 0 ? '-85px' : '85px',
                              top: '-5px',
                              zIndex: 5,
                              pointerEvents: 'none'
                            }}>
                              <Bloomie state="wave" size={68} />
                            </div>
                          )}

                          {!isCurrentActive && lessonIdx % 3 === 2 && (
                            <div style={{
                              position: 'absolute',
                              left: xOffset > 0 ? '-85px' : '85px',
                              top: '-5px',
                              zIndex: 5,
                              pointerEvents: 'none',
                              opacity: 0.7
                            }}>
                              <Bloomie state={completed ? 'success' : 'think'} size={60} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'medals' && (
        <div style={{
          flex: 1,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          paddingBottom: '100px',
          zIndex: 10
        }}>
          {/* Unlocked Badges Panel */}
          <div style={{
            backgroundColor: '#2A1648',
            border: '2px solid #3D236E',
            borderRadius: '24px',
            padding: '20px',
            boxShadow: 'var(--shadow-playful)'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏆 Medali & Pencapaian
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {user.unlockedBadges.map((badge, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    padding: '12px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>🎖️</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{badge}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Berhasil dibuka di petualangan</div>
                  </div>
                </div>
              ))}
              {user.unlockedBadges.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic', textAlign: 'center', padding: '16px' }}>
                  Belum ada medali terkumpul. Selesaikan tantangan untuk mendapatkan medali!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div style={{
          flex: 1,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          paddingBottom: '100px',
          zIndex: 10
        }}>
          {/* Profile Card */}
          <div style={{
            backgroundColor: '#2A1648',
            border: '3px solid #3D236E',
            borderRadius: '24px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-playful)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              margin: '0 auto 16px auto',
              border: '4px solid #fff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h2>{user.username}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Petualang Tingkat {user.level}</p>

            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginTop: '20px',
              backgroundColor: '#1E1233',
              borderRadius: '16px',
              padding: '16px'
            }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{user.xp}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total XP</div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-yellow)' }}>{user.coins}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Koin</div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-orange)' }}>{user.streak} Hari</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Streak</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heart Refill Modal Overlay */}
      {showHeartModal && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(14, 5, 32, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#2A1648',
            border: '4px solid var(--primary)',
            borderRadius: '32px',
            padding: '30px 24px',
            maxWidth: '360px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}>
            <span style={{ fontSize: '64px', display: 'block', marginBottom: '12px' }}>❤️</span>
            <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>Isi Ulang Nyawa</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              Kehabisan nyawa? Kamu bisa memulihkan nyawamu menjadi 5 penuh seharga <strong>10 Koin 🪙</strong>.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                disabled={user.coins < 10 || user.hearts >= 5}
                onClick={handleHeartsRefill}
                className={`playful-btn ${user.coins >= 10 && user.hearts < 5 ? 'playful-btn-success' : 'playful-btn-disabled'}`}
              >
                Isi Penuh (10 Koin)
              </button>
              <button
                onClick={() => setShowHeartModal(false)}
                className="playful-btn playful-btn-muted"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Course Outline Drawer (Slides in on Hamburger click) */}
      {showOutlineDrawer && (
        <div style={{
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
        }}>
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>

          {/* Drawer Header Panel */}
          <div style={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#1E1233',
            padding: '16px 20px',
            borderBottom: '3px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{
              fontSize: '22px',
              color: '#FFF',
              fontFamily: 'var(--font-kids-header)'
            }}>
              Front-End Developer
            </h3>
            
            {/* Close Button */}
            <button
              onClick={() => setShowOutlineDrawer(false)}
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
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {courses.map((topic, topicIdx) => {
              const topicLessons = topic.lessons.map(l => l.id);
              const completedInTopic = topicLessons.filter(id => user.completedLessons.includes(id)).length;
              const topicProgress = topicLessons.length > 0 ? Math.round((completedInTopic / topicLessons.length) * 100) : 0;

              return (
                <div key={topic.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  
                  {topic.id === 'topic-5' && (
                    <div style={{
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      fontWeight: 'bold',
                      fontFamily: 'var(--font-kids-header)',
                      marginTop: '10px',
                      textAlign: 'center'
                    }}>
                      Webpages
                    </div>
                  )}

                  {/* Section card */}
                  <div style={{
                    backgroundColor: '#2A1648',
                    borderRadius: '20px',
                    border: '2px solid #3D236E',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    boxShadow: 'var(--shadow-playful)'
                  }}>
                    {/* Circle Progress Ring */}
                    <div style={{
                      position: 'relative',
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: `conic-gradient(#00E5FF ${topicProgress * 3.6}deg, #3D236E 0deg)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <div style={{
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
                      }}>
                        {topicProgress}%
                      </div>
                    </div>

                    {/* Section details & Levels */}
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        color: '#FFF',
                        fontFamily: 'var(--font-kids-header)'
                      }}>
                        {topic.title}
                      </h4>
                      
                      {/* Alternating level badge buttons inside section card */}
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginTop: '8px'
                      }}>
                        {topic.lessons.map((lesson, lessonIdx) => {
                          const unlocked = isLessonUnlocked(lesson, topicIdx, lessonIdx);
                          return (
                            <button
                              key={lesson.id}
                              disabled={!unlocked || user.hearts <= 0}
                              onClick={() => {
                                setShowOutlineDrawer(false);
                                router.push(`/quest/${lesson.id}`);
                              }}
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
          {renderBottomNav()}
        </div>
      )}

      {/* Render persistent bottom navigation bar */}
      {renderBottomNav()}
    </div>
  );
}
