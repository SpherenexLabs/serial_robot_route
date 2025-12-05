import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Image,
  Video,
  FileText,
  File,
  Trash2,
  Eye,
  MoreVertical,
  Search,
  Filter,
  Grid,
  List,
  X,
} from 'lucide-react';
import { subscribeToMedia, uploadMedia, deleteMedia } from '../firebase/mediaService';
import { logActivity } from '../firebase/dashboardService';
import FullscreenPreview from '../components/FullscreenPreview';
import '../components/FullscreenPreview.css';

const MediaLibrary = () => {
  const { setPageTitle } = useOutletContext();
  const [media, setMedia] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showTextCreator, setShowTextCreator] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [textStyle, setTextStyle] = useState({
    fontSize: '48',
    color: '#ffffff',
    backgroundColor: '#1e40af',
    fontWeight: 'bold'
  });

  useEffect(() => {
    setPageTitle('Media Library');

    // Subscribe to real-time media updates
    const unsubscribe = subscribeToMedia((mediaData) => {
      setMedia(mediaData);
    });

    return () => unsubscribe();
  }, [setPageTitle]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      setLoading(true);
      for (const file of acceptedFiles) {
        try {
          const metadata = {
            type: getFileType(file.type),
            size: formatFileSize(file.size),
            thumbnail: null, // Let uploadMedia handle the thumbnail URL
          };
          
          await uploadMedia(file, metadata);
          await logActivity('Media uploaded', {
            file: file.name,
            details: file.name,
            device: 'Admin'
          });
        } catch (error) {
          console.error('Error uploading file:', error);
          alert(`Failed to upload ${file.name}`);
        }
      }
      setLoading(false);
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt'],
    },
  });

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('pdf')) return 'document';
    if (mimeType.startsWith('text/')) return 'text';
    return 'other';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'document': return File;
      case 'text': return FileText;
      default: return File;
    }
  };

  const handleDeleteMedia = async (id) => {
    const mediaItem = media.find(m => m.id === id);
    if (!mediaItem) return;

    if (window.confirm(`Delete ${mediaItem.name}?`)) {
      try {
        await deleteMedia(id, mediaItem.storagePath);
        await logActivity('Media deleted', {
          file: mediaItem.name,
          details: mediaItem.name,
          device: 'Admin'
        });
      } catch (error) {
        console.error('Error deleting media:', error);
        alert('Failed to delete media');
      }
    }
  };

  const previewMedia = (item) => {
    console.log('Preview media item:', item);
    console.log('Item textContent:', item.textContent);
    console.log('Item textStyle:', item.textStyle);
    setSelectedMedia(item);
    setShowPreview(true);
  };

  const createTextMedia = async () => {
    if (!textContent.trim()) {
      alert('Please enter some text');
      return;
    }

    setLoading(true);
    try {
      const metadata = {
        type: 'text',
        size: `${textContent.length} chars`,
        textContent: textContent,
        textStyle: textStyle,
      };

      // Create a blob for text content
      const textBlob = new Blob([JSON.stringify({ content: textContent, style: textStyle })], { type: 'application/json' });
      
      // Add file-like properties to the blob
      const fileName = `text-${Date.now()}.json`;
      textBlob.name = fileName;
      textBlob.lastModified = Date.now();

      await uploadMedia(textBlob, metadata);
      await logActivity('Text media created', {
        file: 'Text content',
        details: textContent.substring(0, 50) + (textContent.length > 50 ? '...' : ''),
        device: 'Admin'
      });

      setShowTextCreator(false);
      setTextContent('');
      setTextStyle({
        fontSize: '48',
        color: '#ffffff',
        backgroundColor: '#1e40af',
        fontWeight: 'bold'
      });
    } catch (error) {
      console.error('Error creating text media:', error);
      alert('Failed to create text media');
    }
    setLoading(false);
  };

  const filteredMedia = media.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="media-library-container">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`upload-area ${isDragActive ? 'active' : ''} ${loading ? 'disabled' : ''}`}
        style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.6 : 1 }}
      >
        <input {...getInputProps()} disabled={loading} />
        <Upload size={48} />
        {loading ? (
          <p className="upload-text">Uploading to Firebase Storage...</p>
        ) : isDragActive ? (
          <p className="upload-text active">Drop files here...</p>
        ) : (
          <>
            <p className="upload-text">
              Drag & drop files here, or click to browse
            </p>
            <p className="upload-hint">
              Supports: Images, Videos, PDFs, Text files
            </p>
          </>
        )}
      </div>

      {/* Toolbar */}
      <div className="media-toolbar">
        {/* Create Text Button */}
        <button
          onClick={() => setShowTextCreator(true)}
          className="btn-primary"
          style={{ marginRight: '16px' }}
        >
          <FileText size={20} />
          Create Text
        </button>

        {/* Search */}
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="filter-buttons">
          <button
            onClick={() => setFilterType('all')}
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`filter-btn ${filterType === 'image' ? 'active' : ''}`}
          >
            Images
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`filter-btn ${filterType === 'video' ? 'active' : ''}`}
          >
            Videos
          </button>
          <button
            onClick={() => setFilterType('document')}
            className={`filter-btn ${filterType === 'document' ? 'active' : ''}`}
          >
            Documents
          </button>
          <button
            onClick={() => setFilterType('text')}
            className={`filter-btn ${filterType === 'text' ? 'active' : ''}`}
          >
            Text
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="view-toggle">
          <button
            onClick={() => setViewMode('grid')}
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="media-grid">
          {filteredMedia.map((item) => {
            const Icon = getFileIcon(item.type);
            return (
              <div key={item.id} className="media-card">
                {/* Thumbnail */}
                <div className="media-thumbnail">
                  {item.thumbnail && !item.thumbnail.startsWith('blob:') ? (
                    <img 
                      src={item.thumbnail} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const icon = e.target.nextElementSibling;
                        if (icon) icon.style.display = 'block';
                      }}
                    />
                  ) : (
                    <Icon size={48} />
                  )}
                  <div className="media-overlay">
                    <button onClick={() => previewMedia(item)} className="media-action-btn">
                      <Eye size={20} />
                    </button>
                    <button onClick={() => handleDeleteMedia(item.id)} className="media-action-btn delete">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="media-info">
                  <h3>{item.name}</h3>
                  <div className="media-meta">
                    <span>{item.size}</span>
                    <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
                  </div>
                  {item.dimensions && (
                    <p className="media-detail">{item.dimensions}</p>
                  )}
                  {item.duration && (
                    <p className="media-detail">Duration: {item.duration}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="media-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedia.map((item) => {
                const Icon = getFileIcon(item.type);
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="table-cell-content">
                        <Icon size={20} />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge">{item.type}</span>
                    </td>
                    <td>{item.size}</td>
                    <td>{new Date(item.uploadDate).toLocaleDateString()}</td>
                    <td className="table-actions">
                      <button onClick={() => previewMedia(item)} className="btn-icon primary">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleDeleteMedia(item.id)} className="btn-icon danger">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Fullscreen Preview */}
      {showPreview && selectedMedia && (
        <FullscreenPreview
          media={selectedMedia}
          onClose={() => {
            setShowPreview(false);
            setSelectedMedia(null);
          }}
        />
      )}

      {/* Text Creator Modal */}
      {showTextCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Create Text Content</h3>
              <button
                onClick={() => setShowTextCreator(false)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 pt-4">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Content
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter your text here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Style Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size (px)
                  </label>
                  <input
                    type="number"
                    value={textStyle.fontSize}
                    onChange={(e) => setTextStyle({ ...textStyle, fontSize: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Weight
                  </label>
                  <select
                    value={textStyle.fontWeight}
                    onChange={(e) => setTextStyle({ ...textStyle, fontWeight: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={textStyle.color}
                    onChange={(e) => setTextStyle({ ...textStyle, color: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={textStyle.backgroundColor}
                    onChange={(e) => setTextStyle({ ...textStyle, backgroundColor: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div
                  className="w-full p-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: textStyle.backgroundColor,
                    color: textStyle.color,
                    fontSize: `${parseInt(textStyle.fontSize) / 2}px`,
                    fontWeight: textStyle.fontWeight,
                    minHeight: '150px'
                  }}
                >
                  {textContent || 'Your text will appear here...'}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={createTextMedia}
                  disabled={!textContent.trim() || loading}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Creating...' : 'Create Text Media'}
                </button>
                <button
                  onClick={() => setShowTextCreator(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredMedia.length === 0 && (
        <div className="empty-state">
          <Upload size={48} />
          <h3>No media found</h3>
          <p>
            {searchQuery ? 'Try adjusting your search or filters' : 'Upload your first media file to get started'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
