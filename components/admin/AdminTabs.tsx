export type AdminTab = 'overview' | 'curriculum';

interface AdminTabsProps {
    activeTab: AdminTab;
    onTabChange: (tab: AdminTab) => void;
}

interface TabItem {
    tab: AdminTab;
    label: string;
}

const TABS: TabItem[] = [
    { tab: 'overview', label: '📊 Ringkasan' },
    { tab: 'curriculum', label: '🗺️ Kurikulum & Soal' }
];

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
    return (
        <div
        style={{
            display: 'flex',
            backgroundColor: 'var(--bg-panel)',
            borderRadius: '16px',
            padding: '6px',
            marginBottom: '24px',
            maxWidth: '400px',
            border: '2px solid rgba(255, 255, 255, 0.05)'
        }}
        >
        {TABS.map(({ tab, label }) => (
            <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
                flex: 1,
                padding: '10px',
                borderRadius: '12px',
                border: 'none',
                fontFamily: 'var(--font-kids-header)',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === tab ? 'var(--primary)' : 'transparent',
                color: activeTab === tab ? 'var(--text-white)' : 'var(--text-muted)',
                transition: 'all 0.2s'
            }}
            >
            {label}
            </button>
        ))}
        </div>
    );
}