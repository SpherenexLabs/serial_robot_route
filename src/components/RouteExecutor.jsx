// import React from 'react';

// const RouteExecutor = ({
//     routes,
//     selectedRouteId,
//     isPlaying,
//     currentMove,
//     timeLeft,
//     statusMessage,
//     executionStateRef,
//     onRouteSelect,
//     onPlay,
//     onPause,
//     onStop
// }) => {

//     const handleRouteSelection = (e) => {
//         const routeId = e.target.value;
//         const selectedRoute = routes.find(r => r.id === routeId);
//         onRouteSelect(routeId, selectedRoute?.name || '');
//     };

//     const playPauseButton = () => {
//         if (!isPlaying && executionStateRef.current.pauseCondition === 'user') {
//             return <button onClick={onPlay}>Resume</button>;
//         }
//         if (isPlaying) {
//             return <button onClick={onPause} className="pause-btn">Pause</button>;
//         }
//         return <button onClick={() => onPlay(selectedRouteId)} disabled={!selectedRouteId}>Play</button>;
//     };

//     return (
//         <div className="route-executor-panel">
//             <h2>Route Executor</h2>
//             <div className="route-selection">
//                 <select
//                     onChange={handleRouteSelection}
//                     value={selectedRouteId}
//                     disabled={isPlaying || executionStateRef.current.isPaused}
//                 >
//                     <option value="">-- Select a Route --</option>
//                     {routes.map(route => (
//                         <option key={route.id} value={route.id}>{route.name}</option>
//                     ))}
//                 </select>
//             </div>
//             <div className="execution-display">
//                 <div className={`status-light ${isPlaying ? 'playing' : ''} ${executionStateRef.current.isPaused ? 'paused' : ''}`}></div>
//                 <div className="move-info">
//                     {(isPlaying || executionStateRef.current.isPaused) && currentMove ? (
//                         <>
//                             <span className="current-status">{statusMessage}</span>
//                             <span className="time-left">{timeLeft}s left</span>
//                         </>
//                     ) : (
//                         statusMessage || 'Ready to Execute'
//                     )}
//                 </div>
//             </div>
//             <div className="execution-controls">
//                 {playPauseButton()}
//                 <button onClick={onStop} disabled={!isPlaying && !executionStateRef.current.isPaused}>Stop</button>
//             </div>

//             {/* Show current route details when selected */}
//             {selectedRouteId && (
//                 <div className="selected-route-details">
//                     <h3>Selected Route</h3>
//                     <div className="route-info">
//                         <p><strong>Route:</strong> {routes.find(r => r.id === selectedRouteId)?.name}</p>
//                         <p><strong>Total Moves:</strong> {routes.find(r => r.id === selectedRouteId)?.moves?.length || 0}</p>
//                         {isPlaying && currentMove && (
//                             <p><strong>Current Move:</strong> {currentMove.direction} ({currentMove.duration}s)</p>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default RouteExecutor;
















import React from 'react';

const RouteExecutor = ({
    routes,
    selectedRouteId,
    isPlaying,
    currentMove,
    timeLeft,
    statusMessage,
    executionStateRef,
    onRouteSelect,
    onPlay,
    onPause,
    onStop,
    isDetectionPaused = false,
    detectionCountdown = 0
}) => {

    const handleRouteSelection = (e) => {
        const routeId = e.target.value;
        const selectedRoute = routes.find(r => r.id === routeId);
        onRouteSelect(routeId, selectedRoute?.name || '');
    };

    const playPauseButton = () => {
        // Disable controls during detection pause
        if (isDetectionPaused) {
            return (
                <button disabled>
                    Paused for Dust Detection ({detectionCountdown}s)
                </button>
            );
        }

        if (!isPlaying && executionStateRef.current.pauseCondition === 'user') {
            return <button onClick={onPlay}>Resume</button>;
        }
        if (isPlaying) {
            return <button onClick={onPause} className="pause-btn">Pause</button>;
        }
        return <button onClick={() => onPlay(selectedRouteId)} disabled={!selectedRouteId}>Play</button>;
    };

    const getStatusDisplay = () => {
        if (isDetectionPaused) {
            return `DUST DETECTED - Resuming in ${detectionCountdown}s`;
        }

        if ((isPlaying || executionStateRef.current.isPaused) && currentMove) {
            return (
                <>
                    <span className="current-status">{statusMessage}</span>
                    <span className="time-left">{timeLeft}s left</span>
                </>
            );
        }

        return statusMessage || 'Ready to Execute';
    };

    return (
        <div className="route-executor-panel">
            <h2>Route Executor</h2>

            {/* Detection Alert - Simple text notification */}
            {isDetectionPaused && (
                <div>
                    <strong>DUST DETECTED ON SOLAR PANEL</strong>
                    <p>Route execution paused for cleaning - Auto-resuming in {detectionCountdown} seconds</p>
                </div>
            )}

            <div className="route-selection">
                <select
                    onChange={handleRouteSelection}
                    value={selectedRouteId}
                    disabled={isPlaying || executionStateRef.current.isPaused || isDetectionPaused}
                >
                    <option value="">-- Select a Route --</option>
                    {routes.map(route => (
                        <option key={route.id} value={route.id}>{route.name}</option>
                    ))}
                </select>
            </div>

            <div className="execution-display">
                <div className={`status-light ${isPlaying ? 'playing' : ''} ${executionStateRef.current.isPaused ? 'paused' : ''}`}></div>
                <div className="move-info">
                    {getStatusDisplay()}
                </div>
            </div>

            <div className="execution-controls">
                {playPauseButton()}
                <button
                    onClick={onStop}
                    disabled={(!isPlaying && !executionStateRef.current.isPaused) || isDetectionPaused}
                >
                    Stop
                </button>
            </div>

            {/* Show current route details when selected */}
            {selectedRouteId && (
                <div className="selected-route-details">
                    <h3>Selected Route</h3>
                    <div className="route-info">
                        <p><strong>Route:</strong> {routes.find(r => r.id === selectedRouteId)?.name}</p>
                        <p><strong>Total Moves:</strong> {routes.find(r => r.id === selectedRouteId)?.moves?.length || 0}</p>
                        {isPlaying && currentMove && (
                            <p><strong>Current Move:</strong> {
                                currentMove.type === 'action' 
                                    ? `${currentMove.action === 'pick' ? '🤏 Pick' : '📍 Place'} (${currentMove.duration || 0}s)`
                                    : `${currentMove.direction || 'Unknown'} (${currentMove.duration || 0}s total)`
                            }</p>
                        )}
                        {isDetectionPaused && (
                            <p><strong>Status:</strong> Paused for dust cleaning - will resume automatically</p>
                        )}
                    </div>
                </div>
            )}

            {/* Detection System Info - Simple text */}
            <div>
                <h4>Dust Detection System</h4>
                <ul>
                    <li>Real-time monitoring via YOLOv8</li>
                    <li>10-second automatic pause for cleaning</li>
                    <li>Resumes from exact stopped point</li>
                </ul>
            </div>
        </div>
    );
};

export default RouteExecutor;