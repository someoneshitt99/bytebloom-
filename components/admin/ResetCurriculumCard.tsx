interface ResetCurriculumCardProps {
    onReset: () => void;
}

export default function ResetCurriculumCard({ onReset }: ResetCurriculumCardProps) {
    const handleClick = () => {
        if (
        confirm(
            'Apakah kamu yakin ingin mereset seluruh kurikulum soal kembali ke default? Seluruh soal kustom buatanmu akan terhapus.'
        )
        ) {
        onReset();
        alert('Kurikulum berhasil direset ke setelan default!');
        }
    };

    return (
        <div className="playful-card" style={{ border: '2px solid var(--error-light)', backgroundColor: '#340f1a' }}>
        <h3 style={{ fontSize: '18px', color: 'var(--error-light)', marginBottom: '8px' }}>
            ⚠️ Pemulihan Data Awal (Reset Database)
        </h3>
        <p style={{ fontSize: '14px', color: '#ffd2dc', lineHeight: '1.5', marginBottom: '16px' }}>
            Jika Anda melakukan kesalahan saat mengubah soal atau tidak sengaja menghapus konten kurikulum
            materi belajar dasar, Anda dapat menyetel ulang kurikulum database kembali ke setelan default
            awal kapan saja.
        </p>
        <button onClick={handleClick} className="playful-btn playful-btn-error" style={{ width: 'auto' }}>
            Reset Kurikulum ke Setelan Awal
        </button>
        </div>
    );
}