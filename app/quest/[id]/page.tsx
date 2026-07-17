'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGame, Challenge, Lesson } from '@/context/GameContext';
import Bloomie from '@/components/Bloomie';
import ProgressBar from '@/components/ProgressBar';
import BottomFeedback from '@/components/BottomFeedback';
import GridSimulator from '@/components/quest/GridSimulator';
import ScratchBlockEditor from '@/components/quest/ScratchBlockEditor';
import { executeActionsOnGrid, ExecutionResult } from '@/lib/grid-executor';
import { BlockAction } from '@/lib/blocky-blocks';

interface GridCell {
  x: number;
  y: number;
  type: 'empty' | 'path' | 'stone' | 'star';
}

export default function QuestWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { user, courses, completeLesson, loseHeart, loading } = useGame();

  const lessonId = params.id as string;

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);

  // State untuk tipe soal yang sudah ada
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [blankAnswers, setBlankAnswers] = useState<string[]>([]);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [evaluationMsg, setEvaluationMsg] = useState('');

  // Visual compiler grid simulation (untuk CODE_PUZZLE / FILL_IN_BLANK lama)
  const [bloomiePos, setBloomiePos] = useState({ x: 2, y: 1 });
  const [isCompiling, setIsCompiling] = useState(false);

  // State baru untuk tipe soal SCRATCH_BLOCK
  const [scratchActions, setScratchActions] = useState<BlockAction[]>([]);
  const [scratchExecution, setScratchExecution] = useState<ExecutionResult | null>(null);
  const [scratchIsRunning, setScratchIsRunning] = useState(false);

  const challenges = activeLesson ? activeLesson.challenges : [];
  const challenge = challenges[currentChallengeIdx];
  const progressPercent = challenges.length > 0 ? (currentChallengeIdx / challenges.length) * 100 : 0;

  const handleResetChallenge = () => {
    setSelectedChoice(null);
    setBlankAnswers([]);
    setFeedbackVisible(false);
    setIsCompiling(false);
    setScratchActions([]);
    setScratchExecution(null);
    setScratchIsRunning(false);
    if (challenge) {
      if (challenge.id === 't1-l1-c3') {
        setBloomiePos({ x: 2, y: 1 });
      } else if (challenge.id === 't1-l2-c1') {
        setBloomiePos({ x: 2, y: 1 });
      } else if (challenge.id === 't1-l2-c2') {
        setBloomiePos({ x: 2, y: 1 });
      }
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
      return;
    }

    for (const topic of courses) {
      const found = topic.lessons.find((l) => l.id === lessonId);
      if (found) {
        setActiveLesson(found);
        break;
      }
    }
  }, [lessonId, courses, user, loading, router]);

  useEffect(() => {
    handleResetChallenge();
  }, [currentChallengeIdx, activeLesson]);

  if (loading || !user || !activeLesson || !challenge) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-sky)'
      }}>
        <p style={{ color: 'var(--text-muted)' }}>Membuka petualangan quest...</p>
      </div>
    );
  }

  const handleScratchActionsChange = (actions: BlockAction[]) => {
    setScratchActions(actions);
    setScratchExecution(null);
    setScratchIsRunning(false);
  };

  const handleScratchAnimationComplete = () => {
    setScratchIsRunning(false);
    if (!scratchExecution) return;

    const correct = scratchExecution.reachedGoal;
    setIsCorrect(correct);
    setFeedbackVisible(true);
    if (correct) {
      setEvaluationMsg('Luar biasa! Bloomie berhasil mencapai bintang dengan kode yang kamu susun! 🌟');
    } else {
      loseHeart();
      setEvaluationMsg(
        scratchExecution.hitObstacle
          ? 'Bloomie menabrak batu! Coba susun ulang blokmu supaya Bloomie bisa melewatinya.'
          : 'Bloomie belum sampai ke bintang. Mungkin perlu blok tambahan atau urutannya berbeda?'
      );
    }
  };

  const runVisualSimulation = (steps: string[], correctVal: boolean) => {
    setIsCompiling(true);
    let stepIndex = 0;

    setBloomiePos({ x: 2, y: 1 });

    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const action = steps[stepIndex];
        setBloomiePos((prev) => {
          let newX = prev.x;
          let newY = prev.y;

          if (action === 'right') {
            newY = Math.min(5, prev.y + 1);
          } else if (action === 'left') {
            newY = Math.max(1, prev.y - 1);
          } else if (action === 'up') {
            newX = Math.max(1, prev.x - 1);
          } else if (action === 'down') {
            newX = Math.min(5, prev.x + 1);
          } else if (action === 'jump') {
            newY = Math.min(5, prev.y + 2);
          }

          return { x: newX, y: newY };
        });
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsCompiling(false);
        setIsCorrect(correctVal);
        setFeedbackVisible(true);
        if (correctVal) {
          setEvaluationMsg('Bloomie berhasil melangkah dan mengambil bintang emas!');
        } else {
          loseHeart();
          setEvaluationMsg('Oops! Bloomie menabrak batu atau keluar dari jalur. Silakan periksa kembali!');
        }
      }
    }, 1000);
  };

  const isCheckButtonEnabled = () => {
    if (challenge.type === 'THEORY') return true;
    if (challenge.type === 'MULTIPLE_CHOICE') return !!selectedChoice;
    if (challenge.type === 'FILL_IN_BLANK' || challenge.type === 'CODE_PUZZLE') return blankAnswers.length > 0;
    if (challenge.type === 'SCRATCH_BLOCK') return scratchActions.length > 0 && !scratchIsRunning;
    return false;
  };

  const handleCheck = () => {
    if (user.hearts <= 0) {
      alert('Kamu kehabisan nyawa! Kembali ke Peta untuk mengisi ulang nyawa.');
      router.push('/dashboard');
      return;
    }

    // ── Tipe SCRATCH_BLOCK ─────────────────────────────────────────────────
    if (challenge.type === 'SCRATCH_BLOCK') {
      if (!challenge.gridConfig || scratchActions.length === 0) return;
      const result = executeActionsOnGrid(scratchActions, challenge.gridConfig);
      setScratchExecution(result);
      setScratchIsRunning(true);
      return;
    }

    // ── Tipe soal lama ─────────────────────────────────────────────────────
    let answerIsCorrect = false;

    if (challenge.type === 'THEORY') {
      answerIsCorrect = true;
    } else if (challenge.type === 'MULTIPLE_CHOICE') {
      answerIsCorrect = selectedChoice === challenge.correctAnswer;
    } else if (challenge.type === 'FILL_IN_BLANK') {
      const combined = blankAnswers.join(',');
      answerIsCorrect = combined === challenge.correctAnswer;

      if (challenge.id === 't1-l2-c1') {
        const steps = blankAnswers.map(a => a === 'jump' ? 'jump' : 'left');
        runVisualSimulation(steps, answerIsCorrect);
        return;
      }
      if (challenge.id === 't1-l4-c2') {
        runVisualSimulation(['right', 'right', 'right', 'right'], answerIsCorrect);
        return;
      }
    } else if (challenge.type === 'CODE_PUZZLE') {
      const joined = blankAnswers.join('');
      answerIsCorrect = joined === challenge.correctAnswer;

      if (challenge.id === 't1-l1-c3') {
        runVisualSimulation(['right', 'right'], answerIsCorrect);
        return;
      }
      if (challenge.id === 't1-l2-c2') {
        runVisualSimulation(['jump', 'right', 'jump'], answerIsCorrect);
        return;
      }
      if (challenge.id === 't1-l3-c3') {
        runVisualSimulation(['right', 'right', 'right'], answerIsCorrect);
        return;
      }
    }

    setIsCorrect(answerIsCorrect);
    setFeedbackVisible(true);

    if (answerIsCorrect) {
      setEvaluationMsg('Jawabanmu 100% tepat! Kamu pintar sekali!');
    } else {
      loseHeart();
      setEvaluationMsg('Hmm, sepertinya jawabanmu belum pas. Coba cek lagi ya!');
    }
  };

  const handleContinue = () => {
    if (isCorrect) {
      if (currentChallengeIdx < challenges.length - 1) {
        setCurrentChallengeIdx(currentChallengeIdx + 1);
      } else {
        completeLesson(lessonId, activeLesson.xpReward);
        alert(`Selamat! Kamu menyelesaikan "${activeLesson.title}" dan mendapatkan ${activeLesson.xpReward} XP!`);
        router.push('/dashboard');
      }
    } else {
      setFeedbackVisible(false);
      if (challenge.type === 'SCRATCH_BLOCK') {
        setScratchExecution(null);
        setScratchIsRunning(false);
      }
    }
  };

  const renderVisualGrid = () => {
    const gridCells: GridCell[] = [
      { x: 1, y: 1, type: 'empty' }, { x: 1, y: 2, type: 'empty' }, { x: 1, y: 3, type: 'empty' }, { x: 1, y: 4, type: 'empty' }, { x: 1, y: 5, type: 'empty' },
      { x: 2, y: 1, type: 'path' },  { x: 2, y: 2, type: 'path' },  { x: 2, y: 3, type: 'path' },  { x: 2, y: 4, type: 'path' },  { x: 2, y: 5, type: 'empty' },
      { x: 3, y: 1, type: 'empty' }, { x: 3, y: 2, type: 'empty' }, { x: 3, y: 3, type: 'empty' }, { x: 3, y: 4, type: 'empty' }, { x: 3, y: 5, type: 'empty' },
    ];

    if (challenge.id === 't1-l1-c3') { gridCells[6].type = 'star'; }
    if (challenge.id === 't1-l2-c1') {
      gridCells[5].type = 'stone';
      gridCells[6].type = 'path';
      gridCells[7].type = 'star';
    }
    if (challenge.id === 't1-l2-c2') {
      gridCells[5].type = 'stone';
      gridCells[7].type = 'stone';
      gridCells[6].type = 'path';
      gridCells[8] = { x: 2, y: 5, type: 'star' };
    }
    if (challenge.id === 't1-l3-c3') { gridCells[7].type = 'star'; }
    if (challenge.id === 't1-l4-c2') { gridCells[9] = { x: 2, y: 5, type: 'star' }; }

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '4px',
        backgroundColor: 'var(--bg-deep)',
        border: '3px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '10px',
        width: '100%',
        margin: '16px 0',
        position: 'relative'
      }}>
        {gridCells.map((cell, idx) => {
          const isBloomie = bloomiePos.x === cell.x && bloomiePos.y === cell.y;
          return (
            <div
              key={idx}
              style={{
                aspectRatio: '1',
                borderRadius: '8px',
                backgroundColor: cell.type === 'path' ? '#2e1b5b' : cell.type === 'stone' ? '#450a0a' : 'transparent',
                border: cell.type === 'path' ? '1px dashed rgba(255,255,255,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                fontSize: '20px'
              }}
            >
              {cell.type === 'stone' && '🪨'}
              {cell.type === 'star' && !isBloomie && <span className="bounce-slow">⭐</span>}
              {isBloomie && (
                <div style={{ position: 'absolute', width: '38px', height: '38px', zIndex: 2, transition: 'all 0.5s ease' }}>
                  <Bloomie state={isCompiling ? 'think' : 'neutral'} size={38} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      justifyContent: 'space-between'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '24px', cursor: 'pointer' }}
          >
            ✕
          </button>

          <div style={{ flex: 1, margin: '0 16px' }}>
            <ProgressBar progress={progressPercent} height={10} color="var(--primary)" />
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>❤️ <strong style={{ color: 'var(--error)' }}>{user.hearts}</strong></span>
          </div>
        </div>
        <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center' }}>
          Tantangan {currentChallengeIdx + 1} dari {challenges.length}
        </h4>
      </div>

      {/* Bloomie Dialog Balloon */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', margin: '14px 0', zIndex: 10 }}>
        <div style={{ width: '70px', flexShrink: 0 }}>
          <Bloomie state={feedbackVisible ? (isCorrect ? 'success' : 'error') : 'think'} size={70} />
        </div>
        <div className="mascot-bubble">
          <p style={{ fontSize: '14px', color: 'var(--text-white)', lineHeight: '1.4' }}>
            {challenge.instructions}
          </p>
        </div>
      </div>

      {/* Visual Sandbox lama (CODE_PUZZLE / FILL_IN_BLANK) */}
      {(challenge.type === 'CODE_PUZZLE' || challenge.type === 'FILL_IN_BLANK') && (
        <div style={{ zIndex: 10 }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>
            💻 Visual Sandbox Simulator
          </span>
          {renderVisualGrid()}
        </div>
      )}

      {/* GridSimulator baru (SCRATCH_BLOCK) */}
      {challenge.type === 'SCRATCH_BLOCK' && challenge.gridConfig && (
        <div style={{ zIndex: 10, margin: '8px 0' }}>
          <GridSimulator
            gridConfig={challenge.gridConfig}
            executionResult={scratchExecution}
            isRunning={scratchIsRunning}
            onAnimationComplete={handleScratchAnimationComplete}
          />
        </div>
      )}

      {/* Quest Interactive Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '10px 0', zIndex: 10 }}>

        {challenge.type === 'THEORY' && (
          <div className="playful-card" style={{ textAlign: 'center', padding: '24px' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--accent-cyan)', marginBottom: '10px' }}>Info Ajaib!</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Tekan tombol "Periksa" di bawah untuk lanjut ke latihan berikutnya! Bloomie sangat antusias mengajarmu!
            </p>
          </div>
        )}

        {challenge.type === 'MULTIPLE_CHOICE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {challenge.choices.map((choice, index) => {
              const isSelected = selectedChoice === choice;
              return (
                <div
                  key={index}
                  onClick={() => setSelectedChoice(choice)}
                  className="playful-card"
                  style={{
                    padding: '16px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-panel)',
                    border: isSelected ? '3px solid var(--primary-light)' : '3px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#fff',
                    fontSize: '12px'
                  }}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span style={{ fontSize: '15px', color: 'var(--text-white)' }}>
                    <code>{choice}</code>
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {(challenge.type === 'FILL_IN_BLANK' || challenge.type === 'CODE_PUZZLE') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              backgroundColor: '#0a0518',
              border: '3px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '20px',
              fontFamily: 'monospace',
              fontSize: '14px',
              color: 'var(--accent-cyan)'
            }}>
              <span style={{ color: '#ff79c6' }}>// Kodemu di sini</span>
              <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                {challenge.codeTemplate?.split('[BLANK]').map((part, index, array) => (
                  <React.Fragment key={index}>
                    {part}
                    {index < array.length - 1 && (
                      <span style={{
                        backgroundColor: 'var(--bg-card)',
                        borderBottom: '3px solid var(--primary)',
                        padding: '2px 8px',
                        margin: '0 4px',
                        borderRadius: '4px',
                        color: 'var(--text-white)',
                        fontWeight: 'bold'
                      }}>
                        {blankAnswers[index] || '____'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </pre>
            </div>

            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-kids-header)' }}>
                Ketuk pilihan blok kode di bawah:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {challenge.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setBlankAnswers((prev) => {
                        const nextAnswers = [...prev];
                        if (challenge.type === 'FILL_IN_BLANK' && (challenge.id === 't1-l2-c1' || challenge.id === 't1-l4-c2')) {
                          if (nextAnswers.length < 2) nextAnswers.push(choice);
                        } else {
                          nextAnswers[0] = choice;
                        }
                        return nextAnswers;
                      });
                    }}
                    className="playful-btn"
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      width: 'auto',
                      backgroundColor: 'var(--bg-panel)',
                      boxShadow: '0 4px 0px 0px var(--bg-deep)',
                      border: '2px solid rgba(255,255,255,0.05)',
                      color: 'var(--text-white)'
                    }}
                  >
                    {choice}
                  </button>
                ))}
                {blankAnswers.length > 0 && (
                  <button
                    onClick={() => setBlankAnswers([])}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      borderRadius: '16px',
                      border: 'none',
                      backgroundColor: 'var(--error)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-kids-header)',
                      fontWeight: 'bold'
                    }}
                  >
                    Reset Blok ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SCRATCH_BLOCK: editor Blockly */}
        {challenge.type === 'SCRATCH_BLOCK' && (
          <ScratchBlockEditor onActionsChange={handleScratchActionsChange} />
        )}
      </div>

      {/* Tombol Periksa */}
      <div style={{ marginTop: '16px', zIndex: 10 }}>
        <button
          onClick={handleCheck}
          disabled={!isCheckButtonEnabled()}
          className={`playful-btn ${isCheckButtonEnabled() ? 'playful-btn-primary' : 'playful-btn-disabled'}`}
        >
          {challenge.type === 'SCRATCH_BLOCK' && scratchIsRunning
            ? 'Menjalankan... ⏳'
            : 'Periksa Jawaban'}
        </button>
      </div>

      <BottomFeedback
        isVisible={feedbackVisible}
        isCorrect={isCorrect}
        message={evaluationMsg}
        onContinue={handleContinue}
        onRetry={handleResetChallenge}
      />
    </div>
  );
}