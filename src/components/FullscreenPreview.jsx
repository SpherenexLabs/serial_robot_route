import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const FullscreenPreview = ({ media, onClose }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Debug: Log media object
    console.log('FullscreenPreview media:', media);
    
    // Enter fullscreen mode
    const enterFullscreen = async () => {
      try {
        if (containerRef.current) {
          // Add a small delay to ensure DOM is ready
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (containerRef.current.requestFullscreen) {
            await containerRef.current.requestFullscreen();
          } else if (containerRef.current.webkitRequestFullscreen) {
            await containerRef.current.webkitRequestFullscreen();
          } else if (containerRef.current.msRequestFullscreen) {
            await containerRef.current.msRequestFullscreen();
          }
        }
      } catch (error) {
        console.error('Error entering fullscreen:', error);
        // Don't throw error, just continue without fullscreen
      }
    };

    enterFullscreen();

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        exitFullscreen();
        onClose();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && 
          !document.webkitFullscreenElement && 
          !document.msFullscreenElement) {
        // Delay the onClose to avoid "Document not active" errors
        setTimeout(() => onClose(), 100);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      document.body.style.overflow = 'unset';
      // Exit fullscreen on cleanup
      setTimeout(() => exitFullscreen(), 0);
    };
  }, [onClose]);

  const exitFullscreen = () => {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
      // Don't throw, just continue
    }
  };

  const handleClose = () => {
    exitFullscreen();
    onClose();
  };

  if (!media) return null;

  const renderContent = () => {
    const imageUrl = media.url || media.thumbnail;
    
    switch (media.type) {
      case 'image':
        return (
          <img 
            src={imageUrl} 
            alt={media.name}
            className="fullscreen-image"
          />
        );
      
      case 'video':
        return (
          <video 
            src={media.url}
            controls
            autoPlay
            className="fullscreen-video"
          >
            Your browser does not support the video tag.
          </video>
        );
      
      case 'document':
      case 'pdf':
        return (
          <iframe
            src={media.url}
            className="fullscreen-pdf"
            title={media.name}
          />
        );
      
      case 'text':
        return (
          <div
            className="fullscreen-text"
            style={{
              backgroundColor: media.textStyle?.backgroundColor || '#1e40af',
              color: media.textStyle?.color || '#ffffff',
              fontSize: `${media.textStyle?.fontSize || 48}px`,
              fontWeight: media.textStyle?.fontWeight || 'bold',
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
            {media.textContent || 'No text content'}
          </div>
        );
      
      default:
        return (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <p style={{ fontSize: '20px', marginBottom: '20px' }}>Preview not available</p>
            <a 
              href={media.url} 
              download={media.name}
              className="btn-primary"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#6366f1',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none'
              }}
            >
              Download File
            </a>
          </div>
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fullscreen-preview"
      onClick={handleClose}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="fullscreen-close-btn"
        aria-label="Close fullscreen"
      >
        <X size={24} />
      </button>

      {/* ESC hint */}
      <div className="fullscreen-hint">
        Press <kbd>ESC</kbd> to exit fullscreen
      </div>

      {/* Media name */}
      <div className="fullscreen-info">
        <p style={{ fontWeight: '600', marginBottom: '4px' }}>{media.name}</p>
        <p style={{ fontSize: '14px', opacity: 0.8 }}>{media.size}</p>
      </div>

      {/* Content */}
      <div 
        className="fullscreen-content"
        onClick={(e) => e.stopPropagation()}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default FullscreenPreview;
