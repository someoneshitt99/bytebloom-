import { ChallengeType } from '@/context/GameContext';

interface ChallengeFormValues {
    lessonId: string;
    type: ChallengeType;
    order: number;
    instructions: string;
    codeTemplate: string;
    correctAnswer: string;
    choices: string; // comma-separated di form
}

interface ChallengeFormModalProps {
    isOpen: boolean;
    isNew: boolean;
    values: ChallengeFormValues;
    onChange: (values: ChallengeFormValues) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

const CHALLENGE_TYPES: ChallengeType[] = ['THEORY', 'MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'CODE_PUZZLE'];

export default function ChallengeFormModal({
    isOpen,
    isNew,
    values,
    onChange,
    onSubmit,
    onCancel
    }: ChallengeFormModalProps) {
    if (!isOpen) return null;

    const showCodeTemplate = values.type === 'CODE_PUZZLE' || values.type === 'FILL_IN_BLANK';
    const showAnswerFields = values.type !== 'THEORY';

    return (
        <div
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
        }}
        >
        <form
            onSubmit={onSubmit}
            style={{
            backgroundColor: 'var(--bg-panel)',
            border: '3px solid var(--primary)',
            borderRadius: '24px',
            padding: '24px',
            maxWidth: '460px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxHeight: '90vh',
            overflowY: 'auto'
            }}
        >
            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-kids-header)' }}>
            {isNew ? '➕ Buat Soal Tantangan' : '✏️ Ubah Soal Tantangan'}
            </h3>

            {/* Type selector */}
            <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tipe Soal:</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {CHALLENGE_TYPES.map((type) => (
                <button
                    key={type}
                    type="button"
                    onClick={() => onChange({ ...values, type })}
                    style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '8px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: values.type === type ? 'var(--primary)' : 'var(--bg-deep)',
                    color: values.type === type ? '#fff' : 'var(--text-muted)'
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
                value={values.instructions}
                onChange={(e) => onChange({ ...values, instructions: e.target.value })}
                style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: 'var(--bg-deep)',
                color: '#fff',
                marginTop: '4px',
                height: '60px',
                resize: 'none'
                }}
            />
            </div>

            {/* Conditional field: Code Template (for CODE_PUZZLE or FILL_IN_BLANK) */}
            {showCodeTemplate && (
            <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Template Kode HTML/JS (Gunakan [BLANK] untuk bagian rumpang):
                </label>
                <input
                type="text"
                placeholder="Contoh: <p>Aku [BLANK] HTML</p>"
                value={values.codeTemplate}
                onChange={(e) => onChange({ ...values, codeTemplate: e.target.value })}
                style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'var(--bg-deep)',
                    color: '#fff',
                    marginTop: '4px'
                }}
                />
            </div>
            )}

            {/* Correct Answer */}
            {showAnswerFields && (
            <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Jawaban Benar (Pisahkan dengan koma jika ada 2 rumpang/blank):
                </label>
                <input
                type="text"
                required
                placeholder="Contoh: h1 atau main,main"
                value={values.correctAnswer}
                onChange={(e) => onChange({ ...values, correctAnswer: e.target.value })}
                style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'var(--bg-deep)',
                    color: '#fff',
                    marginTop: '4px'
                }}
                />
            </div>
            )}

            {/* Choices list */}
            {showAnswerFields && (
            <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Pilihan Jawaban / Blok Geser (Pisahkan dengan koma):
                </label>
                <input
                type="text"
                required
                placeholder="Contoh: main, h1, body, p"
                value={values.choices}
                onChange={(e) => onChange({ ...values, choices: e.target.value })}
                style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'var(--bg-deep)',
                    color: '#fff',
                    marginTop: '4px'
                }}
                />
            </div>
            )}

            <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Urutan (Order):</label>
            <input
                type="number"
                required
                value={values.order}
                onChange={(e) => onChange({ ...values, order: Number(e.target.value) })}
                style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: 'var(--bg-deep)',
                color: '#fff',
                marginTop: '4px'
                }}
            />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" className="playful-btn playful-btn-success" style={{ flex: 1 }}>
                Simpan
            </button>
            <button type="button" onClick={onCancel} className="playful-btn playful-btn-muted" style={{ flex: 1 }}>
                Batal
            </button>
            </div>
        </form>
        </div>
    );
}