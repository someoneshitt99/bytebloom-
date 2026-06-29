interface TopicFormValues {
    title: string;
    description: string;
    order: number;
}

interface TopicFormModalProps {
    isOpen: boolean;
    isNew: boolean;
    values: TopicFormValues;
    onChange: (values: TopicFormValues) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export default function TopicFormModal({
    isOpen,
    isNew,
    values,
    onChange,
    onSubmit,
    onCancel
}: TopicFormModalProps) {
    if (!isOpen) return null;

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
            maxWidth: '400px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
            }}
        >
            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-kids-header)' }}>
            {isNew ? '➕ Tambah Bab Baru' : '✏️ Ubah Bab'}
            </h3>

            <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Nama Bab:</label>
            <input
                type="text"
                required
                value={values.title}
                onChange={(e) => onChange({ ...values, title: e.target.value })}
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

            <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Deskripsi:</label>
            <textarea
                value={values.description}
                onChange={(e) => onChange({ ...values, description: e.target.value })}
                style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: 'var(--bg-deep)',
                color: '#fff',
                marginTop: '4px',
                height: '80px',
                resize: 'none'
                }}
            />
            </div>

            <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Urutan Tampil (Order):</label>
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