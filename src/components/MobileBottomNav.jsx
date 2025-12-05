import React from 'react';
import './MobileBottomNav.css';

const MobileBottomNav = ({ activeView, onViewChange }) => {
    const navItems = [
        {
            id: 'route-creation',
            name: 'Create',
            icon: '🗺️'
        },
        {
            id: 'route-execution',
            name: 'Execute',
            icon: '▶️'
        },
        {
            id: 'route-management',
            name: 'Manage',
            icon: '📂'
        },
        {
            id: 'history-status',
            name: 'History',
            icon: '🖼️'
        },
        {
            id: 'manual-control',
            name: 'Control',
            icon: '🎮'
        }
    ];

    return (
        <nav className="mobile-bottom-nav">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                    onClick={() => onViewChange(item.id)}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.name}</span>
                </button>
            ))}
        </nav>
    );
};

export default MobileBottomNav;