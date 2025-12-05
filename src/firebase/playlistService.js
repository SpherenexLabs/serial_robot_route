import { ref, onValue, push, set, remove, update, get } from 'firebase/database';
import { database } from './config';

// Playlists CRUD operations
export const subscribeToPlaylists = (callback) => {
  const playlistsRef = ref(database, 'playlists');
  return onValue(playlistsRef, (snapshot) => {
    const data = snapshot.val();
    const playlistsArray = data ? Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })).filter(item => item.name) : []; // Filter out empty objects
    callback(playlistsArray);
  });
};

export const createPlaylist = async (playlistData) => {
  try {
    const playlistsRef = ref(database, 'playlists');
    const newPlaylistRef = push(playlistsRef);
    
    const playlist = {
      name: playlistData.name || 'New Playlist',
      items: playlistData.items || [],
      schedule: playlistData.schedule || { start: '09:00', end: '21:00', days: [1, 2, 3, 4, 5, 6, 0] },
      isActive: playlistData.isActive !== undefined ? playlistData.isActive : true,
      lastSync: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await set(newPlaylistRef, playlist);
    
    // Update stats
    await updatePlaylistStats();
    
    return { id: newPlaylistRef.key, ...playlist };
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

// Auto-update playlist stats
const updatePlaylistStats = async () => {
  try {
    const playlistsRef = ref(database, 'playlists');
    const snapshot = await get(playlistsRef);
    const data = snapshot.val();
    const activePlaylists = data 
      ? Object.values(data).filter(p => p.isActive && p.name).length 
      : 0;

    const statsRef = ref(database, 'dashboard/stats');
    await update(statsRef, {
      activePlaylists,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating playlist stats:', error);
  }
};

export const updatePlaylist = async (playlistId, updates) => {
  try {
    const playlistRef = ref(database, `playlists/${playlistId}`);
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await update(playlistRef, updatedData);
    
    // Update stats if isActive changed
    if (updates.isActive !== undefined) {
      await updatePlaylistStats();
    }
  } catch (error) {
    console.error('Error updating playlist:', error);
    throw error;
  }
};

export const deletePlaylist = async (playlistId) => {
  try {
    const playlistRef = ref(database, `playlists/${playlistId}`);
    await remove(playlistRef);
    
    // Update stats
    await updatePlaylistStats();
  } catch (error) {
    console.error('Error deleting playlist:', error);
    throw error;
  }
};

export const updatePlaylistItems = async (playlistId, items) => {
  try {
    const playlistRef = ref(database, `playlists/${playlistId}`);
    await update(playlistRef, {
      items,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating playlist items:', error);
    throw error;
  }
};
