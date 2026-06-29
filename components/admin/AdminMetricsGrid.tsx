interface AdminMetricsGridProps{
    totalTopics: number;
    totalLessons: number;
    totalChallenges: number;
}

interface MetricItem {
    icon: string;
    value: number;
    label: string;
    color: string;
}

export default function AdminMetricsGrid({
    totalTopics,
    totalLessons,
    totalChallenges
}: AdminMetricsGridProps) {
    const metrics: MetricItem[] = [
        { icon: '📖', value: totalTopics, label: 'Total Bab (Sections)', color: 'var(--accent-cyan)' },
        { icon: '🪜', value: totalLessons, label: 'Total Level (Lessons)', color: 'var(--accent-yellow)' },
        { icon: '🧩', value: totalChallenges, label: 'Total Soal Tantangan', color: 'var(--success-light)' }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {metrics.map((metric) => (
                <div
                key={metric.label}
                className="playful-card"
                style={{ backgroundColor: 'var(--bg-panel)', textAlign: 'center' }}
                >
                <span style={{ fontSize: '32px' }}>{metric.icon}</span>
                <h3 style={{ fontSize: '24px', margin: '8px 0 4px 0', color: metric.color }}>
                    {metric.value}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{metric.label}</p>
                </div>
            ))}
        </div>
    );
}