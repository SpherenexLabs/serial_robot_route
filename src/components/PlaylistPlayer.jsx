import { useEffect, useState, useRef, useCallback } from 'react';
import { subscribeToPlaylists } from '../firebase/playlistService';
import { X, Maximize, Minimize } from 'lucide-react';
import './PlaylistPlayer.css';

const PlaylistPlayer = () => {
  const [activePlaylists, setActivePlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef(null);
  const playerRef = useRef(null);
  const fullscreenAttempted = useRef(false);
  const scheduleCheckInterval = useRef(null);

  // Function to check and update active playlists
  const checkSchedule = useCallback((playlists) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = currentHour * 60 + currentMinute; // Convert to minutes

    console.log('PlaylistPlayer - Checking schedule:', {
      totalPlaylists: playlists.length,
      currentDay,
      currentTime: `${currentHour}:${currentMinute}`,
    });

    const activeNow = playlists.filter(playlist => {
      if (!playlist.isActive || !playlist.items || playlist.items.length === 0) {
        return false;
      }

      // Check if current day is in schedule
      if (!playlist.schedule?.days?.includes(currentDay)) {
        return false;
      }

      // Parse schedule times
      const [startHour, startMinute] = (playlist.schedule.start || '09:00').split(':').map(Number);
      const [endHour, endMinute] = (playlist.schedule.end || '17:00').split(':').map(Number);
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      // Check if current time is within schedule
      return currentTime >= startTime && currentTime <= endTime;
    });

    console.log('Active playlists found:', activeNow.length);

    setActivePlaylists(activeNow);

    // Set the first active playlist as current, or update if playlist changed
    if (activeNow.length > 0) {
      setCurrentPlaylist(prev => {
        if (!prev || prev.id !== activeNow[0].id) {
          console.log('✅ Starting playlist:', activeNow[0].name);
          setCurrentItemIndex(0);
          setIsPlaying(true);
          return activeNow[0];
        }
        // Update current playlist with latest data
        return activeNow[0];
      });
    } else {
      setCurrentPlaylist(prev => {
        if (prev) {
          console.log('⏹️ No active playlists, stopping playback');
          setIsPlaying(false);
          return null;
        }
        return prev;
      });
    }
  }, []);

  useEffect(() => {
    let latestPlaylists = [];

    // Subscribe to playlists
    const unsubscribe = subscribeToPlaylists((playlists) => {
      latestPlaylists = playlists;
      console.log('📋 Playlists received from Firebase:', playlists.length);
      checkSchedule(playlists);
    });

    // Check schedule every 10 seconds (more responsive for testing)
    scheduleCheckInterval.current = setInterval(() => {
      console.log('⏰ Periodic schedule check (every 10s)...');
      if (latestPlaylists.length > 0) {
        checkSchedule(latestPlaylists);
      }
    }, 10000); // Check every 10 seconds

    return () => {
      unsubscribe();
      if (scheduleCheckInterval.current) {
        clearInterval(scheduleCheckInterval.current);
      }
    };
  }, []); // Empty dependency - only run once on mount

  useEffect(() => {
    // Auto-play items in sequence
    if (isPlaying && currentPlaylist && currentPlaylist.items && currentPlaylist.items.length > 0) {
      const currentItem = currentPlaylist.items[currentItemIndex];
      
      if (currentItem) {
        const duration = (currentItem.duration || 10) * 1000; // Convert to milliseconds

        timerRef.current = setTimeout(() => {
          // Move to next item or loop
          if (currentItemIndex < currentPlaylist.items.length - 1) {
            setCurrentItemIndex(currentItemIndex + 1);
          } else {
            // Loop back to start if loop is enabled, or stop
            if (currentItem.loop || currentPlaylist.items.some(item => item.loop)) {
              setCurrentItemIndex(0);
            } else {
              setCurrentItemIndex(0); // Always loop for now
            }
          }
        }, duration);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentPlaylist, currentItemIndex]);

  // Auto-enter fullscreen when playlist starts playing
  useEffect(() => {
    const enterFullscreen = async () => {
      if (isPlaying && !fullscreenAttempted.current) {
        fullscreenAttempted.current = true;
        
        console.log('Attempting to enter fullscreen...');
        console.log('Is fullscreen supported?', !!document.documentElement.requestFullscreen);
        console.log('Current fullscreen element:', document.fullscreenElement);
        
        // Try multiple approaches
        setTimeout(async () => {
          try {
            // Method 1: Try document.documentElement
            if (document.documentElement.requestFullscreen) {
              console.log('Trying document.documentElement.requestFullscreen()...');
              await document.documentElement.requestFullscreen();
              setIsFullscreen(true);
              console.log('✅ Fullscreen SUCCESSFUL via document.documentElement');
            } else if (document.documentElement.webkitRequestFullscreen) {
              // Safari
              console.log('Trying webkitRequestFullscreen (Safari)...');
              await document.documentElement.webkitRequestFullscreen();
              setIsFullscreen(true);
              console.log('✅ Fullscreen SUCCESSFUL via webkit');
            } else if (document.documentElement.mozRequestFullScreen) {
              // Firefox
              console.log('Trying mozRequestFullScreen (Firefox)...');
              await document.documentElement.mozRequestFullScreen();
              setIsFullscreen(true);
              console.log('✅ Fullscreen SUCCESSFUL via moz');
            } else if (document.documentElement.msRequestFullscreen) {
              // IE/Edge
              console.log('Trying msRequestFullscreen (IE/Edge)...');
              await document.documentElement.msRequestFullscreen();
              setIsFullscreen(true);
              console.log('✅ Fullscreen SUCCESSFUL via ms');
            }
          } catch (error) {
            console.error('❌ Fullscreen FAILED:', error);
            console.log('Browser blocked automatic fullscreen.');
            console.log('SOLUTION: Either press F11, use kiosk mode, or click the fullscreen button');
            console.log('For kiosk mode, run: chrome --kiosk http://localhost:5173');
          }
        }, 100);
      }
    };

    enterFullscreen();
  }, [isPlaying]);

  const handleClose = () => {
    setIsPlaying(false);
    setCurrentPlaylist(null);
    setCurrentItemIndex(0);
    // Exit fullscreen if active
    if (isFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen on entire document (F11 style)
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  // Handle F11 key press and fullscreen change events
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  // Don't render if no active playlist
  if (!isPlaying || !currentPlaylist || !currentPlaylist.items || currentPlaylist.items.length === 0) {
    return null;
  }

  const currentItem = currentPlaylist.items[currentItemIndex];

  if (!currentItem) {
    return null;
  }

  const renderMedia = () => {
    switch (currentItem.type) {
      case 'image':
        // Skip blob URLs to prevent console errors
        if (!currentItem.url || currentItem.url.startsWith('blob:')) {
          return (
            <div className="player-placeholder">
              <p>{currentItem.name}</p>
              <p className="text-sm text-gray-400">Image unavailable</p>
            </div>
          );
        }
        return (
          <img
            src={currentItem.url}
            alt={currentItem.name}
            className="player-media"
            onError={(e) => {
              e.target.style.display = 'none';
              const placeholder = document.createElement('div');
              placeholder.className = 'player-placeholder';
              placeholder.innerHTML = `<p>${currentItem.name}</p><p class="text-sm text-gray-400">Failed to load image</p>`;
              e.target.parentNode.appendChild(placeholder);
            }}
          />
        );
      
      case 'video':
        // Skip blob URLs to prevent console errors
        if (!currentItem.url || currentItem.url.startsWith('blob:')) {
          return (
            <div className="player-placeholder">
              <p>{currentItem.name}</p>
              <p className="text-sm text-gray-400">Video unavailable</p>
            </div>
          );
        }
        return (
          <video
            key={currentItem.id}
            src={currentItem.url}
            autoPlay
            muted
            onLoadedMetadata={(e) => {
              // Set video start time if specified
              if (currentItem.startTime && currentItem.startTime > 0) {
                e.target.currentTime = currentItem.startTime;
                // Ensure video plays from the start time
                e.target.play().catch(err => console.error('Video play error:', err));
              }
            }}
            onEnded={() => {
              // Move to next item when video ends
              if (currentItemIndex < currentPlaylist.items.length - 1) {
                setCurrentItemIndex(currentItemIndex + 1);
              } else {
                setCurrentItemIndex(0);
              }
            }}
            onError={(e) => {
              console.error('Video load error:', e);
            }}
            className="player-media"
          />
        );
      
      case 'document':
      case 'pdf':
        return (
          <iframe
            src={currentItem.url}
            className="player-media"
            title={currentItem.name}
          />
        );
      
      case 'text':
        return (
          <div
            className="player-text"
            style={{
              backgroundColor: currentItem.textStyle?.backgroundColor || '#1e40af',
              color: currentItem.textStyle?.color || '#ffffff',
              fontSize: `${currentItem.textStyle?.fontSize || 48}px`,
              fontWeight: currentItem.textStyle?.fontWeight || 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              padding: '40px',
              textAlign: 'center',
              wordWrap: 'break-word'
            }}
          >
            {currentItem.textContent || 'No text content'}
          </div>
        );
      
      default:
        return (
          <div className="player-placeholder">
            <p>{currentItem.name}</p>
          </div>
        );
    }
  };

  return (
    <div className="playlist-player" ref={playerRef}>
      <div className="player-header">
        <div className="player-info">
          <span className="player-playlist-name">{currentPlaylist.name}</span>
          <span className="player-item-info">
            Playing: {currentItem.name} ({currentItemIndex + 1}/{currentPlaylist.items.length})
          </span>
        </div>
        <div className="player-controls">
          <button 
            onClick={toggleFullscreen} 
            className="player-control-btn"
            title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Fullscreen (F11)'}
          >
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
          <button onClick={handleClose} className="player-close-btn">
            <X size={24} />
          </button>
        </div>
      </div>
      
      <div className="player-content">
        {renderMedia()}
      </div>

      <div className="player-footer">
        <div className="player-progress">
          <div 
            className="player-progress-bar" 
            style={{ 
              width: `${((currentItemIndex + 1) / currentPlaylist.items.length) * 100}%` 
            }}
          />
        </div>
        <div className="player-status">
          Duration: {currentItem.duration || 10}s | 
          Scheduled: {currentPlaylist.schedule?.start} - {currentPlaylist.schedule?.end}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPlayer;
