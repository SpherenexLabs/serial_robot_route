// Example API integration points for backend connectivity

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Media API
export const mediaAPI = {
  // Upload media file
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // Get all media
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/media`);
    return response.json();
  },

  // Delete media
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/media/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Playlist API
export const playlistAPI = {
  // Get all playlists
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/playlists`);
    return response.json();
  },

  // Create playlist
  create: async (playlist) => {
    const response = await fetch(`${API_BASE_URL}/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playlist),
    });
    return response.json();
  },

  // Update playlist
  update: async (id, playlist) => {
    const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playlist),
    });
    return response.json();
  },

  // Delete playlist
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/playlists/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Sync playlist to devices
  sync: async (playlistId, deviceIds) => {
    const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceIds }),
    });
    return response.json();
  },
};

// Device API
export const deviceAPI = {
  // Get all devices
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/devices`);
    return response.json();
  },

  // Get device details
  getDetails: async (id) => {
    const response = await fetch(`${API_BASE_URL}/devices/${id}`);
    return response.json();
  },

  // Send command to device
  sendCommand: async (id, command) => {
    const response = await fetch(`${API_BASE_URL}/devices/${id}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }), // command: 'restart', 'refresh', 'shutdown', 'sync'
    });
    return response.json();
  },

  // Get device metrics
  getMetrics: async (id) => {
    const response = await fetch(`${API_BASE_URL}/devices/${id}/metrics`);
    return response.json();
  },
};

// WebSocket for real-time updates
export const createWebSocketConnection = (onMessage) => {
  const ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:3000');

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };

  return ws;
};

// Example usage in components:
/*
import { mediaAPI, playlistAPI, deviceAPI } from './api';

// In MediaLibrary component:
const handleUpload = async (file) => {
  try {
    const result = await mediaAPI.upload(file);
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// In Playlists component:
const handleSync = async (playlistId, deviceIds) => {
  try {
    await playlistAPI.sync(playlistId, deviceIds);
    alert('Playlist synced successfully!');
  } catch (error) {
    console.error('Sync failed:', error);
  }
};

// In Devices component:
const handleRestart = async (deviceId) => {
  try {
    await deviceAPI.sendCommand(deviceId, 'restart');
    alert('Restart command sent!');
  } catch (error) {
    console.error('Command failed:', error);
  }
};

// WebSocket usage:
useEffect(() => {
  const ws = createWebSocketConnection((data) => {
    if (data.type === 'device_status') {
      updateDeviceStatus(data.deviceId, data.status);
    }
  });

  return () => ws.close();
}, []);
*/
