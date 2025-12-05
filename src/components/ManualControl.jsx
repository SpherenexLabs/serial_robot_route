import React, { useState } from 'react';
import { db } from '../services/firebase';
import { ref, update } from 'firebase/database';
import { serialComm } from '../services/serialCommunication';
import './ManualControl.css';

const ManualControl = () => {
    const [lastCommand, setLastCommand] = useState('');
    const [commandTime, setCommandTime] = useState('');

    const sendDirection = async (direction) => {
        try {
            // Non-destructive write: update only specific fields under Picking_Robot
            await update(ref(db, 'Picking_Robot'), {
                Movements: direction,
                duration: 0, // Manual commands don't have duration
                timestamp: new Date().toISOString(),
                manual: true // Flag to indicate manual control
            });

            // Send via serial communication
            serialComm.sendMovement(direction).catch(err =>
                console.log('Serial send failed (port may not be connected):', err)
            );

            setLastCommand(direction);
            setCommandTime(new Date().toLocaleTimeString());
            console.log(`Manual command sent: ${direction}`);
        } catch (error) {
            console.error('Error sending direction to Firebase:', error);
            alert('Failed to send command. Please check your connection.');
        }
    };

    const setIdle = async () => {
        try {
            // Non-destructive write on idle as well
            await update(ref(db, 'Picking_Robot'), {
                Movements: 'S',
                duration: 0,
                timestamp: new Date().toISOString(),
                manual: true
            });

            // Send via serial communication
            serialComm.sendMovement('S').catch(err =>
                console.log('Serial send failed (port may not be connected):', err)
            );

            serialComm.sendMovement('').catch(err =>
                console.log('Serial send failed (port may not be connected):', err)
            );

            // setLastCommand('IDLE');
            // setCommandTime(new Date().toLocaleTimeString());
            // console.log('Robot set to idle');
        } catch (error) {
            console.error('Error setting robot to idle:', error);
            alert('Failed to set robot to idle. Please check your connection.');
        }
    };

    const sendPickCommand = async () => {
        try {
            // Send P0 to Picking_Robot/picking path
            await update(ref(db, 'Picking_Robot'), {
                picking: 'P1',
                timestamp: new Date().toISOString(),
                manual: true
            });

            serialComm.sendMovement('P1').catch(err =>
                console.log('Serial send failed (port may not be connected):', err)
            );
            // setLastCommand('P0');
            // setCommandTime(new Date().toLocaleTimeString());
            console.log('Pick command sent: P1');
        } catch (error) {
            console.error('Error sending pick command:', error);
            alert('Failed to send pick command. Please check your connection.');
        }
    };

    const sendPlaceCommand = async () => {
        try {
            // Send P1 to Picking_Robot/picking path
            await update(ref(db, 'Picking_Robot'), {
                picking: 'P0',
                timestamp: new Date().toISOString(),
                manual: true
            });

            serialComm.sendMovement('P0').catch(err =>
                console.log('Serial send failed (port may not be connected):', err)
            );
            // setLastCommand('P1');
            // setCommandTime(new Date().toLocaleTimeString());
            console.log('Place command sent: P0');
        } catch (error) {
            console.error('Error sending place command:', error);
            alert('Failed to send place command. Please check your connection.');
        }
    };

    return (
        <div className="manual-control-panel">
            <div className="manual-control-container">
                <div className="control-section">
                    <h2>Manual Robot Control</h2>
                    <p className="control-description">
                        Use the directional buttons below to manually control the robot movement.
                        Each button sends an immediate command to the robot.
                    </p>

                    <div className="manual-movement-controls">
                        <div className="control-row top-row">
                            <button
                                className="direction-btn btn-left"
                                onClick={() => sendDirection('L')}
                                title="Turn Left"
                            >
                                Left
                            </button>
                        </div>

                        <div className="control-row middle-row">
                            <button
                                className="direction-btn btn-forward"
                                onClick={() => sendDirection('F')}
                                title="Move Forward"
                            >
                                Forward
                            </button>

                            <button
                                className="direction-btn btn-idle"
                                onClick={setIdle}
                                title="Stop"
                            >
                                Stop
                            </button>
                            <button
                                className="direction-btn btn-backward"
                                onClick={() => sendDirection('B')}
                                title="Move Backward"
                            >
                                Backward
                            </button>

                        </div>

                        <div className="control-row bottom-row">
                            <button
                                className="direction-btn btn-right"
                                onClick={() => sendDirection('R')}
                                title="Turn Right"
                            >
                                Right
                            </button>
                        </div>
                    </div>

                    {/* Pick and Place Controls */}
                    <div className="pick-place-controls">
                        <h3>Pick & Place Actions</h3>
                        <div className="pick-place-buttons">
                            <button
                                className="action-btn btn-pick"
                                onClick={sendPickCommand}
                                title="Pick Object"
                            >
                                🤏 Pick
                            </button>
                            <button
                                className="action-btn btn-place"
                                onClick={sendPlaceCommand}
                                title="Place Object"
                            >
                                📍 Place
                            </button>
                        </div>
                    </div>

                    {/* {lastCommand && (
                        <div className="command-status">
                            <div className="status-indicator">
                                <h3>Last Command</h3>
                                <div className="status-details">
                                    <span className="command-sent">Command: <strong>{lastCommand}</strong></span>
                                    <span className="command-timestamp">Time: {commandTime}</span>
                                </div>
                            </div>
                        </div>
                    )} */}

                    <div className="control-info">
                        <div className="info-card">
                            <h4>📋 Control Instructions</h4>
                            <ul>
                                <li><strong>Forward:</strong> Sends "F" - Robot moves forward</li>
                                <li><strong>Left:</strong> Sends "L" - Robot turns left</li>
                                <li><strong>Right:</strong> Sends "R" - Robot turns right</li>
                                <li><strong>Backward:</strong> Sends "B" - Robot moves backward</li>
                                <li><strong>Stop:</strong> Sets robot to idle state</li>
                                <li><strong>Pick:</strong> Sends "P0" - Activates picking mechanism</li>
                                <li><strong>Place:</strong> Sends "P1" - Activates placing mechanism</li>
                            </ul>
                        </div>

                        <div className="info-card">
                            <h4>⚠️ Safety Notes</h4>
                            <ul>
                                <li>Commands are sent immediately when buttons are pressed</li>
                                <li>Use the Idle button to set robot to neutral state</li>
                                <li>Manual control overrides automatic route execution</li>
                                <li>Ensure clear path before sending movement commands</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManualControl;