import React, { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../services/firebase';
import './HistoryStatus.css';

const HISTORY_PATH = 'Picking_Robot/Video/captures';

const timestampToMillis = (value) => {
    if (value === undefined || value === null) {
        return 0;
    }

    if (typeof value === 'number') {
        return value < 1e12 ? value * 1000 : value;
    }

    if (typeof value === 'string') {
        const numeric = Number(value);
        if (!Number.isNaN(numeric)) {
            return timestampToMillis(numeric);
        }

        const parsed = Date.parse(value);
        if (!Number.isNaN(parsed)) {
            return parsed;
        }
    }

    return 0;
};

const buildImageSrc = (capture) => {
    if (!capture) {
        return '';
    }

    const { image_url: imageUrl, image_base64: imageBase64 } = capture;

    if (typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
        return imageUrl.trim();
    }

    if (typeof imageBase64 === 'string' && imageBase64.trim().length > 0) {
        const trimmed = imageBase64.trim();
        if (trimmed.startsWith('data:')) {
            return trimmed;
        }
        return `data:image/jpeg;base64,${trimmed}`;
    }

    return '';
};

const parseTimestamp = (rawTimestamp) => {
    if (!rawTimestamp) {
        return 'Unknown time';
    }

    if (typeof rawTimestamp === 'string') {
        const numeric = Number(rawTimestamp);
        if (!Number.isNaN(numeric)) {
            return parseTimestamp(numeric);
        }
        const dateFromString = new Date(rawTimestamp);
        if (!Number.isNaN(dateFromString.getTime())) {
            return dateFromString.toLocaleString();
        }
        return rawTimestamp;
    }

    if (typeof rawTimestamp === 'number') {
        const isSeconds = rawTimestamp < 1e12;
        const date = new Date(isSeconds ? rawTimestamp * 1000 : rawTimestamp);
        if (!Number.isNaN(date.getTime())) {
            return date.toLocaleString();
        }
    }

    return 'Unknown time';
};

const getPermissionStatus = (permission) => {
    if (permission === 0 || permission === '0') {
        return { text: 'Accepted', class: 'status-accepted', icon: '✓' };
    } else if (permission === 1 || permission === '1') {
        return { text: 'Pending', class: 'status-pending', icon: '⏳' };
    } else if (permission === 2 || permission === '2') {
        return { text: 'Rejected', class: 'status-rejected', icon: '✗' };
    }
    return { text: 'Unknown', class: 'status-unknown', icon: '?' };
};

const HistoryStatus = ({ showHeader = true }) => {
    const [captures, setCaptures] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState({});

    const handleImageError = (captureId) => {
        setImageErrors(prev => ({ ...prev, [captureId]: true }));
    };

    useEffect(() => {
        const capturesRef = ref(db, HISTORY_PATH);
        const permissionRef = ref(db, 'Picking_Robot/Permission');
        
        const capturesListener = onValue(
            capturesRef,
            (snapshot) => {
                const data = snapshot.val();
                const parsedCaptures = data
                    ? Object.entries(data).map(([key, value]) => ({
                          id: key,
                          ...value,
                      }))
                    : [];

                parsedCaptures.sort((a, b) => timestampToMillis(b.timestamp) - timestampToMillis(a.timestamp));

                setCaptures(parsedCaptures);
                setIsLoading(false);
            },
            (error) => {
                console.error('Failed to load capture history:', error);
                setCaptures([]);
                setIsLoading(false);
            }
        );

        return () => {
            off(capturesRef, 'value', capturesListener);
        };
    }, []);

    return (
        <section className="history-status">
            {showHeader && (
                <header className="history-status__header">
                    <h1>History Status</h1>
                    <p>Recent detections captured by the robot camera are shown here.</p>
                </header>
            )}

            {isLoading ? (
                <div className="history-status__message">Loading capture history...</div>
            ) : captures.length === 0 ? (
                <div className="history-status__message">No captures available yet.</div>
            ) : (
                <div className="history-status__grid">
                    {captures
                        .filter((capture) => {
                            // Filter out rejected captures (Permission = 2)
                            const permission = capture.Permission ?? capture.permission;
                            return permission !== 2 && permission !== '2';
                        })
                        .map((capture) => {
                            const imageSrc = buildImageSrc(capture);
                            const displayName = capture.display_name || capture.detected_name || 'Unknown subject';
                            const timestamp = parseTimestamp(capture.timestamp);
                            const hasImageError = imageErrors[capture.id];
                            const permission = capture.Permission ?? capture.permission;
                            const permissionStatus = getPermissionStatus(permission);

                            return (
                                <article key={capture.id} className="history-card">
                                    {imageSrc && !hasImageError ? (
                                        <img
                                            src={imageSrc}
                                            alt={`Capture of ${displayName}`}
                                            className="history-card__preview"
                                            onError={() => handleImageError(capture.id)}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="history-card__placeholder">
                                            {hasImageError ? 'Failed to load image' : 'Image unavailable'}
                                        </div>
                                    )}
                                    <div className="history-card__details">
                                        <h2 className="history-card__title" title={displayName}>
                                            {displayName}
                                        </h2>
                                        {capture.filename && (
                                            <p className="history-card__filename" title={capture.filename}>
                                                {capture.filename}
                                            </p>
                                        )}
                                        <div className={`history-card__status ${permissionStatus.class}`}>
                                            <span className="status-icon">{permissionStatus.icon}</span>
                                            <span className="status-text">{permissionStatus.text}</span>
                                        </div>
                                        <p className="history-card__timestamp">{timestamp}</p>
                                    </div>
                                </article>
                            );
                        })}
                </div>
            )}
        </section>
    );
};

export default HistoryStatus;
