import type { ReactNode } from 'react';

export type DashboardTab = 'learn' | 'medals' | 'profile';

interface BottomNavProps {
    activeTab: DashboardTab;
    onTabChange: (tab: DashboardTab) => void;
}

interface NavItem {
    tab: DashboardTab;
    icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    {
        tab: 'learn',
        icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path
            d="M3 10.182V20a1 1 0 001 1h5v-6h4v6h5a1 1 0 001-1v-9.818a1 1 0 00-.316-.725l-7-6.364a1 1 0 00-1.368 0l-7 6.364A1 1 0 003 10.182z"
            fill="#00E5FF"
            />
        </svg>
        )
    },
    {
        tab: 'medals',
        icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9" r="6" fill="#FFC107" />
            <path d="M8 14l-2 7 6-3 6 3-2-7" fill="#E23E57" />
            <polygon
            points="12,5 13.5,8 16.5,8.5 14,10.5 15,13.5 12,11.5 9,13.5 10,10.5 7.5,8.5 10.5,8"
            fill="#FFF"
            />
        </svg>
        )
    },
    {
        tab: 'profile',
        icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="7" r="5" fill="#FF8D7A" />
            <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#2979FF" />
        </svg>
        )
    }
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    return (
        <div
        style={{
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
        }}
        >
        {NAV_ITEMS.map(({ tab, icon }) => (
            <div
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                opacity: activeTab === tab ? 1 : 0.6,
                transform: activeTab === tab ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s'
            }}
            >
            {icon}
            </div>
        ))}
        </div>
    );
}