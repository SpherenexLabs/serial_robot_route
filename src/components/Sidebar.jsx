

// // src/components/Sidebar.jsx
// import React, { useState } from 'react';
// import './Sidebar.css';

// const Sidebar = ({ activeView, onViewChange, isCollapsed, onToggleCollapse, isRouteExecuting, executingRouteName }) => {
//     const [hoveredItem, setHoveredItem] = useState(null);

//     const navigationItems = [
//         {
//             id: 'dashboard',
//             name: 'Live Detection',
//             icon: '🛡',
//             description: 'Live detection monitoring',
//             badge: null
//         },
//         {
//             id: 'route-creation',
//             name: 'Route Creation',
//             icon: '🗺',
//             description: 'Create and edit routes',
//             badge: null
//         },
//         {
//             id: 'route-execution',
//             name: 'Route Execution',
//             icon: '▶',
//             description: 'Execute saved routes',
//             badge: isRouteExecuting ? '●' : null
//         },
//         {
//             id: 'route-management',
//             name: 'Route Management',
//             icon: '📂',
//             description: 'Manage saved routes',
//             badge: null
//         },
//         {
//             id: 'settings',
//             name: 'Settings',
//             icon: '⚙',
//             description: 'System configuration',
//             badge: null
//         }
//     ];

//     const handleItemClick = (itemId) => {
//         onViewChange(itemId);
//     };

//     return (
//         <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
//             {/* Sidebar Header */}
//             <div className="sidebar-header">
//                 <div className="logo-container">
//                     <div className="logo-icon">🤖</div>
//                     {!isCollapsed && (
//                         <div className="logo-text">
//                             <span className="logo-title">RoboNav</span>
//                             <span className="logo-subtitle">Control System</span>
//                         </div>
//                     )}
//                 </div>
//                 <button
//                     className="collapse-toggle"
//                     onClick={onToggleCollapse}
//                     title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
//                 >
//                     <span className={`toggle-icon ${isCollapsed ? 'collapsed' : ''}`}>
//                         ◀
//                     </span>
//                 </button>
//             </div>

//             {/* Route Execution Status */}
//             {isRouteExecuting && (
//                 <div className="execution-status-bar">
//                     <div className="execution-indicator">
//                         <div className="execution-pulse"></div>
//                         {!isCollapsed && (
//                             <div className="execution-text">
//                                 <span className="execution-label">Executing</span>
//                                 <span className="execution-route">{executingRouteName}</span>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Navigation Menu */}
//             <nav className="sidebar-nav">
//                 <ul className="nav-list">
//                     {navigationItems.map((item) => (
//                         <li key={item.id} className="nav-item">
//                             <button
//                                 className={`nav-button ${activeView === item.id ? 'active' : ''} ${item.id === 'route-execution' && isRouteExecuting ? 'executing' : ''}`}
//                                 onClick={() => handleItemClick(item.id)}
//                                 onMouseEnter={() => setHoveredItem(item.id)}
//                                 onMouseLeave={() => setHoveredItem(null)}
//                                 title={isCollapsed ? item.name : ''}
//                             >
//                                 <span className="nav-icon">{item.icon}</span>
//                                 {!isCollapsed && (
//                                     <div className="nav-content">
//                                         <span className="nav-name">{item.name}</span>
//                                         <span className="nav-description">{item.description}</span>
//                                     </div>
//                                 )}
//                                 {item.badge && (
//                                     <span className={`nav-badge ${item.id === 'route-execution' && isRouteExecuting ? 'executing' : ''}`}>{item.badge}</span>
//                                 )}

//                                 {/* Active Indicator */}
//                                 {activeView === item.id && (
//                                     <div className="active-indicator"></div>
//                                 )}
//                             </button>

//                             {/* Tooltip for collapsed state */}
//                             {isCollapsed && hoveredItem === item.id && (
//                                 <div className="nav-tooltip">
//                                     <div className="tooltip-content">
//                                         <span className="tooltip-title">{item.name}</span>
//                                         <span className="tooltip-description">{item.description}</span>
//                                         {isRouteExecuting && item.id === 'route-execution' && (
//                                             <span className="tooltip-execution">Executing: {executingRouteName}</span>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             </nav>

//             {/* Sidebar Footer */}
//             <div className="sidebar-footer">
//                 {!isCollapsed && (
//                     <div className="footer-content">
//                         <div className="system-status">
//                             <div className="status-indicator online"></div>
//                             <span className="status-text">System Online</span>
//                         </div>
//                         <div className="version-info">
//                             v2.1.0
//                         </div>
//                     </div>
//                 )}
//                 {isCollapsed && (
//                     <div className="footer-collapsed">
//                         <div className="status-indicator online"></div>
//                     </div>
//                 )}
//             </div>

//             {/* Sidebar Background Overlay */}
//             <div className="sidebar-overlay"></div>
//         </div>
//     );
// };

// export default Sidebar;





// import React, { useState } from 'react';
// import './Sidebar.css';

// const Sidebar = ({
//     activeView,
//     onViewChange,
//     isCollapsed,
//     onToggleCollapse,
//     isRouteExecuting,
//     executingRouteName,
//     currentMove,
//     timeLeft,
//     statusMessage,
//     onStop,
//     onPause,
//     onPlay,
//     isPaused
// }) => {
//     const [hoveredItem, setHoveredItem] = useState(null);

//     const navigationItems = [
//         {
//             id: 'dashboard',
//             name: 'Dashboard',
//             description: 'System overview',
//             icon: '📊',
//             badge: null
//         },
//         {
//             id: 'route-creation',
//             name: 'Route Creation',
//             description: 'Create new routes',
//             icon: '🗺️',
//             badge: null
//         },
//         {
//             id: 'route-execution',
//             name: 'Route Execution',
//             description: 'Execute saved routes',
//             icon: '▶️',
//             badge: isRouteExecuting ? 'ACTIVE' : null,
//             badgeClass: isRouteExecuting ? 'executing' : null
//         },
//         {
//             id: 'route-management',
//             name: 'Route Management',
//             description: 'Manage routes',
//             icon: '📂',
//             badge: null
//         },
//         {
//             id: 'settings',
//             name: 'Settings',
//             description: 'System configuration',
//             icon: '⚙️',
//             badge: null
//         }
//     ];

//     const handleNavigation = (viewId) => {
//         onViewChange(viewId);
//     };

//     const renderExecutionStatus = () => {
//         if (!isRouteExecuting && !isPaused) return null;

//         if (isCollapsed) {
//             return (
//                 <div className="execution-status-sidebar">
//                     <div className="execution-collapsed">
//                         <div className="execution-icon-small">🤖</div>
//                         <div className="execution-pulse-small"></div>
//                     </div>
//                 </div>
//             );
//         }

//         return (
//             <div className="execution-status-sidebar">
//                 <div className="execution-info">
//                     <div className="execution-header">
//                         <div className="execution-icon">🤖</div>
//                         <div className="execution-text">Route Executing</div>
//                         <div className="execution-pulse"></div>
//                     </div>

//                     <div className="execution-details">
//                         <div className="route-name">{executingRouteName}</div>
//                         <div className="current-action">{statusMessage}</div>
//                         {currentMove && timeLeft > 0 && (
//                             <div className="current-action">{timeLeft}s remaining</div>
//                         )}
//                     </div>

//                     {/* Execution Controls in Sidebar */}
//                     <div className="execution-controls-sidebar">
//                         {!isRouteExecuting && isPaused ? (
//                             <button onClick={onPlay} className="resume-btn">Resume</button>
//                         ) : isRouteExecuting ? (
//                             <button onClick={onPause} className="pause-btn">Pause</button>
//                         ) : null}
//                         <button onClick={onStop} className="stop-btn">Stop</button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const renderNavItem = (item) => {
//         const isActive = activeView === item.id;
//         const isExecuting = item.id === 'route-execution' && isRouteExecuting;

//         return (
//             <li key={item.id} className="nav-item">
//                 {isActive && <div className="active-indicator"></div>}

//                 <button
//                     className={`nav-button ${isActive ? 'active' : ''} ${isExecuting ? 'executing' : ''}`}
//                     onClick={() => handleNavigation(item.id)}
//                     onMouseEnter={() => setHoveredItem(item.id)}
//                     onMouseLeave={() => setHoveredItem(null)}
//                 >
//                     <div className="nav-icon">{item.icon}</div>

//                     <div className="nav-content">
//                         <div className="nav-name">{item.name}</div>
//                         <div className="nav-description">{item.description}</div>
//                     </div>

//                     {item.badge && (
//                         <div className={`nav-badge ${item.badgeClass || ''}`}>
//                             {item.badge}
//                         </div>
//                     )}
//                 </button>

//                 {/* Tooltip for collapsed state */}
//                 {isCollapsed && hoveredItem === item.id && (
//                     <div className="nav-tooltip">
//                         <div className="tooltip-content">
//                             <div className="tooltip-title">{item.name}</div>
//                             <div className="tooltip-description">{item.description}</div>
//                             {item.badge && (
//                                 <div className="tooltip-badge">{item.badge}</div>
//                             )}
//                             {isExecuting && (
//                                 <div className="tooltip-execution">Currently executing: {executingRouteName}</div>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </li>
//         );
//     };

//     return (
//         <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
//             <div className="sidebar-overlay"></div>

//             {/* Header */}
//             <header className="sidebar-header">
//                 <div className="logo-container">
//                     <div className="logo-icon">🤖</div>
//                     <div className="logo-text">
//                         <div className="logo-title">RobotNav</div>
//                         <div className="logo-subtitle">Control System</div>
//                     </div>
//                 </div>

//                 <button
//                     className="collapse-toggle"
//                     onClick={onToggleCollapse}
//                     aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//                 >
//                     <div className={`toggle-icon ${isCollapsed ? 'collapsed' : ''}`}>←</div>
//                 </button>
//             </header>

//             {/* Navigation */}
//             <nav className="sidebar-nav">
//                 <ul className="nav-list">
//                     {navigationItems.map(renderNavItem)}
//                 </ul>
//             </nav>

//             {/* Execution Status */}
//             {renderExecutionStatus()}

//             {/* Footer */}
//             <footer className="sidebar-footer">
//                 <div className="footer-content">
//                     <div className="system-status">
//                         <div className="status-indicator online"></div>
//                         <div className="status-text">System Online</div>
//                     </div>
//                     <div className="version-info">v2.1.0</div>
//                 </div>

//                 <div className="footer-collapsed">
//                     <div className="status-indicator online"></div>
//                 </div>
//             </footer>
//         </aside>
//     );
// };

// export default Sidebar;






import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({
    activeView,
    onViewChange,
    isCollapsed,
    onToggleCollapse,
    isRouteExecuting,
    executingRouteName,
    currentMove,
    timeLeft,
    statusMessage,
    onStop,
    onPause,
    onPlay,
    isPaused,
    isMobileMenuOpen = false,
    onCloseMobileMenu
}) => {
    const [hoveredItem, setHoveredItem] = useState(null);

    const navigationItems = [
        {
            id: 'route-creation',
            name: 'Route Creation',
            description: 'Create new routes',
            icon: '🗺️',
            badge: null
        },
        {
            id: 'route-execution',
            name: 'Route Execution',
            description: 'Execute saved routes',
            icon: '▶️',
            badge: isRouteExecuting ? 'ACTIVE' : null,
            badgeClass: isRouteExecuting ? 'executing' : null
        },
        {
            id: 'route-management',
            name: 'Route Management',
            description: 'Manage routes',
            icon: '📂',
            badge: null
        },
        {
            id: 'history-status',
            name: 'History Status',
            description: 'Captured image log',
            icon: '🖼️',
            badge: null
        },
        {
            id: 'manual-control',
            name: 'Manual Control',
            description: 'Direct robot movement',
            icon: '🎮',
            badge: null
        },
        // {
        //     id: 'settings',
        //     name: 'Settings',
        //     description: 'System configuration',
        //     icon: '⚙️',
        //     badge: null
        // }
    ];

    const handleNavigation = (viewId) => {
        onViewChange(viewId);
    };

    const renderExecutionStatus = () => {
        if (!isRouteExecuting && !isPaused) return null;

        if (isCollapsed) {
            return (
                <div className="execution-status-sidebar">
                    <div className="execution-collapsed">
                        <div className="execution-icon-small">🤖</div>
                        <div className="execution-pulse-small"></div>
                    </div>
                </div>
            );
        }

        return (
            <div className="execution-status-sidebar">
                <div className="execution-info">
                    <div className="execution-header">
                        <div className="execution-icon">🤖</div>
                        <div className="execution-text">Route Executing</div>
                        <div className="execution-pulse"></div>
                    </div>

                    <div className="execution-details">
                        <div className="route-name">{executingRouteName}</div>
                        <div className="current-action">{statusMessage}</div>
                        {currentMove && timeLeft > 0 && (
                            <div className="current-action">{timeLeft}s remaining</div>
                        )}
                    </div>

                    {/* Execution Controls in Sidebar */}
                    <div className="execution-controls-sidebar">
                        {/* {!isRouteExecuting && isPaused ? (
                            <button onClick={onPlay} className="resume-btn">Resume</button>
                        ) : isRouteExecuting ? (
                            <button onClick={onPause} className="pause-btn">Pause</button>
                        ) : null} */}
                        <button onClick={onStop} className="stop-btn">Stop</button>
                    </div>
                </div>
            </div>
        );
    };

    const renderNavItem = (item) => {
        const isActive = activeView === item.id;
        const isExecuting = item.id === 'route-execution' && isRouteExecuting;

        return (
            <li key={item.id} className="nav-item">
                {isActive && <div className="active-indicator"></div>}

                <button
                    className={`nav-button ${isActive ? 'active' : ''} ${isExecuting ? 'executing' : ''}`}
                    onClick={() => handleNavigation(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <div className="nav-icon">{item.icon}</div>

                    <div className="nav-content">
                        <div className="nav-name">{item.name}</div>
                        <div className="nav-description">{item.description}</div>
                    </div>

                    {item.badge && (
                        <div className={`nav-badge ${item.badgeClass || ''}`}>
                            {item.badge}
                        </div>
                    )}
                </button>

                {/* Tooltip for collapsed state */}
                {isCollapsed && hoveredItem === item.id && (
                    <div className="nav-tooltip">
                        <div className="tooltip-content">
                            <div className="tooltip-title">{item.name}</div>
                            <div className="tooltip-description">{item.description}</div>
                            {item.badge && (
                                <div className="tooltip-badge">{item.badge}</div>
                            )}
                            {isExecuting && (
                                <div className="tooltip-execution">Currently executing: {executingRouteName}</div>
                            )}
                        </div>
                    </div>
                )}
            </li>
        );
    };

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-overlay"></div>

            {/* Header */}
            <header className="sidebar-header">
                <div className="logo-container">
                    <div className="logo-icon">🤖</div>
                    <div className="logo-text">
                        <div className="logo-title">Admin Dashboard</div>
                        <div className="logo-subtitle">Control System</div>
                    </div>
                </div>

                {/* Close button for mobile */}
                <button
                    className="collapse-toggle mobile-close-btn"
                    onClick={onCloseMobileMenu || onToggleCollapse}
                    aria-label="Close menu"
                >
                    <div className="toggle-icon">✕</div>
                </button>
            </header>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {navigationItems.map(renderNavItem)}
                </ul>
            </nav>

            {/* Execution Status */}
            {renderExecutionStatus()}

            {/* Footer */}
            <footer className="sidebar-footer">
                <div className="footer-content">
                    <div className="system-status">
                        <div className="status-indicator online"></div>
                        <div className="status-text">System Online</div>
                    </div>
                    <div className="version-info">v2.1.0</div>
                </div>

                <div className="footer-collapsed">
                    <div className="status-indicator online"></div>
                </div>
            </footer>
        </aside>
    );
};

export default Sidebar;