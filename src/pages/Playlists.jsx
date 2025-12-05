import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Play,
  Pause,
  GripVertical,
  Trash2,
  Clock,
  Calendar,
  Repeat,
  Eye,
  Edit,
  Save,
  X,
  PlaySquare,
  Image,
  FileText,
} from 'lucide-react';
import { subscribeToPlaylists, createPlaylist, updatePlaylist, deletePlaylist, updatePlaylistItems } from '../firebase/playlistService';
import { logActivity } from '../firebase/dashboardService';
import { subscribeToMedia } from '../firebase/mediaService';

const SortableItem = ({ id, item, onDelete, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical size={20} />
      </button>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {item.duration}s
          </span>
          {item.type === 'video' && item.startTime > 0 && (
            <span className="flex items-center gap-1 text-blue-600">
              <PlaySquare size={14} />
              Start: {item.startTime}s
            </span>
          )}
          {item.loop && (
            <span className="flex items-center gap-1 text-indigo-600">
              <Repeat size={14} />
              Loop
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const Playlists = () => {
  const { setPageTitle } = useOutletContext();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [availableMedia, setAvailableMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    console.log('Playlists component mounted');
    setPageTitle('Playlists');
    setLoading(true);

    // Subscribe to real-time playlist updates
    const unsubscribePlaylists = subscribeToPlaylists((playlistsData) => {
      console.log('Received playlists data:', playlistsData);
      setPlaylists(playlistsData);
      setLoading(false);
    });

    // Subscribe to real-time media updates for media selector
    const unsubscribeMedia = subscribeToMedia((mediaData) => {
      console.log('Received media data:', mediaData);
      setAvailableMedia(mediaData);
    });

    return () => {
      unsubscribePlaylists();
      unsubscribeMedia();
    };
  }, [setPageTitle]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id && selectedPlaylist && selectedPlaylist.items) {
      const oldIndex = selectedPlaylist.items.findIndex((item) => item.id === active.id);
      const newIndex = selectedPlaylist.items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(selectedPlaylist.items, oldIndex, newIndex);
      const updatedPlaylist = { ...selectedPlaylist, items: newItems };

      setSelectedPlaylist(updatedPlaylist);
      
      try {
        await updatePlaylistItems(selectedPlaylist.id, newItems);
        await logActivity('Playlist updated', {
          file: selectedPlaylist.name,
          details: 'Items reordered',
          device: 'Admin'
        });
      } catch (error) {
        console.error('Error updating playlist order:', error);
      }
    }
  };

  const deleteItem = async (itemId) => {
    if (selectedPlaylist && selectedPlaylist.items) {
      const newItems = selectedPlaylist.items.filter((item) => item.id !== itemId);
      const updatedPlaylist = {
        ...selectedPlaylist,
        items: newItems,
      };
      setSelectedPlaylist(updatedPlaylist);
      
      try {
        await updatePlaylistItems(selectedPlaylist.id, newItems);
        await logActivity('Playlist updated', {
          file: selectedPlaylist.name,
          details: 'Item removed',
          device: 'Admin'
        });
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const editItem = (item) => {
    setEditingItem({ ...item });
  };

  const saveItem = async () => {
    if (editingItem && selectedPlaylist && selectedPlaylist.items) {
      const newItems = selectedPlaylist.items.map((item) =>
        item.id === editingItem.id ? editingItem : item
      );
      const updatedPlaylist = {
        ...selectedPlaylist,
        items: newItems,
      };
      setSelectedPlaylist(updatedPlaylist);
      setEditingItem(null);
      
      try {
        await updatePlaylistItems(selectedPlaylist.id, newItems);
        await logActivity('Playlist updated', {
          file: selectedPlaylist.name,
          details: 'Item settings updated',
          device: 'Admin'
        });
      } catch (error) {
        console.error('Error saving item:', error);
      }
    }
  };

  const savePlaylist = async () => {
    if (selectedPlaylist) {
      try {
        await updatePlaylist(selectedPlaylist.id, {
          name: selectedPlaylist.name,
          schedule: selectedPlaylist.schedule,
          isActive: selectedPlaylist.isActive,
          lastSync: new Date().toISOString(),
        });
        await logActivity('Playlist updated', {
          file: selectedPlaylist.name,
          details: 'Playlist settings saved',
          device: 'Admin'
        });
        alert('Playlist saved successfully!');
      } catch (error) {
        console.error('Error saving playlist:', error);
        alert('Error saving playlist');
      }
    }
  };

  const syncPlaylist = async () => {
    if (selectedPlaylist) {
      try {
        await updatePlaylist(selectedPlaylist.id, {
          ...selectedPlaylist,
          lastSync: new Date().toISOString(),
        });
        await logActivity('Playlist synced', {
          file: selectedPlaylist.name,
          details: 'Manual sync triggered',
          device: 'Admin'
        });
        // Update local state
        setSelectedPlaylist({
          ...selectedPlaylist,
          lastSync: new Date().toISOString(),
        });
        alert('Playlist synced successfully!');
      } catch (error) {
        console.error('Error syncing playlist:', error);
        alert('Error syncing playlist');
      }
    }
  };

  const createNewPlaylist = async () => {
    const playlistData = {
      name: 'New Playlist',
      items: [],
      schedule: { start: '09:00', end: '17:00', days: [1, 2, 3, 4, 5] },
      isActive: true,
    };
    
    try {
      const newPlaylist = await createPlaylist(playlistData);
      await logActivity('Playlist created', {
        file: playlistData.name,
        details: 'New playlist created',
        device: 'Admin'
      });
      
      // Select the newly created playlist
      setSelectedPlaylist(newPlaylist);
      setShowEditor(true);
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('Failed to create playlist');
    }
  };

  const togglePlaylistActive = async (id) => {
    const playlist = playlists.find(p => p.id === id);
    if (playlist) {
      try {
        await updatePlaylist(id, { isActive: !playlist.isActive });
        await logActivity('Playlist status changed', {
          file: playlist.name,
          details: `Playlist ${!playlist.isActive ? 'activated' : 'deactivated'}`,
          device: 'Admin'
        });
      } catch (error) {
        console.error('Error toggling playlist:', error);
      }
    }
  };

  const handleDeletePlaylist = async (id) => {
    const playlist = playlists.find(p => p.id === id);
    if (playlist && window.confirm(`Delete playlist "${playlist.name}"?`)) {
      try {
        await deletePlaylist(id);
        await logActivity('Playlist deleted', {
          file: playlist.name,
          details: 'Playlist deleted',
          device: 'Admin'
        });
        if (selectedPlaylist?.id === id) {
          setSelectedPlaylist(null);
        }
      } catch (error) {
        console.error('Error deleting playlist:', error);
        alert('Failed to delete playlist');
      }
    }
  };

  const addMediaToPlaylist = async (media) => {
    if (selectedPlaylist) {
      const newItem = {
        id: Date.now().toString(),
        name: media.name,
        type: media.type,
        url: media.url,
        thumbnail: media.thumbnail,
        duration: 10,
        loop: false,
        startTime: 0,
      };

      const newItems = [...(selectedPlaylist.items || []), newItem];
      const updatedPlaylist = {
        ...selectedPlaylist,
        items: newItems,
      };
      setSelectedPlaylist(updatedPlaylist);
      
      try {
        await updatePlaylistItems(selectedPlaylist.id, newItems);
        await logActivity('Media added to playlist', {
          file: selectedPlaylist.name,
          details: `Added ${media.name}`,
          device: 'Admin'
        });
        setShowMediaSelector(false);
      } catch (error) {
        console.error('Error adding media:', error);
        alert('Failed to add media to playlist');
      }
    }
  };

  const savePlaylistName = async (newName) => {
    if (selectedPlaylist && newName.trim()) {
      try {
        await updatePlaylist(selectedPlaylist.id, { name: newName });
        setSelectedPlaylist({ ...selectedPlaylist, name: newName });
        await logActivity('Playlist renamed', {
          file: newName,
          details: `Renamed to ${newName}`,
          device: 'Admin'
        });
      } catch (error) {
        console.error('Error updating playlist name:', error);
      }
    }
  };

  const getDayName = (dayNum) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayNum];
  };

  const getTotalDuration = (items) => {
    return items.reduce((total, item) => total + item.duration, 0);
  };

  return (
    <div className="playlists-container">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">
            Manage your display playlists and schedules
          </p>
        </div>
        <button
          onClick={createNewPlaylist}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          New Playlist
        </button>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playlist List */}
        <div className="space-y-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className={`
                bg-white rounded-xl shadow-sm border-2 p-4 cursor-pointer
                transition-all
                ${
                  selectedPlaylist?.id === playlist.id
                    ? 'border-indigo-600 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => {
                setSelectedPlaylist(playlist);
                setShowEditor(true);
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{playlist.name}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlaylistActive(playlist.id);
                    }}
                    className={`
                      p-2 rounded-lg transition-colors
                      ${
                        playlist.isActive
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                    title={playlist.isActive ? 'Playlist is Active (Click to Deactivate)' : 'Playlist is Inactive (Click to Activate)'}
                  >
                    {playlist.isActive ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlaylist(playlist.id);
                    }}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>{playlist.items?.length || 0} items</span>
                  <span>{getTotalDuration(playlist.items || [])}s total</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>
                    {playlist.schedule?.start || '09:00'} - {playlist.schedule?.end || '17:00'}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  <Calendar size={14} />
                  {(playlist.schedule?.days || []).map((day) => (
                    <span
                      key={day}
                      className="px-2 py-1 bg-gray-100 rounded text-xs"
                    >
                      {getDayName(day)}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Last sync: {new Date(playlist.lastSync).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Playlist Editor */}
        <div className="lg:col-span-2">
          {showEditor && selectedPlaylist ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={selectedPlaylist.name}
                    onChange={(e) =>
                      setSelectedPlaylist({ ...selectedPlaylist, name: e.target.value })
                    }
                    className="text-2xl font-bold text-gray-900 border-0 border-b-2 border-transparent hover:border-gray-300 focus:border-indigo-600 focus:outline-none w-full"
                  />
                </div>
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye size={18} />
                  Preview
                </button>
              </div>

              {/* Schedule Settings */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={selectedPlaylist.schedule.start}
                      onChange={(e) =>
                        setSelectedPlaylist({
                          ...selectedPlaylist,
                          schedule: { ...selectedPlaylist.schedule, start: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={selectedPlaylist.schedule.end}
                      onChange={(e) =>
                        setSelectedPlaylist({
                          ...selectedPlaylist,
                          schedule: { ...selectedPlaylist.schedule, end: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active Days
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                      <button
                        key={day}
                        onClick={() => {
                          const days = selectedPlaylist.schedule.days.includes(day)
                            ? selectedPlaylist.schedule.days.filter((d) => d !== day)
                            : [...selectedPlaylist.schedule.days, day];
                          setSelectedPlaylist({
                            ...selectedPlaylist,
                            schedule: { ...selectedPlaylist.schedule, days },
                          });
                        }}
                        className={`
                          px-4 py-2 rounded-lg font-medium transition-colors
                          ${
                            selectedPlaylist.schedule.days.includes(day)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }
                        `}
                      >
                        {getDayName(day)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Save Playlist Button */}
                <div className="mt-4">
                  <button
                    onClick={savePlaylist}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Save size={18} />
                    Save Playlist Changes
                  </button>
                </div>
              </div>

              {/* Playlist Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">
                    Playlist Items ({selectedPlaylist.items?.length || 0})
                  </h4>
                  <button
                    onClick={() => setShowMediaSelector(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Add Media
                  </button>
                </div>
                {(selectedPlaylist.items?.length || 0) > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={(selectedPlaylist.items || []).map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {(selectedPlaylist.items || []).map((item) => (
                          <SortableItem
                            key={item.id}
                            id={item.id}
                            item={item}
                            onDelete={deleteItem}
                            onEdit={editItem}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No items in this playlist</p>
                    <button 
                      onClick={() => setShowMediaSelector(true)}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Add Media
                    </button>
                  </div>
                )}
              </div>

              {/* Sync Status */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Sync Status</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Last synced: {new Date(selectedPlaylist.lastSync || new Date()).toLocaleString()}
                    </p>
                  </div>
                  <button 
                    onClick={syncPlaylist}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Sync Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <PlaySquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Playlist Selected
              </h3>
              <p className="text-gray-500">
                Select a playlist from the list or create a new one
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Media Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  value={editingItem.duration}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, duration: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              {editingItem.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.startTime || 0}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, startTime: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Enter start time in seconds"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Video will start playing from this time
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="loop"
                  checked={editingItem.loop}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, loop: e.target.checked })
                  }
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-600"
                />
                <label htmlFor="loop" className="text-sm font-medium text-gray-700">
                  Loop this item
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={saveItem}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Save size={18} />
                Save
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Selector Modal */}
      {showMediaSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Media to Playlist
                </h3>
                <button
                  onClick={() => setShowMediaSelector(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {availableMedia.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No media available. Upload media first in Media Library.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {availableMedia.map((media) => (
                    <div
                      key={media.id}
                      onClick={() => addMediaToPlaylist(media)}
                      className="cursor-pointer border-2 border-gray-200 rounded-lg p-3 hover:border-indigo-600 hover:shadow-md transition-all"
                    >
                      {media.type === 'image' && media.thumbnail && !media.thumbnail.startsWith('blob:') && (
                        <img
                          src={media.thumbnail}
                          alt={media.name}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      {(media.type === 'image' && (!media.thumbnail || media.thumbnail.startsWith('blob:'))) && (
                        <div className="w-full h-32 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                          <Image size={32} className="text-gray-400" />
                        </div>
                      )}
                      {media.type === 'video' && (
                        <div className="w-full h-32 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                          <PlaySquare size={32} className="text-gray-400" />
                        </div>
                      )}
                      {media.type === 'document' && (
                        <div className="w-full h-32 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                          <FileText size={32} className="text-gray-400" />
                        </div>
                      )}
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {media.name}
                      </p>
                      <p className="text-xs text-gray-500">{media.size}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedPlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="max-w-6xl w-full">
            <div className="bg-gray-900 rounded-t-xl p-4 flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-lg font-semibold">{selectedPlaylist.name} - Preview</h3>
                <p className="text-sm text-gray-400">
                  Item {currentPreviewIndex + 1} of {selectedPlaylist.items?.length || 0}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setCurrentPreviewIndex(0);
                }}
                className="p-2 text-white hover:bg-gray-800 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            <div className="bg-black aspect-video flex items-center justify-center">
              {(selectedPlaylist.items?.length || 0) > 0 ? (
                <div className="text-center text-white">
                  <p className="text-2xl mb-4">
                    {(selectedPlaylist.items || [])[currentPreviewIndex]?.name}
                  </p>
                  <p className="text-gray-400">
                    Duration: {(selectedPlaylist.items || [])[currentPreviewIndex]?.duration}s
                  </p>
                </div>
              ) : (
                <p className="text-gray-400">No items to preview</p>
              )}
            </div>
            {(selectedPlaylist.items?.length || 0) > 0 && (
              <div className="bg-gray-900 rounded-b-xl p-4 flex items-center justify-center gap-4">
                <button
                  onClick={() =>
                    setCurrentPreviewIndex((prev) =>
                      prev > 0 ? prev - 1 : (selectedPlaylist.items?.length || 1) - 1
                    )
                  }
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPreviewIndex((prev) =>
                      prev < (selectedPlaylist.items?.length || 1) - 1 ? prev + 1 : 0
                    )
                  }
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlists;
